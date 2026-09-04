using Minerva_Backend.DTO.Chat;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IChatService
    {
        Task<ResponseResult<object>> SendMessage(string userId, SendChatMessageDto dto);
        Task<ResponseResult<object>> GetHistory(string userId, string sessionId);
    }
}