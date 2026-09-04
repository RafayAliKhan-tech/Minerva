namespace Minerva_Backend.DTO.Assessment
{
    public class SubmitAssessmentDTO
    {
        public string AttemptId { get; set; } = string.Empty;
        public Dictionary<string, string> Answers { get; set; } = new(); // { "PS-01": "A", ... }
    }
}