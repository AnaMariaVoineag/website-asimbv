using Backend.Data;
using Backend.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Admin;

public record AdminSubscriberDto(int Id, string Email, string Name, bool IsActive, DateTime SubscribedAt, DateTime? UnsubscribedAt);

[ApiController]
[Route("api/admin/subscribers")]
[RequireAdmin]
public class AdminSubscribersController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminSubscribersController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/admin/subscribers (active and unsubscribed; the unsubscribe token is never returned)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminSubscriberDto>>> GetSubscribers()
    {
        return await _context.NewsletterSubscribers.AsNoTracking()
            .OrderByDescending(s => s.SubscribedAt)
            .Select(s => new AdminSubscriberDto(s.Id, s.Email, s.Name, s.IsActive, s.SubscribedAt, s.UnsubscribedAt))
            .ToListAsync();
    }

    // DELETE api/admin/subscribers/5: erases the address entirely (e.g. on a GDPR deletion request).
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSubscriber(int id)
    {
        var deleted = await _context.NewsletterSubscribers.Where(s => s.Id == id).ExecuteDeleteAsync();
        return deleted == 0 ? NotFound(new { message = "Abonatul nu mai există." }) : NoContent();
    }
}
