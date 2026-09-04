using Microsoft.AspNetCore.Mvc;

namespace Minerva_Backend.Controllers
{
    [Route("health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "healthy"
            });
        }

        [HttpHead]
        public IActionResult Head()
        {
            return Ok();
        }
    }
}