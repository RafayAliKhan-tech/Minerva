using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Route3;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
    public class Route3Service(AppDbContext _context, IRoute3BridgeService _bridge) : IRoute3Service
    {
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".docx"
        };

        public async Task<ResponseResult<object>> StartAssessment(string userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return new ResponseResult<object> { Data = null, Message = "No file uploaded.", Status = false };
            }

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedExtensions.Contains(extension))
            {
                return new ResponseResult<object> { Data = null, Message = "Only PDF and DOCX files are supported.", Status = false };
            }

            if (file.Length > 5 * 1024 * 1024)
            {
                return new ResponseResult<object> { Data = null, Message = "File size must be under 5 MB.", Status = false };
            }

            await using var stream = file.OpenReadStream();
            var result = await _bridge.StartAsync(stream, file.FileName, file.ContentType);

            if (result == null)
            {
                return new ResponseResult<object> { Data = null, Message = "Route 3 service is unavailable.", Status = false };
            }

            // Parse the Python response to extract career/questions/analysis for storage
            var json = JsonSerializer.Serialize(result);
            using var doc = JsonDocument.Parse(json);
            var data = doc.RootElement.GetProperty("data");

            var career = data.GetProperty("career").GetString() ?? string.Empty;
            var questionsJson = data.GetProperty("questions").GetRawText();
            var analysisJson = data.GetProperty("analysis_result").GetRawText();

            var attempt = new Route3Attempt
            {
                UserId = userId,
                Career = career,
                QuestionsJson = questionsJson,
                AnalysisResultJson = analysisJson
            };

            _context.Route3Attempts.Add(attempt);
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = new
                {
                    attemptId = attempt.Id,
                    career,
                    questions = JsonSerializer.Deserialize<object>(questionsJson),
                    analysisResult = JsonSerializer.Deserialize<object>(analysisJson)
                },
                Message = "Route 3 assessment started successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> SubmitAssessment(string userId, SubmitRoute3Dto dto)
        {
            var attempt = await _context.Route3Attempts
                .FirstOrDefaultAsync(a => a.Id == dto.AttemptId && a.UserId == userId);

            if (attempt == null)
            {
                return new ResponseResult<object> { Data = null, Message = "Route 3 attempt not found.", Status = false };
            }

            if (attempt.IsSubmitted)
            {
                return new ResponseResult<object> { Data = null, Message = "This assessment has already been submitted.", Status = false };
            }

            var questions = JsonSerializer.Deserialize<object>(attempt.QuestionsJson)!;

            var result = await _bridge.SubmitAsync(questions, dto.Answers, attempt.Career);

            if (result == null)
            {
                return new ResponseResult<object> { Data = null, Message = "Route 3 evaluation service is unavailable.", Status = false };
            }

            var route3Result = new Route3Result
            {
                AttemptId = attempt.Id,
                UserId = userId,
                ResultJson = JsonSerializer.Serialize(result)
            };

            _context.Route3Results.Add(route3Result);
            attempt.IsSubmitted = true;
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = result,
                Message = "Route 3 assessment submitted successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> GetResult(string userId, string attemptId)
        {
            var result = await _context.Route3Results
                .Where(r => r.AttemptId == attemptId && r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return new ResponseResult<object> { Data = null, Message = "No Route 3 result found for this attempt.", Status = false };
            }

            return new ResponseResult<object>
            {
                Data = JsonSerializer.Deserialize<object>(result.ResultJson),
                Message = "Route 3 result fetched successfully.",
                Status = true,
            };
        }
    }
}