using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController(IResumeService _resumeService) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpPost("UploadResume")]
        public async Task<IActionResult> UploadResumeAsync(IFormFile file)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _resumeService.EvaluateResume(userId, file);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("GetResumeResult")]
        public async Task<IActionResult> GetResumeResultAsync()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _resumeService.GetLatestResult(userId);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
