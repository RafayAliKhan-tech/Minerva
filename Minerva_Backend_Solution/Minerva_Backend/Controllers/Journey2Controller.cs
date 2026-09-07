using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Journey2;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Journey2Controller(IJourney2Service _journey2Service) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpGet("GetJourney2Careers")]
        public IActionResult GetJourney2Careers()
        {
            return Ok(_journey2Service.GetCareers());
        }

        [HttpGet("GetJourney2Questions/{career}")]
        public async Task<IActionResult> GetJourney2QuestionsAsync(string career)
        {
            var result = await _journey2Service.GetQuestions(career);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("SubmitJourney2")]
        public async Task<IActionResult> SubmitJourney2Async([FromBody] SubmitJourney2DTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _journey2Service.Submit(userId, dto);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("GetJourney2Result/{career}")]
        public async Task<IActionResult> GetJourney2ResultAsync(string career)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _journey2Service.GetResult(userId, career);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
