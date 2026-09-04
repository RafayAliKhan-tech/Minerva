using Minerva_Backend.DTO.Profile;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices;

public interface IProfileService
{
    public Task<ResponseResult<ProfileResponseDTO>> GetProfile(string userId);
    public Task<ResponseResult<ProfileResponseDTO>> UpdateProfile(string userId, UpdateProfileDto dto);
    public Task<ResponseResult<string>> UpdateJourney(string userId, UpdateJourneyDTO dto);
}