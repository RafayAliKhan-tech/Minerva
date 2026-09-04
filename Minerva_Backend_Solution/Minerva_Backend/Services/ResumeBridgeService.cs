using System.Net.Http.Json;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class ResumeBridgeService(HttpClient _httpClient) : IResumeBridgeService
    {
        public async Task<object?> EvaluateResumeAsync(Stream fileStream, string fileName, string contentType)
        {
            using var content = new MultipartFormDataContent();
            using var streamContent = new StreamContent(fileStream);
            streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);

            content.Add(streamContent, "file", fileName);

            var response = await _httpClient.PostAsync("/resume/evaluate", content);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            return await response.Content.ReadFromJsonAsync<object>();
        }
    }
}