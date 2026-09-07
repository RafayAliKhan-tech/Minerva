using Minerva_Backend.DTO.Assessment;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface IAssessmentService
    {
        public Task<ResponseResult<StartAssessmentResponseDto>> StartAssessment(string userId);
        public Task<ResponseResult<AssessmentResultResponseDto>> SubmitAssessment(string userId, SubmitAssessmentDTO dto);
        public Task<ResponseResult<AssessmentResultResponseDto>> GetResult(string userId, string attemptId);
    }
}
