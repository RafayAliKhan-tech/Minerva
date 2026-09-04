using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Route3;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Route3Controller(IRoute3Service _route3Service) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpPost("StartRoute3")]
        public async Task<IActionResult> StartRoute3Async(IFormFile file)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _route3Service.StartAssessment(userId, file);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("SubmitRoute3")]
        public async Task<IActionResult> SubmitRoute3Async([FromBody] SubmitRoute3Dto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _route3Service.SubmitAssessment(userId, dto);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("GetRoute3Result/{attemptId}")]
        public async Task<IActionResult> GetRoute3ResultAsync(string attemptId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _route3Service.GetResult(userId, attemptId);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }
    }
}
