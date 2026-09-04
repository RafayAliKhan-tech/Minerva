namespace Minerva_Backend.Models
{
    public class AssessmentAnswer
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string AttemptId { get; set; } = string.Empty;
        public AssessmentAttempt? Attempt { get; set; }

        public string QuestionId { get; set; } = string.Empty;
        public string SelectedOption { get; set; } = string.Empty; // A/B/C/D
        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
    }
}