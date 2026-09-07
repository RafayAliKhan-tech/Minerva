using Microsoft.AspNetCore.Http;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IResumeService
    {
        public Task<ResponseResult<object>> EvaluateResume(string userId, IFormFile file);
        public Task<ResponseResult<object>> GetLatestResult(string userId);
    }
}