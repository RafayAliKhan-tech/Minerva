namespace Minerva_Backend.DTO.Journey2
{
    public class SubmitJourney2DTO
    {
        public string Career { get; set; } = string.Empty;
        public Dictionary<string, string> Answers { get; set; } = new();
    }
}