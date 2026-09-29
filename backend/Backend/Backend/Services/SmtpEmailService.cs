using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Backend.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<SmtpEmailService> _logger;

    private string SmtpHost        => _config["Email:SmtpHost"] ?? "smtp.gmail.com";
    private int    SmtpPort        => int.TryParse(_config["Email:SmtpPort"], out var p) ? p : 587;
    private bool   UseSsl          => bool.TryParse(_config["Email:UseSsl"], out var s) && s;
    private string Username        => _config["Email:Username"] ?? "";
    private string Password        => _config["Email:Password"] ?? "";
    private string FromName        => _config["Email:FromName"] ?? "ASIMBV Website";
    private string FromAddress     => _config["Email:FromAddress"] ?? Username;
    private string NotificationTo  => _config["Email:NotificationEmail"] ?? Username;

    public SmtpEmailService(IConfiguration config, ILogger<SmtpEmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    /// <inheritdoc />
    public Task SendNotificationAsync(string subject, string htmlBody)
        => SendAsync(NotificationTo, "ASIMBV Team", subject, htmlBody);

    /// <inheritdoc />
    public async Task SendAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        // If credentials are not configured, log and skip (no crash in dev)
        if (string.IsNullOrWhiteSpace(Username) || Password == "YOUR_APP_PASSWORD_HERE")
        {
            _logger.LogWarning("[Email] SMTP not configured — skipping send to {Email}. Subject: {Subject}", toEmail, subject);
            return;
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromName, FromAddress));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            var secureOption = UseSsl
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTlsWhenAvailable;

            await client.ConnectAsync(SmtpHost, SmtpPort, secureOption);
            await client.AuthenticateAsync(Username, Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("[Email] Sent '{Subject}' → {Email}", subject, toEmail);
        }
        catch (Exception ex)
        {
            // Never crash the request because of an email failure
            _logger.LogError(ex, "[Email] Failed to send '{Subject}' to {Email}", subject, toEmail);
        }
    }
}
