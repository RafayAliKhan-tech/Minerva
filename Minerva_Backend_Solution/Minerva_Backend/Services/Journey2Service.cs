using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Journey1;
using Minerva_Backend.DTO.Journey2;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;
using System.Text.Json;

namespace Minerva_Backend.Services
{
    public class Journey2Service(AppDbContext _context, IJourney2BridgeService _bridge) : IJourney2Service
    {
        private static readonly List<object> Careers = new()
        {
            new { career_id = "ui_ux", career_name = "UI/UX Design" },
            new { career_id = "development", career_name = "Software Development" },
            new { career_id = "data", career_name = "Data & Analytics" },
            new { career_id = "ai", career_name = "AI & Machine Learning" },
            new { career_id = "cyber", career_name = "Cybersecurity" },
        };

        public List<object> GetCareers() => Careers;

        public async Task<ResponseResult<object>> GetQuestions(string career)
        {
            var result = await _bridge.GetQuestionsAsync(career);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Invalid career or Journey 2 service unavailable.",
                    Status = false,
                };
            }

            return new ResponseResult<object>
            {
                Data = result,
                Message = "Journey 2 questions fetched successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> Submit(string userId, SubmitJourney2DTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Career) || dto.Answers == null || dto.Answers.Count == 0)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Career and answers are required.",
                    Status = false,
                };
            }

            var result = await _bridge.SubmitAsync(dto.Career, dto.Answers);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Journey 2 scoring service is unavailable or the career/answers were invalid.",
                    Status = false,
                };
            }

            var journey2Result = new Journey2Result
            {
                UserId = userId,
                Career = dto.Career,
                ResultJson = JsonSerializer.Serialize(result)
            };

            _context.Journey2Results.Add(journey2Result);
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = result,
                Message = "Journey 2 assessment submitted successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> GetResult(string userId, string career)
        {
            var result = await _context.Journey2Results
                .Where(r => r.UserId == userId && r.Career == career)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "No Journey 2 result found for this career.",
                    Status = false,
                };
            }

            return new ResponseResult<object>
            {
                Data = JsonSerializer.Deserialize<object>(result.ResultJson),
                Message = "Journey 2 result fetched successfully.",
                Status = true,
            };
        }
    }
}