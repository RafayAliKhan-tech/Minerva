using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.IServices;
using YourProject.Roadmap.Models;
using YourProject.Roadmap.Services;

namespace YourProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoadmapController : ControllerBase
    {
        private readonly IRoadmapService _roadmapService;

        public RoadmapController(IRoadmapService roadmapService)
        {
            _roadmapService = roadmapService;
        }

        // POST /api/roadmap/generate
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] RoadmapGenerateRequest request, CancellationToken ct)
        {
            try
            {
                var result = await _roadmapService.GenerateAsync(request, ct);
                return Ok(result);
            }
            catch (HttpRequestException ex)
            {
                // Python engine itself errored (bad journey_output shape, etc.)
                return StatusCode(502, new { error = ex.Message });
            }
        }

        // GET /api/roadmap/result/{roadmapId}
        [HttpGet("result/{roadmapId}")]
        public async Task<IActionResult> GetResult(string roadmapId, CancellationToken ct)
        {
            try
            {
                var result = await _roadmapService.GetResultAsync(roadmapId, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = $"Roadmap {roadmapId} not found." });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { error = ex.Message });
            }
        }
    }
}