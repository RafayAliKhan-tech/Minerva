using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Assessment;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
    public class AssessmentService(AppDbContext _context, IScoringService _scoringService) : IAssessmentService
    {
        public async Task<ResponseResult<StartAssessmentResponseDto>> StartAssessment(string userId)
        {
            var questions = await _context.AssessmentQuestions.ToListAsync();

            if (!questions.Any())
            {
                return new ResponseResult<StartAssessmentResponseDto>
                {
                    Data = null,
                    Message = "No assessment questions found.",
                    Status = false,
                };
            }

            var attempt = new AssessmentAttempt
            {
                UserId = userId
            };
            _context.AssessmentAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            var questionDtos = questions.Select(q => new AssessmentQuestionDto
            {
                QuestionId = q.QuestionId,
                Category = q.Category,
                Difficulty = q.Difficulty,
                QuestionType = q.QuestionType,
                QuestionText = q.QuestionText,
                Options = JsonSerializer.Deserialize<List<QuestionOptionDto>>(q.OptionsJson) ?? new()
            }).ToList();

            return new ResponseResult<StartAssessmentResponseDto>
            {
                Data = new StartAssessmentResponseDto
                {
                    AttemptId = attempt.Id,
                    Questions = questionDtos
                },
                Message = "Assessment started successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<AssessmentResultResponseDto>> SubmitAssessment(string userId, SubmitAssessmentDTO dto)
        {
            var attempt = await _context.AssessmentAttempts
                .FirstOrDefaultAsync(a => a.Id == dto.AttemptId && a.UserId == userId);

            if (attempt == null)
            {
                return new ResponseResult<AssessmentResultResponseDto>
                {
                    Data = null,
                    Message = "Assessment attempt not found.",
                    Status = false,
                };
            }

            if (attempt.IsSubmitted)
            {
                return new ResponseResult<AssessmentResultResponseDto>
                {
                    Data = null,
                    Message = "This assessment has already been submitted.",
                    Status = false,
                };
            }

            // Save individual answers
            foreach (var (questionId, selectedOption) in dto.Answers)
            {
                _context.AssessmentAnswers.Add(new AssessmentAnswer
                {
                    AttemptId = attempt.Id,
                    QuestionId = questionId,
                    SelectedOption = selectedOption
                });
            }

            // Call Member 1's scoring engine
            var scoringResult = await _scoringService.ScoreAssessmentAsync(dto.Answers);

            if (scoringResult == null)
            {
                return new ResponseResult<AssessmentResultResponseDto>
                {
                    Data = null,
                    Message = "Scoring service is unavailable. Please try again later.",
                    Status = false,
                };
            }

            var result = new AssessmentResult
            {
                AttemptId = attempt.Id,
                UserId = userId,

                OverallScore = scoringResult.Results.Overall.Score,
                MaxScore = scoringResult.Results.Overall.MaxScore,
                Percentage = scoringResult.Results.Overall.Percentage,
                Classification = scoringResult.Results.Overall.Classification,

                CategoriesJson = JsonSerializer.Serialize(
        scoringResult.Results.Categories
    ),

                StrengthsJson = JsonSerializer.Serialize(
        scoringResult.Results.Strengths
    ),

                ModerateAreasJson = JsonSerializer.Serialize(
        scoringResult.Results.ModerateAreas
    ),

                WeaknessesJson = JsonSerializer.Serialize(
        scoringResult.Results.Weaknesses
    ),

                QuestionsJson = JsonSerializer.Serialize(
        scoringResult.Results.Questions
    )
            };

            _context.AssessmentResults.Add(result);

            attempt.IsSubmitted = true;
            attempt.SubmittedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ResponseResult<AssessmentResultResponseDto>
            {
                Data = MapToDto(result),
                Message = "Assessment submitted and scored successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<AssessmentResultResponseDto>> GetResult(string userId, string attemptId)
        {
            var result = await _context.AssessmentResults
                .FirstOrDefaultAsync(r => r.AttemptId == attemptId && r.UserId == userId);

            if (result == null)
            {
                return new ResponseResult<AssessmentResultResponseDto>
                {
                    Data = null,
                    Message = "Result not found.",
                    Status = false,
                };
            }

            return new ResponseResult<AssessmentResultResponseDto>
            {
                Data = MapToDto(result),
                Message = "Result fetched successfully.",
                Status = true,
            };
        }

        private static AssessmentResultResponseDto MapToDto(AssessmentResult result)
        {
            return new AssessmentResultResponseDto
            {
                AttemptId = result.AttemptId,
                OverallScore = result.OverallScore,
                MaxScore = result.MaxScore,
                Percentage = result.Percentage,
                Classification = result.Classification,
                Categories = JsonSerializer.Deserialize<object>(result.CategoriesJson),
                Strengths = JsonSerializer.Deserialize<object>(result.StrengthsJson),
                ModerateAreas = JsonSerializer.Deserialize<object>(result.ModerateAreasJson),
                Weaknesses = JsonSerializer.Deserialize<object>(result.WeaknessesJson),
                CreatedAt = result.CreatedAt
            };
        }
    }
}