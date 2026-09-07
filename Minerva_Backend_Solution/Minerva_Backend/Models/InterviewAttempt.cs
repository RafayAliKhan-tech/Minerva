namespace Minerva_Backend.Models
{
    public class InterviewAttempt
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string TargetRole { get; set; } = string.Empty;

        public string QuestionsJson { get; set; } = string.Empty;

        public bool IsSubmitted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}