using Minerva_Backend.DTO.Journey1;
using Minerva_Backend.DTO.Journey2;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IJourney2Service
    {
        List<object> GetCareers();
        Task<ResponseResult<object>> GetQuestions(string career);
        Task<ResponseResult<object>> Submit(string userId, SubmitJourney2DTO dto);
        Task<ResponseResult<object>> GetResult(string userId, string career);
    }
}