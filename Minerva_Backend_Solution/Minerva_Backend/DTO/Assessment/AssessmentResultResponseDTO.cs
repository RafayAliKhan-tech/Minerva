namespace Minerva_Backend.DTO.Assessment
{
    public class AssessmentResultResponseDto
    {
        public string AttemptId { get; set; } = string.Empty;
        public int OverallScore { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public string Classification { get; set; } = string.Empty;
        public object? Categories { get; set; }
        public object? Strengths { get; set; }
        public object? ModerateAreas { get; set; }
        public object? Weaknesses { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}