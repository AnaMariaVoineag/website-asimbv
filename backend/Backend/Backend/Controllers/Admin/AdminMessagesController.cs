using Backend.Data;
using Backend.Models;
using Backend.Security;
using Backend.Validation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Admin;

/// <summary>Only the fields that are present are changed.</summary>
public record MessageUpdateRequest(bool? IsRead, bool? IsArchived, string? Notes);

[ApiController]
[Route("api/admin/messages")]
[RequireAdmin]
public class AdminMessagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminMessagesController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/admin/messages?status=inbox|unread|archived|all&search=...
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages(
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        IQueryable<ContactMessage> query = _context.ContactMessages.AsNoTracking();

        query = (status ?? "inbox").ToLowerInvariant() switch
        {
            "archived" => query.Where(m => m.IsArchived),
            "unread"   => query.Where(m => !m.IsRead && !m.IsArchived),
            "all"      => query,
            _          => query.Where(m => !m.IsArchived),
        };

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(m =>
                m.Name.ToLower().Contains(term) ||
                m.Email.ToLower().Contains(term) ||
                m.Subject.ToLower().Contains(term) ||
                m.Message.ToLower().Contains(term));
        }

        return await query.OrderByDescending(m => m.CreatedAt).ToListAsync();
    }

    // PATCH api/admin/messages/5  { "isRead": true } / { "isArchived": true } / { "notes": "..." }
    [HttpPatch("{id:int}")]
    public async Task<ActionResult<ContactMessage>> UpdateMessage(int id, [FromBody] MessageUpdateRequest request)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message is null)
            return NotFound(new { message = "Mesajul nu mai există." });

        if (request.Notes is not null && request.Notes.Trim().Length > ContactMessage.NotesMaxLength)
            return BadRequest(new { message = $"Notițele pot avea cel mult {ContactMessage.NotesMaxLength} de caractere." });

        if (request.IsRead is bool isRead) message.IsRead = isRead;
        if (request.IsArchived is bool isArchived) message.IsArchived = isArchived;
        if (request.Notes is not null) message.Notes = AdminValidation.Clean(request.Notes);

        await _context.SaveChangesAsync();
        return message;
    }

    // DELETE api/admin/messages/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var deleted = await _context.ContactMessages.Where(m => m.Id == id).ExecuteDeleteAsync();
        return deleted == 0 ? NotFound(new { message = "Mesajul nu mai există." }) : NoContent();
    }
}
