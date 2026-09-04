using System.ComponentModel.DataAnnotations;

namespace Minerva_Backend.Models
{
    public class Journey1Question
    {
        [Key]
        public string QuestionId { get; set; } = string.Empty; // e.g. "UIUX_01"
        public string Career { get; set; } = string.Empty;     // e.g. "ui_ux"
        public string CareerName { get; set; } = string.Empty; // e.g. "UI/UX Design"
        public string Title { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public string Interaction { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;
        public string OptionsJson { get; set; } = string.Empty; // options array as JSON string, no correct_option
    }
}