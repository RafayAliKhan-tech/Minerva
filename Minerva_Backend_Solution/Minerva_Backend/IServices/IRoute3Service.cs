using Microsoft.AspNetCore.Http;
using Minerva_Backend.DTO.Route3;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IRoute3Service
    {
        public Task<ResponseResult<object>> StartAssessment(string userId, IFormFile file);
        public Task<ResponseResult<object>> SubmitAssessment(string userId, SubmitRoute3Dto dto);
        public Task<ResponseResult<object>> GetResult(string userId, string attemptId);
    }
}