using System.Net.Http.Json;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class Journey2BridgeService(HttpClient _httpClient) : IJourney2BridgeService
    {
        public async Task<object?> GetQuestionsAsync(string career)
        {
            var response = await _httpClient.GetAsync($"/journey2/questions?career={Uri.EscapeDataString(career)}");
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object?> SubmitAsync(string career, Dictionary<string, string> answers)
        {
            var payload = new { career, answers };
            var response = await _httpClient.PostAsJsonAsync("/journey2/submit", payload);
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<object>();
        }
    }
}