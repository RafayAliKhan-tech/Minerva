using System.Net.Http.Json;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class Route3BridgeService(HttpClient _httpClient) : IRoute3BridgeService
    {
        public async Task<object?> StartAsync(Stream fileStream, string fileName, string contentType)
        {
            using var content = new MultipartFormDataContent();
            using var streamContent = new StreamContent(fileStream);
            streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);
            content.Add(streamContent, "file", fileName);

            var response = await _httpClient.PostAsync("/route3/start", content);
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object?> SubmitAsync(object questions, List<string> answers, string career)
        {
            var payload = new { questions, answers, career };
            var response = await _httpClient.PostAsJsonAsync("/route3/submit", payload);
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<object>();
        }
    }
}