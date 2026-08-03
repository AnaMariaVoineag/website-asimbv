using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("member_roles")]
public class MemberRole
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("member_id")]
    public int MemberId { get; set; }

    [Required]
    [Column("role_id")]
    public int RoleId { get; set; }

    [Column("assigned_by")]
    public int? AssignedById { get; set; }

    [Required]
    [Column("valid_from")]
    public DateTime ValidFrom { get; set; }

    [Column("valid_until")]
    public DateTime? ValidUntil { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Keys / Navigation properties
    [ForeignKey(nameof(MemberId))]
    public Member Member { get; set; } = null!;

    [ForeignKey(nameof(RoleId))]
    public Role Role { get; set; } = null!;

    [ForeignKey(nameof(AssignedById))]
    public Member? AssignedBy { get; set; }
}
