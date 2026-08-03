namespace Backend.DTOs;

public class EventCategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateEventCategoryDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}
