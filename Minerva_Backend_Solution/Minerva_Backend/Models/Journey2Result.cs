namespace Minerva_Backend.Models
{
    public class Journey2Result
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string Career { get; set; } = string.Empty;

        public string ResultJson { get; set; } = string.Empty; // full Python response, stored as-is

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}