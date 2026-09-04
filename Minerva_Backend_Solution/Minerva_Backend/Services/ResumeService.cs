using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
    public class ResumeService(AppDbContext _context, IResumeBridgeService _bridge) : IResumeService
    {
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".docx"
        };

        public async Task<ResponseResult<object>> EvaluateResume(string userId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "No file uploaded.",
                    Status = false,
                };
            }

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedExtensions.Contains(extension))
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Only PDF and DOCX files are supported.",
                    Status = false,
                };
            }

            // 5 MB limit — reasonable cap for a resume file
            if (file.Length > 5 * 1024 * 1024)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "File size must be under 5 MB.",
                    Status = false,
                };
            }

            await using var stream = file.OpenReadStream();

            var result = await _bridge.EvaluateResumeAsync(stream, file.FileName, file.ContentType);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Resume evaluation service is unavailable or the file could not be processed.",
                    Status = false,
                };
            }

            var analysis = new ResumeAnalysis
            {
                UserId = userId,
                FileName = file.FileName,
                ResultJson = JsonSerializer.Serialize(result)
            };

            _context.ResumeAnalyses.Add(analysis);
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = result,
                Message = "Resume evaluated successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> GetLatestResult(string userId)
        {
            var latest = await _context.ResumeAnalyses
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (latest == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "No resume analysis found. Please upload a resume first.",
                    Status = false,
                };
            }

            return new ResponseResult<object>
            {
                Data = JsonSerializer.Deserialize<object>(latest.ResultJson),
                Message = "Resume analysis fetched successfully.",
                Status = true,
            };
        }
    }
}