using System.Net;
using System.Net.Mail;
using Minerva_Backend.IServices;

namespace Minerva_Backend.Services;

public sealed class SmtpEmailSender(IConfiguration configuration, ILogger<SmtpEmailSender> logger) : IEmailSender
{
    public async Task SendAsync(string recipient, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var host = configuration["Email:SmtpHost"];
        var portValue = configuration["Email:SmtpPort"];
        var username = configuration["Email:SmtpUsername"];
        var password = configuration["Email:SmtpPassword"];
        var from = configuration["Email:From"];

        if (string.IsNullOrWhiteSpace(host) ||
            !int.TryParse(portValue, out var port) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password) ||
            string.IsNullOrWhiteSpace(from))
        {
            throw new InvalidOperationException("Email SMTP configuration is incomplete.");
        }

        using var message = new MailMessage(from, recipient)
        {
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true,
        };
        using var client = new SmtpClient(host, port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(username, password),
        };

        cancellationToken.ThrowIfCancellationRequested();
        await client.SendMailAsync(message, cancellationToken);
        logger.LogInformation("Authentication email sent to recipient {Recipient}.", recipient);
    }
}
