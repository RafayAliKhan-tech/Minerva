namespace Minerva_Backend.DTO.Assessment
{
    // Frontend-facing question - NEVER includes correct_answer
    public class AssessmentQuestionDto
    {
        public string QuestionId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Difficulty { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public string QuestionText { get; set; } = string.Empty;
        public List<QuestionOptionDto> Options { get; set; } = new();
    }
}