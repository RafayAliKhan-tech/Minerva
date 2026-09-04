namespace Minerva_Backend.Models
{
    public class AssessmentQuestion
    {
        public string QuestionId { get; set; } = string.Empty; // e.g. "PS-01"
        public string Category { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public string QuestionText { get; set; } = string.Empty;
        public string OptionsJson { get; set; } = string.Empty; // store options array as JSON string
        public string CorrectAnswer { get; set; } = string.Empty; // NEVER exposed to frontend
        public string? Explanation { get; set; }
        public int Score { get; set; } = 1;
    }
}