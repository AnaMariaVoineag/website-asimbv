namespace Backend.DTOs;

public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartDatetime { get; set; }
    public DateTime? EndDatetime { get; set; }
    public string? Location { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int? CreatedById { get; set; }
    public string? CreatorName { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateEventDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartDatetime { get; set; }
    public DateTime? EndDatetime { get; set; }
    public string? Location { get; set; }
    public int? CategoryId { get; set; }
    public int? CreatedById { get; set; }
    public bool IsPublished { get; set; }
}

public class UpdateEventDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartDatetime { get; set; }
    public DateTime? EndDatetime { get; set; }
    public string? Location { get; set; }
    public int? CategoryId { get; set; }
    public bool IsPublished { get; set; }
}
