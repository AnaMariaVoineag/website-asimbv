namespace Backend.Models;

public class ContactMessage
{
    public const int NameMaxLength = 100;
    public const int EmailMaxLength = 254;
    public const int SubjectMaxLength = 150;
    public const int MessageMaxLength = 1000;

    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
