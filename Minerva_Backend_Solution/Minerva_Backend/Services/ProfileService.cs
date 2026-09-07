using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Profile;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services;

public class ProfileService : IProfileService
{
    private readonly AppDbContext _context;

    public ProfileService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ResponseResult<ProfileResponseDTO>> GetProfile(string userId)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return new ResponseResult<ProfileResponseDTO>
            {
                Status = false,
                Message = "User not found.",
                Data = null
            };
        }

        // If profile doesn't exist, create an empty profile
        if (user.Profile == null)
        {
            user.Profile = new UserProfile
            {
                UserId = user.Id
            };

            _context.UserProfiles.Add(user.Profile);

            await _context.SaveChangesAsync();
        }

        var profileDto = MapToDto(user, user.Profile);

        return new ResponseResult<ProfileResponseDTO>
        {
            Status = true,
            Message = "Profile retrieved successfully.",
            Data = profileDto
        };
    }

    public async Task<ResponseResult<ProfileResponseDTO>> UpdateProfile(
        string userId,
        UpdateProfileDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return new ResponseResult<ProfileResponseDTO>
            {
                Status = false,
                Message = "User not found.",
                Data = null
            };
        }

        // Create profile if it doesn't exist
        if (user.Profile == null)
        {
            user.Profile = new UserProfile
            {
                UserId = user.Id
            };

            _context.UserProfiles.Add(user.Profile);
        }

        user.Profile.University = dto.University;
        user.Profile.Degree = dto.Degree;
        user.Profile.Semester = dto.Semester;
        user.Profile.Interests = dto.Interests;
        user.Profile.Skills = dto.Skills;
        user.Profile.GitHubUrl = dto.GitHubUrl;
        user.Profile.LinkedInUrl = dto.LinkedInUrl;

        await _context.SaveChangesAsync();

        var profileDto = MapToDto(user, user.Profile);

        return new ResponseResult<ProfileResponseDTO>
        {
            Status = true,
            Message = "Profile updated successfully.",
            Data = profileDto
        };
    }

    public async Task<ResponseResult<string>> UpdateJourney(
        string userId,
        UpdateJourneyDTO dto)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return new ResponseResult<string>
            {
                Status = false,
                Message = "User not found.",
                Data = null
            };
        }

        // Create profile if it doesn't exist
        if (user.Profile == null)
        {
            user.Profile = new UserProfile
            {
                UserId = user.Id
            };

            _context.UserProfiles.Add(user.Profile);
        }

        user.Profile.JourneyType = dto.JourneyType;

        await _context.SaveChangesAsync();

        return new ResponseResult<string>
        {
            Status = true,
            Message = "Journey updated successfully.",
            Data = dto.JourneyType
        };
    }

    private static ProfileResponseDTO MapToDto(
        AppUser user,
        UserProfile? profile)
    {
        return new ProfileResponseDTO
        {
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email ?? string.Empty,

            University = profile?.University,
            Degree = profile?.Degree,
            Semester = profile?.Semester,
            Interests = profile?.Interests,
            Skills = profile?.Skills,
            GitHubUrl = profile?.GitHubUrl,
            LinkedInUrl = profile?.LinkedInUrl,
            JourneyType = profile?.JourneyType
        };
    }
}