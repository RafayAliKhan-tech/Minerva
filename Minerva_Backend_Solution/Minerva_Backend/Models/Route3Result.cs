namespace Minerva_Backend.Models
{
    public class Route3Result
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string AttemptId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;

        public string ResultJson { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}