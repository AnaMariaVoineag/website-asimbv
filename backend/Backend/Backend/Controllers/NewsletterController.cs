using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly AppDbContext _context;

    public NewsletterController(AppDbContext context)
    {
        _context = context;
    }

    // ── POST api/newsletter/subscribe ────────────────────────────────────────
    // Body: { "email": "...", "name": "..." }
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Adresa de email este obligatorie." });

        var emailRegex = new System.Text.RegularExpressions.Regex(
            @"^[^@\s]+@[^@\s]+\.[^@\s]+$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);

        if (!emailRegex.IsMatch(request.Email.Trim()))
            return BadRequest(new { message = "Adresa de email nu este validă." });

        var normalized = request.Email.Trim().ToLowerInvariant();

        // Check if already subscribed (active)
        var existing = await _context.NewsletterSubscribers
            .FirstOrDefaultAsync(s => s.Email == normalized);

        if (existing is not null)
        {
            if (existing.IsActive)
                return Conflict(new { message = "Această adresă de email este deja abonată." });

            // Re-subscribe
            existing.IsActive = true;
            existing.SubscribedAt = DateTime.UtcNow;
            existing.UnsubscribedAt = null;
            existing.UnsubscribeToken = Guid.NewGuid().ToString("N");
            existing.Name = request.Name?.Trim() ?? existing.Name;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Bine ai revenit! Ai fost re-abonat cu succes la newsletter-ul ASIMBV.",
                unsubscribeToken = existing.UnsubscribeToken
            });
        }

        var subscriber = new NewsletterSubscriber
        {
            Email = normalized,
            Name = request.Name?.Trim() ?? string.Empty,
            IsActive = true,
            SubscribedAt = DateTime.UtcNow,
            UnsubscribeToken = Guid.NewGuid().ToString("N")
        };

        _context.NewsletterSubscribers.Add(subscriber);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Te-ai abonat cu succes! Vei primi vești despre evenimentele și workshopurile ASIMBV.",
            unsubscribeToken = subscriber.UnsubscribeToken
        });
    }

    // ── DELETE api/newsletter/unsubscribe?token=xxx ───────────────────────────
    [HttpDelete("unsubscribe")]
    public async Task<IActionResult> Unsubscribe([FromQuery] string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return BadRequest(new { message = "Token invalid." });

        var subscriber = await _context.NewsletterSubscribers
            .FirstOrDefaultAsync(s => s.UnsubscribeToken == token && s.IsActive);

        if (subscriber is null)
            return NotFound(new { message = "Token-ul de dezabonare nu a fost găsit sau abonamentul este deja inactiv." });

        subscriber.IsActive = false;
        subscriber.UnsubscribedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Ai fost dezabonat cu succes." });
    }

    // ── GET api/newsletter/subscribers ───────────────────────────────────────
    // Returns all active subscribers. In production, guard with [Authorize(Roles="Moderator")].
    [HttpGet("subscribers")]
    public async Task<ActionResult<IEnumerable<object>>> GetSubscribers()
    {
        var subscribers = await _context.NewsletterSubscribers
            .Where(s => s.IsActive)
            .OrderByDescending(s => s.SubscribedAt)
            .Select(s => new
            {
                s.Id,
                s.Email,
                s.Name,
                s.SubscribedAt
            })
            .ToListAsync();

        return Ok(new
        {
            total = subscribers.Count,
            subscribers
        });
    }

    // ── GET api/newsletter/stats ──────────────────────────────────────────────
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var total = await _context.NewsletterSubscribers.CountAsync();
        var active = await _context.NewsletterSubscribers.CountAsync(s => s.IsActive);
        var unsubscribed = total - active;

        return Ok(new { total, active, unsubscribed });
    }
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────
public record SubscribeRequest(string Email, string? Name);
