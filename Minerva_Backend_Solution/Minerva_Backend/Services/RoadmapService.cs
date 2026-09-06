using Minerva_Backend.IServices;
using System.Text.Json;
using System.Net.Http.Json;
using YourProject.Roadmap.Models;

namespace YourProject.Roadmap.Services
{

    public class RoadmapService : IRoadmapService
    {
        private readonly HttpClient _http;
        private readonly ILogger<RoadmapService> _logger;

        // _http.BaseAddress is set via DI registration (see Program.cs snippet)
        public RoadmapService(HttpClient http, ILogger<RoadmapService> logger)
        {
            _http = http;
            _logger = logger;
        }

        public async Task<RoadmapGenerateResponse> GenerateAsync(RoadmapGenerateRequest request, CancellationToken ct = default)
        {
            if (request.Journey == 1)
            {
                request.UseModel = false;
            }

            var response = await _http.PostAsJsonAsync("/api/roadmap/generate", request, ct);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError("Roadmap engine returned HTTP {StatusCode}: {ResponseBody}", (int)response.StatusCode, errorBody);
                throw new HttpRequestException(
                    $"Roadmap engine returned {(int)response.StatusCode}: {errorBody}");
            }

            var responseBody = await response.Content.ReadAsStringAsync(ct);
            _logger.LogInformation("Roadmap engine returned HTTP {StatusCode} for Journey {Journey}", (int)response.StatusCode, request.Journey);
            RoadmapGenerateResponse? result;
            try
            {
                result = JsonSerializer.Deserialize<RoadmapGenerateResponse>(responseBody);
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException($"Roadmap engine returned an invalid success payload: {ex.Message}", ex);
            }

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