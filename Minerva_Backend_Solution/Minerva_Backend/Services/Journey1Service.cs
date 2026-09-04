using Microsoft.EntityFrameworkCore;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Journey1;
using Minerva_Backend.DTO.Journey2;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Minerva_Backend.Services
{
    public class Journey1Service(AppDbContext _context, IJourney1BridgeService _bridge) : IJourney1Service
    {
        // This identifies the question set in the scoring service. It is not the
        // identifier of a user's saved assessment.
        private const string ScoringAssessmentId = "minerva_career_discovery_v4";

        public async Task<ResponseResult<List<Journey1QuestionDTO>>> GetQuestions()
        {
            var questions = await _context.Journey1Questions.ToListAsync();

            var dtos = questions.Select(q => new Journey1QuestionDTO
            {
                QuestionId = q.QuestionId,
                Career = q.Career,
                CareerName = q.CareerName,
                Title = q.Title,
                QuestionType = q.QuestionType,
                Interaction = q.Interaction,
                Instruction = q.Instruction,
                Options = JsonSerializer.Deserialize<object>(q.OptionsJson)!
            }).ToList();

            return new ResponseResult<List<Journey1QuestionDTO>>
            {
                Data = dtos,
                Message = "Journey 1 questions fetched successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> SubmitAssessment(string userId, SubmitJourney1DTO dto)
        {
            if (dto.Answers == null || dto.Answers.Count == 0)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Answers are required.",
                    Status = false,
                };
            }

            var answerTuples = dto.Answers
                .Select(a => (a.QuestionId, a.SelectedOption))
                .ToList();

            // Do not trust or reuse the assessment id supplied by the client. A
            // saved assessment must have its own identifier for every submission.
            var assessmentId = Guid.NewGuid().ToString();
            var result = await _bridge.CompleteAssessmentAsync(ScoringAssessmentId, answerTuples);

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Journey 1 scoring service is unavailable. Please try again later.",
                    Status = false,
                };
            }

            var resultJson = JsonNode.Parse(JsonSerializer.Serialize(result))?.AsObject();
            if (resultJson == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "Journey 1 scoring service returned an invalid result.",
                    Status = false,
                };
            }

            // The scoring service returns its fixed template id. Replace it with
            // the id of this user's saved assessment before returning or storing it.
            // Handle the casing used by different scoring-service versions
            // (assessment_id, assessment_Id, assessmentId, etc.).
            var assessmentProperties = resultJson
                .Select(property => property.Key)
                .Where(key => key.Replace("_", "", StringComparison.Ordinal)
                    .Equals("assessmentid", StringComparison.OrdinalIgnoreCase))
                .ToList();

            foreach (var propertyName in assessmentProperties)
            {
                resultJson[propertyName] = assessmentId;
            }

            if (assessmentProperties.Count == 0)
            {
                resultJson["assessment_id"] = assessmentId;
            }

            var journey1Result = new Journey1Result
            {
                UserId = userId,
                AssessmentId = assessmentId,
                ResultJson = resultJson.ToJsonString()
            };

            _context.Journey1Results.Add(journey1Result);
            await _context.SaveChangesAsync();

            return new ResponseResult<object>
            {
                Data = new { assessmentId, result = resultJson },
                Message = "Journey 1 assessment completed successfully.",
                Status = true,
            };
        }

        public async Task<ResponseResult<object>> GetResult(
    string userId,
    string assessmentId)
        {
            var result = await _context.Journey1Results
                .Where(r =>
                    r.AssessmentId == assessmentId &&
                    r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return new ResponseResult<object>
                {
                    Data = null,
                    Message = "No Journey 1 result found.",
                    Status = false,
                };
            }

            return new ResponseResult<object>
            {
                Data = JsonSerializer.Deserialize<object>(result.ResultJson),
                Message = "Journey 1 result fetched successfully.",
                Status = true,
            };
        }
    }
}
