using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Interview;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
    public class InterviewService(AppDbContext _context, IInterviewBridgeService _bridge) : IInterviewService
    {
        public async Task<ResponseResult<object>> StartInterview(string userId, StartInterviewDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.TargetRole))
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Target role is required.",
                    Status = false,
                };
            }

            if (dto.SkillProfile == null || dto.SkillProfile.Count == 0)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Skill profile is required.",
                    Status = false,
                };
            }

            var result = await _bridge.StartAsync(dto.TargetRole, dto.SkillProfile, dto.NumQuestions);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Interview service is unavailable.",
                    Status = false,
                };
            }

            // Extract questions array from Python response wrapper
            var resultElement = result is JsonElement re ? re : JsonSerializer.SerializeToElement(result);
            string questionsJson;
            if (resultElement.ValueKind == JsonValueKind.Object && resultElement.TryGetProperty("data", out var dataProp))
            {
                questionsJson = dataProp.GetRawText();
            }
            else
            {
                questionsJson = resultElement.GetRawText();
            }

            var attempt = new InterviewAttempt
            {
                UserId = userId,
                TargetRole = dto.TargetRole,
                QuestionsJson = questionsJson
            };

            _context.InterviewAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = new
                {
                    attemptId = attempt.Id,
                    targetRole = dto.TargetRole,
                    questions = JsonSerializer.Deserialize<object>(questionsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                },
                Message = "Interview started successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> SubmitInterview(string userId, SubmitInterviewDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.AttemptId))
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "AttemptId is required.",
                    Status = false,
                };
            }

            var attempt = await _context.InterviewAttempts
                .FirstOrDefaultAsync(a => a.Id == dto.AttemptId && a.UserId == userId);

            if (attempt == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Interview attempt not found.",
                    Status = false,
                };
            }

            if (attempt.IsSubmitted)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "This interview has already been submitted.",
                    Status = false,
                };
            }

            // Deserialize stored questions
            var questions = JsonSerializer.Deserialize<List<QuestionDto>>(attempt.QuestionsJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

            if (dto.Answers.Count != questions.Count ||
                !dto.Answers.Select(a => a.Id).OrderBy(x => x)
                    .SequenceEqual(questions.Select(q => q.Id).OrderBy(x => x)))
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Submitted answers do not match the interview's questions.",
                    Status = false,
                };
            }

            var result = await _bridge.EvaluateAsync(questions, dto.Answers, attempt.TargetRole);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Interview evaluation service is unavailable.",
                    Status = false,
                };
            }

            var interviewResult = new InterviewResult
            {
                AttemptId = attempt.Id,
                UserId = userId,
                ResultJson = JsonSerializer.Serialize(result)
            };

            _context.InterviewResults.Add(interviewResult);
            attempt.IsSubmitted = true;
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = result,
                Message = "Interview submitted and evaluated successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> GetResult(string userId, string attemptId)
        {
            var result = await _context.InterviewResults
                .Where(r => r.AttemptId == attemptId && r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "No interview result found for this attempt.",
                    Status = false,
                };
            }

            return new ResponseResult<object>
            {
                Data = JsonSerializer.Deserialize<object>(result.ResultJson),
                Message = "Interview result fetched successfully.",
                Status = true,
            };
        }
    }
}
