namespace Minerva_Backend.DTO.Chat
{
    public class SendChatMessageDto
    {
        public string? SessionId { get; set; } // null = start a new session
        public string Message { get; set; } = string.Empty;
    }
}