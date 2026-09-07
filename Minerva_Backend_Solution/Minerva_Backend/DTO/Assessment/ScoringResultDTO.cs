using System.Text.Json.Serialization;

namespace Minerva_Backend.DTO.Assessment
{
    public class ScoringResultDTO
    {
        [JsonPropertyName("assessment")]
        public AssessmentInfoDTO Assessment { get; set; } = new();

        [JsonPropertyName("results")]
        public AssessmentResultsDTO Results { get; set; } = new();
    }

    public class AssessmentInfoDTO
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("version")]
        public string Version { get; set; } = string.Empty;

        [JsonPropertyName("total_questions")]
        public int TotalQuestions { get; set; }
    }

    public class AssessmentResultsDTO
    {
        [JsonPropertyName("overall")]
        public OverallScoreDTO Overall { get; set; } = new();

        [JsonPropertyName("categories")]
        public Dictionary<string, CategoryScoreDTO> Categories { get; set; } = new();

        [JsonPropertyName("strengths")]
        public List<CategoryPercentageDTO> Strengths { get; set; } = new();

        [JsonPropertyName("moderate_areas")]
        public List<CategoryPercentageDTO> ModerateAreas { get; set; } = new();

        [JsonPropertyName("weaknesses")]
        public List<CategoryPercentageDTO> Weaknesses { get; set; } = new();

        [JsonPropertyName("questions")]
        public List<object> Questions { get; set; } = new();
    }

    public class OverallScoreDTO
    {
        [JsonPropertyName("score")]
        public int Score { get; set; }

        [JsonPropertyName("max_score")]
        public int MaxScore { get; set; }

        [JsonPropertyName("percentage")]
        public double Percentage { get; set; }

        [JsonPropertyName("classification")]
        public string Classification { get; set; } = string.Empty;
    }

    public class CategoryScoreDTO
    {
        [JsonPropertyName("score")]
        public int Score { get; set; }

        [JsonPropertyName("max_score")]
        public int MaxScore { get; set; }

        [JsonPropertyName("questions")]
        public int Questions { get; set; }

        [JsonPropertyName("correct")]
        public int Correct { get; set; }

        [JsonPropertyName("incorrect")]
        public int Incorrect { get; set; }

        [JsonPropertyName("percentage")]
        public double Percentage { get; set; }
    }

    public class CategoryPercentageDTO
    {
        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;

        [JsonPropertyName("percentage")]
        public double Percentage { get; set; }
    }
}