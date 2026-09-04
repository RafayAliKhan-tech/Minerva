//using System.Net.Http.Json;
//using Minerva_Backend.IServices;

//namespace Minerva_Backend.Services
//{
//    public class ChatBridgeService(HttpClient _httpClient) : IChatBridgeService
//    {
//        public async Task<object?> SendMessageAsync(
//            string message,
//            object skillProfile,
//            object history,
//            string? career)
//        {
//            var payload = new
//            {
//                message,
//                skill_profile = skillProfile,
//                conversation_history = history,
//                career
//            };

//            try
//            {
//                var response = await _httpClient.PostAsJsonAsync(
//                    "/chat/message",
//                    payload
//                );

//                var responseBody = await response.Content.ReadAsStringAsync();

//                Console.WriteLine("========== CHAT BRIDGE DEBUG ==========");
//                Console.WriteLine($"Request URL: {_httpClient.BaseAddress}/chat/message");
//                Console.WriteLine($"Status Code: {(int)response.StatusCode} {response.StatusCode}");
//                Console.WriteLine($"Response Body: {responseBody}");
//                Console.WriteLine("=======================================");

//                if (!response.IsSuccessStatusCode)
//                {
//                    return null;
//                }

//                return await response.Content.ReadFromJsonAsync<object>();
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine("========== CHAT BRIDGE EXCEPTION ==========");
//                Console.WriteLine(ex.ToString());
//                Console.WriteLine("==========================================");

//                return null;
//            }
//        }
//    }
//}


using System.Net.Http.Json;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services
{
    public class ChatBridgeService(HttpClient _httpClient) : IChatBridgeService
    {
        public async Task<object?> SendMessageAsync(
            string message,
            object skillProfile,
            object history,
            string? career)
        {
            var payload = new
            {
                message,
                skill_profile = skillProfile,
                conversation_history = history,
                career
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync(
                    "chat/message",
                    payload
                );

                var responseBody = await response.Content.ReadAsStringAsync();

                Console.WriteLine("========== CHAT BRIDGE DEBUG ==========");
                Console.WriteLine($"Request URL: {_httpClient.BaseAddress}chat/message");
                Console.WriteLine($"Status Code: {(int)response.StatusCode} {response.StatusCode}");
                Console.WriteLine($"Response Body: {responseBody}");
                Console.WriteLine("=======================================");

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                return await response.Content.ReadFromJsonAsync<object>();
            }
            catch (Exception ex)
            {
                Console.WriteLine("========== CHAT BRIDGE EXCEPTION ==========");
                Console.WriteLine(ex);
                Console.WriteLine("==========================================");

                return null;
            }
        }
    }
}