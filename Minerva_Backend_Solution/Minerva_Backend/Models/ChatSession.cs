namespace Minerva_Backend.Models
{
    public class ChatSession
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;

        public string? Career { get; set; }
        public string SkillProfileJson { get; set; } = string.Empty; // snapshot at session start
        public string HistoryJson { get; set; } = "[]"; // grows with each message

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}