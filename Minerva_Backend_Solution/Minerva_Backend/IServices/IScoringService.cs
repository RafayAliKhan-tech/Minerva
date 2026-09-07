using Minerva_Backend.DTO.Assessment;

namespace Minerva_Backend.IServices
{
    public interface IScoringService
    {
        public Task<ScoringResultDTO?> ScoreAssessmentAsync(Dictionary<string, string> answers);
    }
}