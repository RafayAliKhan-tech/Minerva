namespace Minerva_Backend.IServices
{
    public interface IResumeBridgeService
    {
        Task<object?> EvaluateResumeAsync(Stream fileStream, string fileName, string contentType);
    }
}