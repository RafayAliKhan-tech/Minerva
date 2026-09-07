namespace Minerva_Backend.IServices
{
    public interface IChatBridgeService
    {
        public Task<object?> SendMessageAsync(string message, object skillProfile, object history, string? career);
    }
}