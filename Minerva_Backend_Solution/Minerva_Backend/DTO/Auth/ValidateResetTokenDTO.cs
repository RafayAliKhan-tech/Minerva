namespace Minerva_Backend.DTO.Auth;

public class ValidateResetTokenDTO
{
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}
