using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsletterController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _email;

    public NewsletterController(AppDbContext context, IEmailService email)
    {
        _context = context;
        _email   = email;
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

        // ── Welcome confirmation email ────────────────────────────────────────
        var welcomeHtml = $"""
            <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:580px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#003977,#0064d2);padding:32px;text-align:center">
                <h1 style="color:#fff;margin:0;font-size:22px">Bun venit în comunitatea ASIMBV! 🎉</h1>
                <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:14px">Ai fost abonat cu succes la newsletter-ul nostru.</p>
              </div>
              <div style="padding:32px;background:#fff">
                <p style="color:#334155;font-size:15px;line-height:1.7">Salut{(string.IsNullOrEmpty(subscriber.Name) ? "" : $" {subscriber.Name}")},</p>
                <p style="color:#334155;font-size:14px;line-height:1.7">
                  Ești acum la curent cu tot ce se întâmplă la Facultatea de Matematică și Informatică Brașov —
                  hackathoane, workshop-uri, voluntariat și oportunități de carieră.
                </p>
                <div style="margin:24px 0;padding:16px;background:#f0f7ff;border-radius:8px;border-left:4px solid #003977">
                  <p style="margin:0;color:#003977;font-size:13px;font-weight:600">📅 Urmează în curând</p>
                  <p style="margin:6px 0 0;color:#475569;font-size:13px">Vom anunța în curând noul sezon de evenimente pentru 2026-2027!</p>
                </div>
                <p style="color:#64748b;font-size:12px;margin-top:24px">
                  Dacă nu ai solicitat această abonare, poți
                  <a href="https://asimbv.ro/api/newsletter/unsubscribe?token={subscriber.UnsubscribeToken}" style="color:#003977">dezabona-te instant</a>.
                </p>
              </div>
              <div style="padding:14px 32px;background:#f8fafc;font-size:11px;color:#94a3b8;text-align:center">
                © {DateTime.UtcNow.Year} ASIM Brașov · Asociația Studenților la Informatică și Matematică
              </div>
            </div>
            """;

        await _email.SendAsync(
            toEmail:  subscriber.Email,
            toName:   subscriber.Name.Length > 0 ? subscriber.Name : "Abonat",
            subject:  "Bun venit la newsletter-ul ASIMBV! 🎓",
            htmlBody: welcomeHtml);

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

        var farewellHtml =
            "<div style=\"font-family:'Segoe UI',sans-serif;max-width:560px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px\">" +
            "<p style=\"color:#334155;font-size:15px\">Ai fost <strong>dezabonat cu succes</strong> de la newsletter-ul ASIMBV.</p>" +
            "<p style=\"color:#64748b;font-size:13px\">Dac\u0103 te-ai dezabonat din gre\u015feal\u0103, po\u021bi reveni oric\u00e2nd pe " +
            "<a href=\"https://asimbv.ro\" style=\"color:#003977\">asimbv.ro</a>.</p>" +
            "</div>";

        await _email.SendAsync(
            toEmail:  subscriber.Email,
            toName:   subscriber.Name.Length > 0 ? subscriber.Name : "Abonat",
            subject:  "Ai fost dezabonat de la newsletter-ul ASIMBV",
            htmlBody: farewellHtml);

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
