namespace Minerva_Backend.DTO.Assessment
{
    public class StartAssessmentResponseDto
    {
        public string AttemptId { get; set; } = string.Empty;
        public List<AssessmentQuestionDto> Questions { get; set; } = new();
    }
}