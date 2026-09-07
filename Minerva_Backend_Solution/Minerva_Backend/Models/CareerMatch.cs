namespace Minerva_Backend.Models
{
    public class CareerMatch
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string AttemptId { get; set; } = string.Empty;

        public string TopCareersJson { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}