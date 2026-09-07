using System.Net.Http.Json;
using Minerva_Backend.DTO.Assessment;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class ScoringService(HttpClient httpClient) : IScoringService
    {
        public async Task<ScoringResultDTO?> ScoreAssessmentAsync(
            Dictionary<string, string> answers)
        {
            var payload = new
            {
                answers
            };

            var response = await httpClient.PostAsJsonAsync(
                "/score",
                payload
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();

                throw new HttpRequestException(
                    $"Scoring service returned {(int)response.StatusCode}: {error}"
                );
            }

            var scoringResponse =
    await response.Content.ReadFromJsonAsync<ScoringResultDTO>();

            return scoringResponse;
        }
    }
}