namespace Minerva_Backend.Models;

public class UserProfile
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? UserId { get; set; }
    public AppUser? User { get; set; }

    public string? University { get; set; }
    public string? Degree { get; set; }
    public string? Semester { get; set; }
    public string? Interests { get; set; }
    public string? Skills { get; set; }
    public string? GitHubUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? JourneyType { get; set; }
}