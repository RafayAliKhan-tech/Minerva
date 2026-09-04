using System.Text.Json.Serialization;

namespace YourProject.Roadmap.Models
{
    public class RoadmapGenerateRequest
    {
        [JsonPropertyName("journey")]
        public int Journey { get; set; }               // 1, 2, or 3

        [JsonPropertyName("journey_output")]
        public object JourneyOutput { get; set; }       // raw JSON from the AI/ML Python side (pass-through)

        [JsonPropertyName("weekly_hours")]
        public double? WeeklyHours { get; set; }

        [JsonPropertyName("goal")]
        public string? Goal { get; set; }

        [JsonPropertyName("target_role")]
        public string? TargetRole { get; set; }

        [JsonPropertyName("preferred_days")]
        public int? PreferredDays { get; set; }

        [JsonPropertyName("use_model")]
        public bool UseModel { get; set; } = true;

        [JsonPropertyName("user_id")]
        public string? UserId { get; set; }
    }

    public class RoadmapGenerateResponse
    {
        [JsonPropertyName("roadmap_id")]
        public string RoadmapId { get; set; } = string.Empty;

        // Journey 1 -> a JSON array; Journey 2/3 -> a JSON object.
        // Left as JsonElement so callers can branch on ValueKind
        // (matches the Python engine's documented dual return shape).
        [JsonPropertyName("result")]
        public System.Text.Json.JsonElement Result { get; set; }
    }
}
