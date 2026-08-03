using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("events")]
public class Event
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("title")]
    [MaxLength(255)]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }

    [Required]
    [Column("start_datetime")]
    public DateTime StartDatetime { get; set; }

    [Column("end_datetime")]
    public DateTime? EndDatetime { get; set; }

    [Column("location")]
    [MaxLength(255)]
    public string? Location { get; set; }

    [Column("category_id")]
    public int? CategoryId { get; set; }

    [Column("created_by")]
    public int? CreatedById { get; set; }

    [Required]
    [Column("is_published")]
    public bool IsPublished { get; set; } = false;

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Keys / Navigation properties
    [ForeignKey(nameof(CategoryId))]
    public EventCategory? Category { get; set; }

    [ForeignKey(nameof(CreatedById))]
    public Member? Creator { get; set; }

    public ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();
    public ICollection<EventSponsor> EventSponsors { get; set; } = new List<EventSponsor>();
}
