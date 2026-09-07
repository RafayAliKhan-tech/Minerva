using System.Net.Http.Json;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class CareerMatchingService(HttpClient _httpClient) : ICareerMatchingService
    {
        public async Task<object?> MatchCareersAsync(Dictionary<string, double> studentSkills)
        {
            var response = await _httpClient.PostAsJsonAsync("/career/match", new { student_skills = studentSkills });

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object?> CompareCareersAsync(List<object> selectedCareers, Dictionary<string, double> studentSkills)
        {
            var response = await _httpClient.PostAsJsonAsync("/career/compare", new
            {
                selected_careers = selectedCareers,
                student_skills = studentSkills
            });

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            return await response.Content.ReadFromJsonAsync<object>();
        }
    }
}