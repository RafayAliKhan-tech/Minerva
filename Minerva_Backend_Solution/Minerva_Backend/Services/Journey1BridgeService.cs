using System.Net.Http.Json;
using System.Text.Json;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class Journey1BridgeService(HttpClient _httpClient) : IJourney1BridgeService
    {
        public async Task<object?> GetQuestionsAsync()
        {
            var response = await _httpClient.GetAsync("/journey1/questions");

            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<object>();
        }

        public async Task<object?> CompleteAssessmentAsync(
            string assessmentId,
            List<(string QuestionId, string SelectedOption)> answers)
        {
            var payload = new
            {
                assessment_id = assessmentId,
                answers = answers.Select(a => new
                {
                    question_id = a.QuestionId,
                    selected_option = a.SelectedOption
                })
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync(
                    "/journey1/exploring/complete",
                    payload
                );

                var responseBody =
                    await response.Content.ReadAsStringAsync();

                Console.WriteLine(
                    "===== JOURNEY 1 PYTHON RESPONSE ====="
                );

                Console.WriteLine(
                    $"Status Code: {(int)response.StatusCode} {response.StatusCode}"
                );

                Console.WriteLine(
                    $"Response Body: {responseBody}"
                );

                Console.WriteLine(
                    "======================================"
                );

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                return JsonSerializer.Deserialize<object>(
                    responseBody
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    "===== JOURNEY 1 PYTHON CONNECTION ERROR ====="
                );

                Console.WriteLine(ex.ToString());

                Console.WriteLine(
                    "============================================="
                );

                return null;
            }
        }
    }
}