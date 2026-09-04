namespace Minerva_Backend.DTO.Interview
{
    public class StartInterviewDto
    {
        public string TargetRole { get; set; } = string.Empty;
        public List<object> SkillProfile { get; set; } = new();
        public int NumQuestions { get; set; } = 5;
    }
}