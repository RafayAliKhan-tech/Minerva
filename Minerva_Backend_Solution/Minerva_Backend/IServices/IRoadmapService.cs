using YourProject.Roadmap.Models;

namespace Minerva_Backend.IServices
{
    public interface IRoadmapService
    {
        public Task<RoadmapGenerateResponse> GenerateAsync(RoadmapGenerateRequest request, CancellationToken ct = default);
        public Task<System.Text.Json.JsonElement> GetResultAsync(string roadmapId, CancellationToken ct = default);
    }
}
