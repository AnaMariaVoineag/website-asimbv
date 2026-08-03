using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/events/{eventId}/participants")]
public class EventParticipantsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EventParticipantsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventParticipantDto>>> GetParticipants(int eventId)
    {
        if (!await _context.Events.AnyAsync(e => e.Id == eventId))
        {
            return NotFound(new { message = $"Event with ID {eventId} was not found." });
        }

        var participants = await _context.EventParticipants
            .Include(ep => ep.Member)
            .Include(ep => ep.Event)
            .Where(ep => ep.EventId == eventId)
            .Select(ep => new EventParticipantDto
            {
                EventId = ep.EventId,
                EventTitle = ep.Event.Title,
                MemberId = ep.MemberId,
                MemberName = $"{ep.Member.FirstName} {ep.Member.LastName}",
                MemberEmail = ep.Member.Email,
                RoleAtEvent = ep.RoleAtEvent,
                AttendanceStatus = ep.AttendanceStatus,
                RegisteredAt = ep.RegisteredAt
            })
            .ToListAsync();

        return Ok(participants);
    }

    [HttpPost]
    public async Task<ActionResult<EventParticipantDto>> RegisterParticipant(int eventId, RegisterParticipantDto dto)
    {
        var ev = await _context.Events.FindAsync(eventId);
        if (ev == null)
        {
            return NotFound(new { message = $"Event with ID {eventId} was not found." });
        }

        if (!await _context.Members.AnyAsync(m => m.Id == dto.MemberId))
        {
            return BadRequest(new { message = $"Member with ID {dto.MemberId} does not exist." });
        }

        // Check if already registered
        var alreadyRegistered = await _context.EventParticipants
            .AnyAsync(ep => ep.EventId == eventId && ep.MemberId == dto.MemberId);

        if (alreadyRegistered)
        {
            return BadRequest(new { message = "Member is already registered for this event." });
        }

        var participant = new EventParticipant
        {
            EventId = eventId,
            MemberId = dto.MemberId,
            RoleAtEvent = dto.RoleAtEvent,
            AttendanceStatus = "registered",
            RegisteredAt = DateTime.UtcNow
        };

        _context.EventParticipants.Add(participant);
        await _context.SaveChangesAsync();

        // Reload to select properly
        var created = await _context.EventParticipants
            .Include(ep => ep.Member)
            .Include(ep => ep.Event)
            .FirstAsync(ep => ep.EventId == eventId && ep.MemberId == dto.MemberId);

        var resultDto = new EventParticipantDto
        {
            EventId = created.EventId,
            EventTitle = created.Event.Title,
            MemberId = created.MemberId,
            MemberName = $"{created.Member.FirstName} {created.Member.LastName}",
            MemberEmail = created.Member.Email,
            RoleAtEvent = created.RoleAtEvent,
            AttendanceStatus = created.AttendanceStatus,
            RegisteredAt = created.RegisteredAt
        };

        return Ok(resultDto);
    }

    [HttpPut("{memberId}")]
    public async Task<IActionResult> UpdateParticipantStatus(int eventId, int memberId, UpdateParticipantStatusDto dto)
    {
        var participant = await _context.EventParticipants
            .FirstOrDefaultAsync(ep => ep.EventId == eventId && ep.MemberId == memberId);

        if (participant == null)
        {
            return NotFound(new { message = $"Participant registration was not found for member {memberId} at event {eventId}." });
        }

        participant.RoleAtEvent = dto.RoleAtEvent;
        participant.AttendanceStatus = dto.AttendanceStatus;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{memberId}")]
    public async Task<IActionResult> UnregisterParticipant(int eventId, int memberId)
    {
        var participant = await _context.EventParticipants
            .FirstOrDefaultAsync(ep => ep.EventId == eventId && ep.MemberId == memberId);

        if (participant == null)
        {
            return NotFound(new { message = $"Participant registration was not found for member {memberId} at event {eventId}." });
        }

        _context.EventParticipants.Remove(participant);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
