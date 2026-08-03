namespace Backend.DTOs;

public class EventParticipantDto
{
    public int EventId { get; set; }
    public string EventTitle { get; set; } = null!;
    public int MemberId { get; set; }
    public string MemberName { get; set; } = null!;
    public string MemberEmail { get; set; } = null!;
    public string RoleAtEvent { get; set; } = null!;
    public string AttendanceStatus { get; set; } = null!;
    public DateTime RegisteredAt { get; set; }
}

public class RegisterParticipantDto
{
    public int MemberId { get; set; }
    public string RoleAtEvent { get; set; } = "participant";
}

public class UpdateParticipantStatusDto
{
    public string RoleAtEvent { get; set; } = "participant";
    public string AttendanceStatus { get; set; } = "registered";
}
