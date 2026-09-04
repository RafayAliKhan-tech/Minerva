using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Career;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CareerController(ICareerService _careerService) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        //[Authorize]
        [HttpGet("GetAllCareers")]
        public async Task<IActionResult> GetAllCareersAsync()
        {
            var result = await _careerService.GetAllCareers();
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        //[Authorize]
        [HttpPost("MatchCareers")]
        public async Task<IActionResult> MatchCareersAsync([FromBody] CareerMatchRequestDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _careerService.MatchCareers(userId, dto);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        //[Authorize]
        [HttpPost("CompareCareers")]
        public async Task<IActionResult> CompareCareersAsync([FromBody] CareerCompareRequestDTO dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _careerService.CompareCareers(userId, dto);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
