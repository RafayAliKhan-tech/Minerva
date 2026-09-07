namespace Minerva_Backend.DTO.Journey1
{
    public class Journey1QuestionDTO
    {
        public string QuestionId { get; set; } = string.Empty;
        public string Career { get; set; } = string.Empty;
        public string CareerName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public string Interaction { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;
        public object Options { get; set; } = new();
    }
}