using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("event_sponsors")]
public class EventSponsor
{
    [Column("event_id")]
    public int EventId { get; set; }

    [Column("sponsor_id")]
    public int SponsorId { get; set; }

    [Column("contribution_desc")]
    public string? ContributionDesc { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Keys / Navigation properties
    [ForeignKey(nameof(EventId))]
    public Event Event { get; set; } = null!;

    [ForeignKey(nameof(SponsorId))]
    public Sponsor Sponsor { get; set; } = null!;
}
