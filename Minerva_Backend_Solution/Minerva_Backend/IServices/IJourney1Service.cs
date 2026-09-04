using Minerva_Backend.DTO.Journey1;
using Minerva_Backend.DTO.Journey2;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IJourney1Service
    {
        Task<ResponseResult<List<Journey1QuestionDTO>>> GetQuestions();
        Task<ResponseResult<object>> SubmitAssessment(string userId, SubmitJourney1DTO dto);
        Task<ResponseResult<object>> GetResult(string userId, string assessmentId);
    }
}