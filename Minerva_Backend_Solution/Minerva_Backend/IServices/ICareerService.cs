using Minerva_Backend.DTO.Career;
using Minerva_Backend.GenericResponse;

namespace Minerva_Backend.IServices
{
    public interface ICareerService
    {
        public Task<ResponseResult<List<CareerListDto>>> GetAllCareers();
        public Task<ResponseResult<object>> MatchCareers(string userId, CareerMatchRequestDTO dto);
        public Task<ResponseResult<object>> CompareCareers(string userId, CareerCompareRequestDTO dto);
    }
}