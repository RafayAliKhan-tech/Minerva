using Minerva_Backend.DTO.Auth;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IAuthService
    {
        public Task<ResponseResult<string>> RegisterUser(RegisterUserDTO dto);
        public Task<ResponseResult<string>> LoginUser(LoginUserDTO dto);
    }
}
