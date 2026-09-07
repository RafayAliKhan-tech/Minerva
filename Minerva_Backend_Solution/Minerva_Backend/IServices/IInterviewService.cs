using Minerva_Backend.DTO.Interview;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IInterviewService
    {
        public Task<ResponseResult<object>> StartInterview(string userId, StartInterviewDto dto);
        public Task<ResponseResult<object>> SubmitInterview(string userId, SubmitInterviewDto dto);
        public Task<ResponseResult<object>> GetResult(string userId, string attemptId);
    }
}