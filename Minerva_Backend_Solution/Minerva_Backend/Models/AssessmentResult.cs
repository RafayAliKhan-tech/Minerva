namespace Minerva_Backend.Models
{
    public class AssessmentResult
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string AttemptId { get; set; } = string.Empty;
        public AssessmentAttempt? Attempt { get; set; }

        public string UserId { get; set; } = string.Empty;

        public int OverallScore { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public string Classification { get; set; } = string.Empty;

        // Store full JSON blobs from scoring engine for flexibility
        public string CategoriesJson { get; set; } = string.Empty;
        public string StrengthsJson { get; set; } = string.Empty;
        public string ModerateAreasJson { get; set; } = string.Empty;
        public string WeaknessesJson { get; set; } = string.Empty;
        public string QuestionsJson { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}