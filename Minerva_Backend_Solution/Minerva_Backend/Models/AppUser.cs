using Microsoft.AspNetCore.Identity;

namespace Minerva_Backend.Models;

public class AppUser : IdentityUser   // IdentityUser = IdentityUser<string> by default
{
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public UserProfile? Profile { get; set; }
}