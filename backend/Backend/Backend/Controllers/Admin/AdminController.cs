using Backend.Data;
using Backend.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Admin;

/// <summary>
/// Entry points of the admin dashboard. Every admin endpoint requires a session token from
/// POST api/admin/login (AdminAuthController), sent as "Authorization: Bearer ...".
/// </summary>
[ApiController]
[Route("api/admin")]
[RequireAdmin]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AdminAuth _auth;

    public AdminController(AppDbContext context, AdminAuth auth)
    {
        _context = context;
        _auth = auth;
    }

    // GET api/admin/session: whether the stored session is still valid, and for which account.
    [HttpGet("session")]
    public IActionResult Session() => Ok(new { ok = true, email = _auth.Email });

    // GET api/admin/stats: numbers for the overview page.
    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        return Ok(new
        {
            unreadMessages    = await _context.ContactMessages.CountAsync(m => !m.IsRead && !m.IsArchived),
            inboxMessages     = await _context.ContactMessages.CountAsync(m => !m.IsArchived),
            totalMessages     = await _context.ContactMessages.CountAsync(),
            events            = await _context.Events.CountAsync(),
            partners          = await _context.Partners.CountAsync(),
            activeSubscribers = await _context.NewsletterSubscribers.CountAsync(s => s.IsActive),
        });
    }
}
