namespace Backend.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? PhotoUrl { get; set; }
    public string Faculty { get; set; } = null!;
    public short? YearOfStudy { get; set; }
    public bool IsActive { get; set; }
    public DateTime JoinedAt { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class MemberDetailDto : MemberDto
{
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
}

public class CreateMemberDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }
    public string Faculty { get; set; } = null!;
    public short? YearOfStudy { get; set; }
    public DateTime JoinedAt { get; set; }
}

public class UpdateMemberDto
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? PhotoUrl { get; set; }
    public string Faculty { get; set; } = null!;
    public short? YearOfStudy { get; set; }
    public bool IsActive { get; set; }
}

public class AssignRoleDto
{
    public int RoleId { get; set; }
    public int? AssignedById { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }
}

public class MemberRoleDto
{
    public int Id { get; set; }
    public int RoleId { get; set; }
    public string RoleName { get; set; } = null!;
    public int? AssignedById { get; set; }
    public string? AssignedByName { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }
}
