using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("members")]
public class Member
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("first_name")]
    [MaxLength(255)]
    public string FirstName { get; set; } = null!;

    [Required]
    [Column("last_name")]
    [MaxLength(255)]
    public string LastName { get; set; } = null!;

    [Required]
    [Column("email")]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    [Column("phone")]
    [MaxLength(50)]
    public string? Phone { get; set; }

    [Required]
    [Column("faculty")]
    [MaxLength(255)]
    public string Faculty { get; set; } = null!;

    [Column("year_of_study")]
    public short? YearOfStudy { get; set; }

    [Required]
    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Required]
    [Column("joined_at")]
    public DateTime JoinedAt { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<MemberRole> MemberRoles { get; set; } = new List<MemberRole>();
    public ICollection<MemberRole> AssignedRoles { get; set; } = new List<MemberRole>();
    public ICollection<Event> CreatedEvents { get; set; } = new List<Event>();
    public ICollection<EventParticipant> EventParticipants { get; set; } = new List<EventParticipant>();
}
