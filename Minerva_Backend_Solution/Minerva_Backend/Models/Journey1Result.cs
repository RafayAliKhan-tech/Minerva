namespace Minerva_Backend.Models
{
    public class Journey1Result
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string AssessmentId { get; set; } = Guid.NewGuid().ToString();

        public string ResultJson { get; set; } = string.Empty; // full Python response, stored as-is

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
