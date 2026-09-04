using System.Net.Http.Json;
using System.Text.Json;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class InterviewBridgeService(HttpClient _httpClient) : IInterviewBridgeService
    {
        public async Task<object?> StartAsync(string targetRole, List<object> skillProfile, int numQuestions)
        {
            var payload = new
            {
                target_role = targetRole,
                skill_profile = skillProfile,
                num_questions = numQuestions
            };

            var response = await _httpClient.PostAsJsonAsync("/interview/start", payload);
            if (!response.IsSuccessStatusCode) return null;

            return await response.Content.ReadFromJsonAsync<object?>();
        }

        public async Task<object?> EvaluateAsync(object questions, object answers, string targetRole)
        {
            var payload = new
            {
                questions,
                answers,
                target_role = targetRole
            };

            var response = await _httpClient.PostAsJsonAsync("/interview/evaluate", payload);
            if (!response.IsSuccessStatusCode) return null;

            return await response.Content.ReadFromJsonAsync<object?>();
        }
    }
}
