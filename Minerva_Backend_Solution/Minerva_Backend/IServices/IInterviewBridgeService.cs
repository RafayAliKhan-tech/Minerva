using Minerva_Backend.DTO.Interview;

namespace Minerva_Backend.IServices
{
    public interface IInterviewBridgeService
    {
        public Task<object?> StartAsync(string targetRole, List<object> skillProfile, int numQuestions);
        public Task<object?> EvaluateAsync(object questions, object answers, string targetRole);
    }
}