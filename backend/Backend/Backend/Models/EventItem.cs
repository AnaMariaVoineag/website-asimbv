namespace Backend.Models;

public class EventItem
{
    public int Id { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = "Social";
    /// <summary>
    /// JSON array of image paths relative to the frontend public root,
    /// e.g. ["/poze_evenimente/folder/img.png", ...].
    /// Null or empty means no images.
    /// </summary>
    public string? Images { get; set; }
    public string? FormUrl { get; set; }
}
