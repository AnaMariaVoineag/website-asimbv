namespace Backend.DTOs;

public class SponsorDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? Website { get; set; }
    public string? LogoUrl { get; set; }
    public string? ContactPerson { get; set; }
    public string ContactEmail { get; set; } = null!;
    public string? ContactPhone { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateSponsorDto
{
    public string CompanyName { get; set; } = null!;
    public string? Website { get; set; }
    public string? LogoUrl { get; set; }
    public string? ContactPerson { get; set; }
    public string ContactEmail { get; set; } = null!;
    public string? ContactPhone { get; set; }
}

public class EventSponsorDto
{
    public int EventId { get; set; }
    public string EventTitle { get; set; } = null!;
    public int SponsorId { get; set; }
    public string SponsorName { get; set; } = null!;
    public string? ContributionDesc { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AssociateSponsorDto
{
    public int SponsorId { get; set; }
    public string? ContributionDesc { get; set; }
}
