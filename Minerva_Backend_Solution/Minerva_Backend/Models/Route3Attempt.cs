namespace Minerva_Backend.Models
{
    public class Route3Attempt
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string Career { get; set; } = string.Empty;

        public string QuestionsJson { get; set; } = string.Empty;
        public string AnalysisResultJson { get; set; } = string.Empty;

        public bool IsSubmitted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}