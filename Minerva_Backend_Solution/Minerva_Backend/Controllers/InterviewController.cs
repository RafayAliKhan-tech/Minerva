using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Interview;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController(IInterviewService _interviewService) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpPost("StartInterview")]
        public async Task<IActionResult> StartInterviewAsync([FromBody] StartInterviewDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _interviewService.StartInterview(userId, dto);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("SubmitInterview")]
        public async Task<IActionResult> SubmitInterviewAsync([FromBody] SubmitInterviewDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _interviewService.SubmitInterview(userId, dto);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("GetInterviewResult/{attemptId}")]
        public async Task<IActionResult> GetInterviewResultAsync(string attemptId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _interviewService.GetResult(userId, attemptId);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }
    }
}
