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

        [HttpPost("RequestPasswordReset")]
        public async Task<IActionResult> RequestPasswordResetAsync([FromBody] ForgotPasswordDTO dto)
        {
            var result = await _authService.RequestPasswordReset(dto);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpPost("ValidatePasswordResetToken")]
        public async Task<IActionResult> ValidatePasswordResetTokenAsync([FromBody] ValidateResetTokenDTO dto)
        {
            var result = await _authService.ValidatePasswordResetToken(dto);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordDTO dto)
        {
            var result = await _authService.ResetPassword(dto);
            return result.Status ? Ok(result) : BadRequest(result);
        }

        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmailAsync([FromBody] ConfirmEmailDTO dto)
        {
            var result = await _authService.ConfirmEmail(dto);
            return result.Status ? Ok(result) : BadRequest(result);
        }
    }
}
