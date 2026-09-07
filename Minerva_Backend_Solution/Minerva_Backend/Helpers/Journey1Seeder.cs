using System.Text.Json;
using Minerva_Backend.Data;
using Minerva_Backend.Models;

namespace Minerva_Backend.Helpers
{
    public static class Journey1Seeder
    {
        public static async Task SeedJourney1Questions(AppDbContext context)
        {
            if (context.Journey1Questions.Any())
            {
                return;
            }

            var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "minerva_career_discovery_v4.json");
            if (!File.Exists(filePath))
            {
                return;
            }

            var json = await File.ReadAllTextAsync(filePath);
            using var doc = JsonDocument.Parse(json);

            var exploringQuestions = doc.RootElement
                .GetProperty("questions")
                .GetProperty("exploring");

            var questions = new List<Journey1Question>();

            foreach (var q in exploringQuestions.EnumerateArray())
            {
                // Build options array WITHOUT correct_option — only id + text
                var optionsList = q.GetProperty("options")
                    .EnumerateArray()
                    .Select(o => new
                    {
                        id = o.GetProperty("id").GetString(),
                        text = o.GetProperty("text").GetString()
                    })
                    .ToList();

                questions.Add(new Journey1Question
                {
                    QuestionId = q.GetProperty("id").GetString()!,
                    Career = q.GetProperty("career").GetString()!,
                    CareerName = q.GetProperty("career_name").GetString()!,
                    Title = q.TryGetProperty("title", out var t) ? t.GetString() ?? "" : "",
                    QuestionType = q.TryGetProperty("type", out var ty) ? ty.GetString() ?? "" : "",
                    Interaction = q.TryGetProperty("interaction", out var i) ? i.GetString() ?? "" : "",
                    Instruction = q.GetProperty("instruction").GetString()!,
                    OptionsJson = JsonSerializer.Serialize(optionsList)
                });
            }

            context.Journey1Questions.AddRange(questions);
            await context.SaveChangesAsync();
        }
    }
}