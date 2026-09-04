using System.Text.Json;
using Minerva_Backend.Data;
using Minerva_Backend.Models;

namespace Minerva_Backend.Helpers
{
    public static class CareerSeeder
    {
        public static async Task SeedCareers(AppDbContext context)
        {
            if (context.Careers.Any())
            {
                return;
            }

            var filePath = Path.Combine(AppContext.BaseDirectory, "SeedData", "career_requirements.json");
            if (!File.Exists(filePath))
            {
                return;
            }

            var json = await File.ReadAllTextAsync(filePath);
            using var doc = JsonDocument.Parse(json);

            var careersArray = doc.RootElement.GetProperty("careers");

            var careers = new List<Career>();

            foreach (var c in careersArray.EnumerateArray())
            {
                careers.Add(new Career
                {
                    CareerId = c.GetProperty("career_id").GetString()!,
                    CareerName = c.GetProperty("career").GetString()!,
                    RequiredSkillsJson = c.GetProperty("required_skills").GetRawText()
                });
            }

            context.Careers.AddRange(careers);
            await context.SaveChangesAsync();
        }
    }
}