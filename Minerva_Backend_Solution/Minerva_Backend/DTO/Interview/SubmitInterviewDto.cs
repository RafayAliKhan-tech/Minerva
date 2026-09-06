namespace Minerva_Backend.DTO.Interview
{
    public class InterviewAnswerDto
    {
        public string Id { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
    }

    public class InterviewEvaluationDto
    {
        public string Id { get; set; } = string.Empty;
        public int Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
    }

    public class SubmitInterviewDto
    {
        public string AttemptId { get; set; } = string.Empty;
        public List<InterviewAnswerDto> Answers { get; set; } = new();
    }
}