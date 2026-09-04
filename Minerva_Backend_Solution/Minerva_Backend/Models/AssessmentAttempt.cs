namespace Minerva_Backend.Models
{
    public class AssessmentAttempt
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public AppUser? User { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SubmittedAt { get; set; }
        public bool IsSubmitted { get; set; } = false;

        public ICollection<AssessmentAnswer> Answers { get; set; } = new List<AssessmentAnswer>();
        public AssessmentResult? Result { get; set; }
    }
}