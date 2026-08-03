using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("sponsors")]
public class Sponsor
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("company_name")]
    [MaxLength(255)]
    public string CompanyName { get; set; } = null!;

    [Column("website")]
    [MaxLength(500)]
    public string? Website { get; set; }

    [Column("logo_url")]
    [MaxLength(500)]
    public string? LogoUrl { get; set; }

    [Column("contact_person")]
    [MaxLength(255)]
    public string? ContactPerson { get; set; }

    [Required]
    [Column("contact_email")]
    [MaxLength(255)]
    public string ContactEmail { get; set; } = null!;

    [Column("contact_phone")]
    [MaxLength(50)]
    public string? ContactPhone { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<EventSponsor> EventSponsors { get; set; } = new List<EventSponsor>();
}
