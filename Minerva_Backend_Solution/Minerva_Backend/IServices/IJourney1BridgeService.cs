namespace Minerva_Backend.IServices
{
    public interface IJourney1BridgeService
    {
        public Task<object?> GetQuestionsAsync();
        public Task<object?> CompleteAssessmentAsync(string assessmentId, List<(string QuestionId, string SelectedOption)> answers);
    }
}