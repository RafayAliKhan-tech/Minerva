namespace Minerva_Backend.IServices
{
    public interface ICareerMatchingService
    {
        public Task<object?> MatchCareersAsync(Dictionary<string, double> studentSkills);
        public Task<object?> CompareCareersAsync(List<object> selectedCareers, Dictionary<string, double> studentSkills);
    }
}