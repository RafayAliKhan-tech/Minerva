using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Auth;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.Helpers;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
    public class AuthService(UserManager<AppUser> _userManager, IConfiguration _configuration) : IAuthService
    {
        public async Task<ResponseResult<string>> RegisterUser(RegisterUserDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.userName) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = "Please fill all the required fields.",
                    Status = false,
                };
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = $"{dto.Email} already exists. Please Login.",
                    Status = false,
                };
            }

            var newUser = new AppUser
            {
                UserName = dto.userName,
                Name = dto.userName,
                Email = dto.Email,
                CreatedAt = DateTime.UtcNow,
            };

            var result = await _userManager.CreateAsync(newUser, dto.Password);
            if (!result.Succeeded)
            {
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = string.Join(" , ", result.Errors.Select(e => e.Description)),
                    Status = false,
                };
            }

            else
            {
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = "Account created successfully!",
                    Status = true,
                };
            }
        }

        public async Task<ResponseResult<string>> LoginUser(LoginUserDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = "Please fill all the required fields",
                    Status = false,
                };
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser == null)
            {
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = "Your'e not a valid user. Please register first.",
                    Status = false,
                };
            }

            var validUser = await _userManager.CheckPasswordAsync(existingUser, dto.Password!);
            if (!validUser)
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = "Invalid credentials, Please try again.",
                    Status = false,
                };

            var token = await JwtTokenGenerator.GenerateJWTKey(_configuration, existingUser);
            if (token == null)
            {
                return new ResponseResult<string>
                {
                    Data = null,
                    Message = "An error occured while generating Token.",
                    Status = false,
                };
            }
            else
            {
                return new ResponseResult<string>
                {
                    Data = token,
                    Message = "Login Successful",
                    Status = true,
                };
            }
        }
    }
}
