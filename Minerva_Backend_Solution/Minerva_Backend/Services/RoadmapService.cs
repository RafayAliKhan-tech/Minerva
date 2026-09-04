using Minerva_Backend.IServices;
using System.Net.Http.Json;
using YourProject.Roadmap.Models;

namespace YourProject.Roadmap.Services
{

    public class RoadmapService : IRoadmapService
    {
        private readonly HttpClient _http;

        // _http.BaseAddress is set via DI registration (see Program.cs snippet)
        public RoadmapService(HttpClient http)
        {
            _http = http;
        }

        public async Task<RoadmapGenerateResponse> GenerateAsync(RoadmapGenerateRequest request, CancellationToken ct = default)
        {
            var response = await _http.PostAsJsonAsync("/api/roadmap/generate", request, ct);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync(ct);
                throw new HttpRequestException(
                    $"Roadmap engine returned {(int)response.StatusCode}: {errorBody}");
            }

            var result = await response.Content.ReadFromJsonAsync<RoadmapGenerateResponse>(cancellationToken: ct);
            return result ?? throw new InvalidOperationException("Empty response from roadmap engine.");
        }

        public async Task<System.Text.Json.JsonElement> GetResultAsync(string roadmapId, CancellationToken ct = default)
        {
            var response = await _http.GetAsync($"/api/roadmap/result/{roadmapId}", ct);

            if (!response.IsSuccessStatusCode)
            {
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    throw new KeyNotFoundException($"Roadmap {roadmapId} not found.");

                var errorBody = await response.Content.ReadAsStringAsync(ct);
                throw new HttpRequestException(
                    $"Roadmap engine returned {(int)response.StatusCode}: {errorBody}");
            }

            return await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>(cancellationToken: ct);
        }
    }
}