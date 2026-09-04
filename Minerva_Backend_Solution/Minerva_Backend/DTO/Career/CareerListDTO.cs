namespace Minerva_Backend.DTO.Career
{
    public class CareerListDto
    {
        public string CareerId { get; set; } = string.Empty;
        public string CareerName { get; set; } = string.Empty;
        public Dictionary<string, int> RequiredSkills { get; set; } = new();
    }
}