using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Auth;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService _authService) : ControllerBase
    {
        [HttpPost("RegisterUser")]
        public async Task<IActionResult> RegisterUserAsync([FromBody] RegisterUserDTO dto)
        {
            var result = await _authService.RegisterUser(dto);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPost("LoginUser")]
        public async Task<IActionResult> LoginUserAsync([FromBody] LoginUserDTO dto)
        {
            var result = await _authService.LoginUser(dto);
            if (!result.Status)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }
    }
}
