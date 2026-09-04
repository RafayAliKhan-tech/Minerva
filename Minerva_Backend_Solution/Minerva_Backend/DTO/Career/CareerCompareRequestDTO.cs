namespace Minerva_Backend.DTO.Career
{
    public class SelectedCareerDto
    {
        public string Career { get; set; } = string.Empty;
        public double MatchPercentage { get; set; }
    }

    public class CareerCompareRequestDTO
    {
        public string AttemptId { get; set; } = string.Empty;
        public List<SelectedCareerDto> SelectedCareers { get; set; } = new();
    }
}