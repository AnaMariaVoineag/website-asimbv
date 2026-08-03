using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("event_participants")]
public class EventParticipant
{
    [Column("event_id")]
    public int EventId { get; set; }

    [Column("member_id")]
    public int MemberId { get; set; }

    [Required]
    [Column("role_at_event")]
    [MaxLength(100)]
    public string RoleAtEvent { get; set; } = "participant"; // participant | organizer | speaker | volunteer

    [Required]
    [Column("attendance_status")]
    [MaxLength(100)]
    public string AttendanceStatus { get; set; } = "registered"; // registered | attended | absent | excused

    [Required]
    [Column("registered_at")]
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

    // Foreign Keys / Navigation properties
    [ForeignKey(nameof(EventId))]
    public Event Event { get; set; } = null!;

    [ForeignKey(nameof(MemberId))]
    public Member Member { get; set; } = null!;
}
