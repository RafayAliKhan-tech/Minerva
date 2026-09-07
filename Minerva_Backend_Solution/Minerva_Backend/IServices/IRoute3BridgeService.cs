namespace Minerva_Backend.IServices
{
    public interface IRoute3BridgeService
    {
        public Task<object?> StartAsync(Stream fileStream, string fileName, string contentType);
        public Task<object?> SubmitAsync(object questions, List<string> answers, string career);
    }
}