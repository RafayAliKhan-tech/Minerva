using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Assessment;
using Minerva_Backend.DTO.Career;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
    public class CareerService(AppDbContext _context, ICareerMatchingService _careerMatchingService) : ICareerService
    {
        public async Task<ResponseResult<List<CareerListDto>>> GetAllCareers()
        {
            var careers = await _context.Careers.ToListAsync();

            var dtos = careers.Select(c => new CareerListDto
            {
                CareerId = c.CareerId,
                CareerName = c.CareerName,
                RequiredSkills = JsonSerializer.Deserialize<Dictionary<string, int>>(c.RequiredSkillsJson) ?? new()
            }).ToList();

            return new ResponseResult<List<CareerListDto>>
            {
                Data = dtos,
                Message = "Careers fetched successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> MatchCareers(string userId, CareerMatchRequestDTO dto)
        {
            var result = await _context.AssessmentResults
                .FirstOrDefaultAsync(r => r.AttemptId == dto.AttemptId && r.UserId == userId);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Assessment result not found. Complete an assessment first.",
                    Status = false,
                };
            }

            var categories = JsonSerializer.Deserialize<Dictionary<string, CategoryScoreDTO>>(result.CategoriesJson)!;
            var studentSkills = categories.ToDictionary(c => c.Key, c => c.Value.Percentage);

            var matchResult = await _careerMatchingService.MatchCareersAsync(studentSkills);

            if (matchResult == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Career matching service is unavailable. Please try again later.",
                    Status = false,
                };
            }

            var careerMatch = new CareerMatch
            {
                UserId = userId,
                AttemptId = dto.AttemptId,
                TopCareersJson = JsonSerializer.Serialize(matchResult)
            };
            _context.CareerMatches.Add(careerMatch);
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = matchResult,
                Message = "Career match generated successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> CompareCareers(string userId, CareerCompareRequestDTO dto)
        {
            if (dto.SelectedCareers == null || dto.SelectedCareers.Count < 2)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Select at least two careers to compare.",
                    Status = false,
                };
            }

            var result = await _context.AssessmentResults
                .FirstOrDefaultAsync(r => r.AttemptId == dto.AttemptId && r.UserId == userId);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Assessment result not found. Complete an assessment first.",
                    Status = false,
                };
            }

            var categories = JsonSerializer.Deserialize<Dictionary<string, CategoryScoreDTO>>(result.CategoriesJson)!;
            var studentSkills = categories.ToDictionary(c => c.Key, c => c.Value.Percentage);

            var selectedCareers = dto.SelectedCareers
                .Select(c => (object)new { career = c.Career, match_percentage = c.MatchPercentage })
                .ToList();

            var compareResult = await _careerMatchingService.CompareCareersAsync(selectedCareers, studentSkills);

            if (compareResult == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Career comparison service is unavailable. Please try again later.",
                    Status = false,
                };
            }

            var comparison = new CareerComparison
            {
                UserId = userId,
                AttemptId = dto.AttemptId,
                ComparisonResultJson = JsonSerializer.Serialize(compareResult)
            };
            _context.CareerComparisons.Add(comparison);
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = compareResult,
                Message = "Career comparison generated successfully.",
                Status = true,
            };
        }
    }
}