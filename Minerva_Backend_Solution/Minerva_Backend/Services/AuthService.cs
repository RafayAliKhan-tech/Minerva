using Microsoft.AspNetCore.Identity;
using System.Text.Encodings.Web;
using System.Text.RegularExpressions;
using Minerva_Backend.Data;
using Minerva_Backend.DTO.Auth;
using Minerva_Backend.GenericResponse;
using Minerva_Backend.Helpers;
using Minerva_Backend.IServices;
using Minerva_Backend.Models;

namespace Minerva_Backend.Services
{
        public class AuthService(
            UserManager<AppUser> _userManager,
            IConfiguration _configuration,
            IEmailSender _emailSender,
            ILogger<AuthService> _logger) : IAuthService
        {
            private static readonly Regex EmailPattern = new(
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                RegexOptions.Compiled | RegexOptions.CultureInvariant);

            public async Task<ResponseResult<string>> RegisterUser(RegisterUserDTO dto)
            {
                var email = dto.Email?.Trim() ?? string.Empty;
                if (string.IsNullOrWhiteSpace(dto.userName) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(dto.Password))
                {
                    return Error("Please fill all the required fields.");
                }

                if (!IsValidEmail(email))
                {
                    return Error("Please enter a valid email address.");
                }

                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null)
                {
                    return Error("An account with that email already exists. Please log in.");
                }

                var newUser = new AppUser
                {
                    UserName = dto.userName,
                    Name = dto.userName,
                    Email = email,
                    CreatedAt = DateTime.UtcNow,
                };

                var result = await _userManager.CreateAsync(newUser, dto.Password);
                if (!result.Succeeded)
                {
                    return Error(string.Join(" ", result.Errors.Select(e => e.Description)));
                }

                try
                {
                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
                    var confirmationUrl = BuildFrontendUrl(
                        "/verify-email",
                        ("userId", newUser.Id),
                        ("token", token));
                    await _emailSender.SendAsync(
                        email,
                        "Verify your Minerva account",
                        BuildEmail("Verify your Minerva account", "Confirm your email address to activate your Minerva account.", confirmationUrl, "Verify email"));
                }
                catch (Exception exception)
                {
                    _logger.LogError(exception, "Unable to send the account verification email.");
                    await _userManager.DeleteAsync(newUser);
                    return Error("We could not send the verification email. Please try again later.");
                }

                return Success("Account created. Check your email to verify your account before logging in.");
            }

            public async Task<ResponseResult<string>> LoginUser(LoginUserDTO dto)
            {
                var email = dto.Email?.Trim() ?? string.Empty;
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                    return Error("Please fill all the required fields.");
                }

                if (!IsValidEmail(email))
                {
                    return Error("Please enter a valid email address.");
            }

                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser == null)
                {
                    return Error("Invalid email or password.");
                }

                if (!_userManager.Options.SignIn.RequireConfirmedEmail || existingUser.EmailConfirmed)
                {
                    // Continue with normal password authentication.
                }
                else
            {
                    return Error("Please verify your email before logging in.");
                }

                var validUser = await _userManager.CheckPasswordAsync(existingUser, dto.Password!);
                if (!validUser)
                {
                    return Error("Invalid email or password.");
                }

                var token = await JwtTokenGenerator.GenerateJWTKey(_configuration, existingUser);
                if (token == null)
                {
                    return Error("An error occurred while generating your session.");
                }

                return Success(token, "Login successful.");
            }

            public async Task<ResponseResult<string>> RequestPasswordReset(ForgotPasswordDTO dto)
            {
                var email = dto.Email?.Trim() ?? string.Empty;
                if (!IsValidEmail(email))
                {
                    return Error("Please enter a valid email address.");
                }

                var user = await _userManager.FindByEmailAsync(email);
                if (user != null)
                {
                    try
                    {
                        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                        var resetUrl = BuildFrontendUrl("/reset-password", ("email", email), ("token", token));
                        await _emailSender.SendAsync(
                            email,
                            "Reset your Minerva password",
                            BuildEmail("Reset your password", "We received a request to reset your Minerva password. This link expires soon and can only be used once.", resetUrl, "Reset password"));
                    }
                    catch (Exception exception)
                    {
                        _logger.LogError(exception, "Unable to send a password reset email.");
                    }
                }

                return Success("If an account exists for that email, we sent a password reset link.");
            }

            public async Task<ResponseResult<string>> ValidatePasswordResetToken(ValidateResetTokenDTO dto)
            {
                var user = await FindUserForToken(dto.Email);
                if (user == null || string.IsNullOrWhiteSpace(dto.Token) ||
                    !await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", dto.Token))
                {
                    return Error("This password reset link is invalid or has expired.");
                }

                return Success(null, "Reset link is valid.");
            }

            public async Task<ResponseResult<string>> ResetPassword(ResetPasswordDTO dto)
            {
                if (dto.NewPassword != dto.ConfirmPassword)
                {
                    return Error("Passwords do not match.");
                }

                var user = await FindUserForToken(dto.Email);
                if (user == null || string.IsNullOrWhiteSpace(dto.Token))
                {
                    return Error("This password reset link is invalid or has expired.");
                }

                var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
                if (!result.Succeeded)
                {
                    return Error(string.Join(" ", result.Errors.Select(e => e.Description)));
                }

                return Success("Your password has been reset. You can now log in.");
            }

            public async Task<ResponseResult<string>> ConfirmEmail(ConfirmEmailDTO dto)
            {
                var user = await _userManager.FindByIdAsync(dto.UserId);
                if (user == null || string.IsNullOrWhiteSpace(dto.Token))
                {
                    return Error("This verification link is invalid or has expired.");
                }

                var result = await _userManager.ConfirmEmailAsync(user, dto.Token);
                if (!result.Succeeded && !user.EmailConfirmed)
                {
                    return Error("This verification link is invalid or has expired.");
                }

                return Success("Your email has been verified. You can now log in.");
            }

            private async Task<AppUser?> FindUserForToken(string? email)
            {
                var normalizedEmail = email?.Trim();
                return IsValidEmail(normalizedEmail) ? await _userManager.FindByEmailAsync(normalizedEmail!) : null;
            }

            private string BuildFrontendUrl(string path, params (string Key, string Value)[] parameters)
            {
                var baseUrl = _configuration["Email:FrontendBaseUrl"]?.TrimEnd('/')
                    ?? throw new InvalidOperationException("Email:FrontendBaseUrl is not configured.");
                var query = string.Join("&", parameters.Select(parameter =>
                    $"{Uri.EscapeDataString(parameter.Key)}={Uri.EscapeDataString(parameter.Value)}"));
                return $"{baseUrl}{path}?{query}";
            }

            private static string BuildEmail(string heading, string message, string actionUrl, string actionText) =>
                $"""
                <!doctype html>
                <html><body style="margin:0;background:#121313;color:#f5f5f5;font-family:Arial,sans-serif">
                  <div style="max-width:560px;margin:32px auto;padding:32px;background:#1c1b1a;border:1px solid #3d3a36">
                    <h1 style="margin:0 0 16px;color:#f8f7f5;font-size:24px">Minerva</h1>
                    <h2 style="color:#f8f7f5;font-size:20px">{HtmlEncoder.Default.Encode(heading)}</h2>
                    <p style="color:#c2beb8;line-height:1.6">{HtmlEncoder.Default.Encode(message)}</p>
                    <p><a href="{HtmlEncoder.Default.Encode(actionUrl)}" style="display:inline-block;padding:12px 20px;background:#f5f3ef;color:#23211f;text-decoration:none;border-radius:8px">{HtmlEncoder.Default.Encode(actionText)}</a></p>
                    <p style="color:#888582;font-size:12px;line-height:1.5">If you did not request this, you can safely ignore this email.</p>
                  </div>
                </body></html>
                """;

            private static bool IsValidEmail(string? email) =>
                !string.IsNullOrWhiteSpace(email) && EmailPattern.IsMatch(email);

            private static ResponseResult<string> Success(string? data, string message) =>
                new() { Data = data, Message = message, Status = true };

            private static ResponseResult<string> Success(string message) => Success(null, message);

            private static ResponseResult<string> Error(string message) =>
                new() { Data = null, Message = message, Status = false };
        }
}
