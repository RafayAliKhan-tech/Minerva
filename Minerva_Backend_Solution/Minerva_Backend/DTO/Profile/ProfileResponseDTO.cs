namespace Minerva_Backend.DTO.Profile;

public class ProfileResponseDTO
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? University { get; set; }
    public string? Degree { get; set; }
    public string? Semester { get; set; }
    public string? Interests { get; set; }
    public string? Skills { get; set; }
    public string? GitHubUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? JourneyType { get; set; }
}