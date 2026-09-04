using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Assessment;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssessmentController(IAssessmentService _assessmentService) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [Authorize]
        [HttpGet("StartAssessment")]
        public async Task<IActionResult> StartAssessmentAsync()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _assessmentService.StartAssessment(userId);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [Authorize]
        [HttpPost("SubmitAssessment")]
        public async Task<IActionResult> SubmitAssessmentAsync([FromBody] SubmitAssessmentDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _assessmentService.SubmitAssessment(userId, dto);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [Authorize]
        [HttpGet("GetAssessmentResult/{attemptId}")]
        public async Task<IActionResult> GetAssessmentResultAsync(string attemptId)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _assessmentService.GetResult(userId, attemptId);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
