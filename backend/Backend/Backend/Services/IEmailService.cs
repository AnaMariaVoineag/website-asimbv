namespace Backend.Services;

public interface IEmailService
{
    /// <summary>Send an internal notification to the ASIMBV team inbox.</summary>
    Task SendNotificationAsync(string subject, string htmlBody);

    /// <summary>Send a transactional email to an arbitrary recipient.</summary>
    Task SendAsync(string toEmail, string toName, string subject, string htmlBody);
}
