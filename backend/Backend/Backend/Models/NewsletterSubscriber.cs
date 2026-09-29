namespace Backend.Models;

public class NewsletterSubscriber
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UnsubscribedAt { get; set; }
    /// <summary>Unique token used in unsubscribe links (no auth required).</summary>
    public string UnsubscribeToken { get; set; } = Guid.NewGuid().ToString("N");
}
