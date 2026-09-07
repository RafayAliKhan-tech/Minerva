namespace Minerva_Backend.IServices
{
    public interface IJourney2BridgeService
    {
        public Task<object?> GetQuestionsAsync(string career);
        public Task<object?> SubmitAsync(string career, Dictionary<string, string> answers);
    }
}