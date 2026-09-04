namespace Minerva_Backend.DTO.Route3
{
    public class SubmitRoute3Dto
    {
        public string AttemptId { get; set; } = string.Empty;
        public List<string> Answers { get; set; } = new();
    }
}