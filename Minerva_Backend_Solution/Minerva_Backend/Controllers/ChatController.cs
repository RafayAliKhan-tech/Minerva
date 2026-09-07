using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minerva_Backend.DTO.Chat;
using Minerva_Backend.IServices;
using System.Security.Claims;

namespace Minerva_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(IChatService _chatService) : ControllerBase
    {
        private string? GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpPost("SendChatMessage")]
        public async Task<IActionResult> SendChatMessageAsync([FromBody] SendChatMessageDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _chatService.SendMessage(userId, dto);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("GetChatHistory/{sessionId}")]
        public async Task<IActionResult> GetChatHistoryAsync(string sessionId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _chatService.GetHistory(userId, sessionId);
            if (!result.Status) return BadRequest(result);
            return Ok(result);
        }
    }
}
