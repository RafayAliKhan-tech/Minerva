using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Chat;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
    public class ChatService(AppDbContext _context, IChatBridgeService _bridge) : IChatService
    {
        public async Task<ResponseResult<object>> SendMessage(string userId, SendChatMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return new ResponseResult<object> { Data = null, Message = "Message cannot be empty.", Status = false };
            }

            ChatSession? session;

            if (!string.IsNullOrWhiteSpace(dto.SessionId))
            {
                session = await _context.ChatSessions
                    .FirstOrDefaultAsync(s => s.Id == dto.SessionId && s.UserId == userId);

                if (session == null)
                {
                    return new ResponseResult<object> { Data = null, Message = "Chat session not found.", Status = false };
                }
            }
            else
            {
                // Start a new session — pull the most recent skill profile across all sources
                var (skillProfileJson, career) = await GetLatestSkillProfile(userId);

                if (skillProfileJson == null)
                {
                    return new ResponseResult<object>
                    {
                        Data = null,
                        Message = "No assessment result found. Complete an assessment before starting a chat.",
                        Status = false,
                    };
                }

                session = new ChatSession
                {
                    UserId = userId,
                    Career = career,
                    SkillProfileJson = skillProfileJson,
                    HistoryJson = "[]"
                };
                _context.ChatSessions.Add(session);
                await _context.SaveChangesAsync();
            }

            var skillProfile = JsonSerializer.Deserialize<object>(session.SkillProfileJson)!;
            var history = JsonSerializer.Deserialize<object>(session.HistoryJson)!;

            var result = await _bridge.SendMessageAsync(dto.Message, skillProfile, history, session.Career);

            if (result == null)
            {
                return new ResponseResult<object> { Data = null, Message = "Chat service is unavailable.", Status = false };
            }

            // Extract updated_history from Python's response and persist it
            var json = JsonSerializer.Serialize(result);
            using var doc = JsonDocument.Parse(json);
            var data = doc.RootElement.GetProperty("data");

            var updatedHistory = data.GetProperty("updated_history").GetRawText();
            var reply = data.GetProperty("response").GetString();

            session.HistoryJson = updatedHistory;
            session.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = new
                {
                    sessionId = session.Id,
                    response = reply
                },
                Message = "Message sent successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> GetHistory(string userId, string sessionId)
        {
            var session = await _context.ChatSessions
                .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

            if (session == null)
            {
                return new ResponseResult<object> { Data = null, Message = "Chat session not found.", Status = false };
            }

            return new ResponseResult<object>
            {
                Data = new
                {
                    sessionId = session.Id,
                    career = session.Career,
                    history = JsonSerializer.Deserialize<object>(session.HistoryJson)
                },
                Message = "Chat history fetched successfully.",
                Status = true,
            };
        }

        private async Task<(string? skillProfileJson, string? career)> GetLatestSkillProfile(string userId)
        {
            // Check Route3 first (most specific — resume-based)
            var route3 = await _context.Route3Results
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (route3 != null)
            {
                using var doc = JsonDocument.Parse(route3.ResultJson);
                var skillProfile = doc.RootElement.GetProperty("data").GetProperty("skill_profile").GetRawText();
                var attempt = await _context.Route3Attempts.FirstOrDefaultAsync(a => a.Id == route3.AttemptId);
                return (skillProfile, attempt?.Career);
            }

            // Fall back to Journey1
            var journey1 = await _context.Journey1Results
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (journey1 != null)
            {
                using var doc = JsonDocument.Parse(journey1.ResultJson);
                var skillProfile = doc.RootElement.GetProperty("preliminary_current_skill_profile").GetRawText();
                var targetCareers = doc.RootElement.GetProperty("target_careers");
                var career = targetCareers.GetArrayLength() > 0 ? targetCareers[0].GetString() : null;
                return (skillProfile, career);
            }

            // Fall back to Journey2
            var journey2 = await _context.Journey2Results
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (journey2 != null)
            {
                using var doc = JsonDocument.Parse(journey2.ResultJson);
                var skillProfile = doc.RootElement.GetProperty("current_skill_profile").GetRawText();
                return (skillProfile, journey2.Career);
            }

            return (null, null);
        }
    }
}