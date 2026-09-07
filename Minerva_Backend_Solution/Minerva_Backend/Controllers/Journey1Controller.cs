using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Journey1;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]


    public class Journey1Controller(IJourney1Service _journey1Service) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpGet("GetJourney1Questions")]
        public async Task<IActionResult> GetJourney1QuestionsAsync()
        {
            var result = await _journey1Service.GetQuestions();
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("SubmitJourney1")]
        public async Task<IActionResult> SubmitJourney1Async([FromBody] SubmitJourney1DTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _journey1Service.SubmitAssessment(userId, dto);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("GetJourney1Result/{assessmentId}")]
        public async Task<IActionResult> GetJourney1ResultAsync(string assessmentId)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _journey1Service.GetResult(userId, assessmentId);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
