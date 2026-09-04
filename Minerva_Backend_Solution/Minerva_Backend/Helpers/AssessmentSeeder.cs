using System.Text.Json;
using Minerva_Backend.Data;
using Minerva_Backend.Models;

namespace Minerva_Backend.Helpers
{
    public static class AssessmentSeeder
    {
        public static async Task SeedAssessmentQuestions(AppDbContext context)
        {
            if (context.AssessmentQuestions.Any())
            {
                return; // already seeded
            }

            var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "assessment_questions.json");
            if (!File.Exists(filePath))
            {
                return;
            }

            var json = await File.ReadAllTextAsync(filePath);
            using var doc = JsonDocument.Parse(json);

            var questionsArray = doc.RootElement.GetProperty("questions");

            var questions = new List<AssessmentQuestion>();

            foreach (var q in questionsArray.EnumerateArray())
            {
                questions.Add(new AssessmentQuestion
                {
                    QuestionId = q.GetProperty("question_id").GetString()!,
                    Category = q.GetProperty("category").GetString()!,
                    Difficulty = q.GetProperty("difficulty").GetString()!,
                    QuestionType = q.GetProperty("question_type").GetString()!,
                    QuestionText = q.GetProperty("question").GetString()!,
                    OptionsJson = q.GetProperty("options").GetRawText(),
                    CorrectAnswer = q.GetProperty("correct_answer").GetString()!,
                    Explanation = q.TryGetProperty("explanation", out var exp) ? exp.GetString() : null,
                    Score = q.TryGetProperty("score", out var score) ? score.GetInt32() : 1
                });
            }

            context.AssessmentQuestions.AddRange(questions);
            await context.SaveChangesAsync();
        }
    }
}