using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _email;

    public ContactController(AppDbContext context, IEmailService email)
    {
        _context = context;
        _email   = email;
    }

    // POST: api/contact
    [HttpPost]
    public async Task<IActionResult> SubmitMessage([FromBody] ContactMessage message)
    {
        if (string.IsNullOrWhiteSpace(message.Name)    ||
            string.IsNullOrWhiteSpace(message.Email)   ||
            string.IsNullOrWhiteSpace(message.Subject) ||
            string.IsNullOrWhiteSpace(message.Message))
        {
            return BadRequest(new { message = "Toate câmpurile sunt obligatorii." });
        }

        message.CreatedAt = DateTime.UtcNow;
        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        // ── Internal notification email ──────────────────────────────────────
        var notifHtml = $"""
            <div style="font-family:'Segoe UI',Roboto,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#003977,#0064d2);padding:24px 32px">
                <h2 style="color:#fff;margin:0;font-size:20px">📬 Mesaj nou prin formularul de contact</h2>
                <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px">ASIMBV Website — {DateTime.UtcNow:dd MMM yyyy, HH:mm} UTC</p>
              </div>
              <div style="padding:28px 32px;background:#fff">
                <table style="width:100%;border-collapse:collapse;font-size:14px">
                  <tr><td style="padding:8px 0;color:#64748b;width:120px">Nume</td><td style="padding:8px 0;font-weight:600;color:#1e293b">{message.Name}</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0"><a href="mailto:{message.Email}" style="color:#003977">{message.Email}</a></td></tr>
                  <tr><td style="padding:8px 0;color:#64748b">Subiect</td><td style="padding:8px 0;font-weight:600;color:#1e293b">{message.Subject}</td></tr>
                </table>
                <div style="margin-top:16px;padding:16px;background:#f8fafc;border-left:4px solid #003977;border-radius:4px">
                  <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;white-space:pre-wrap">{message.Message}</p>
                </div>
                <div style="margin-top:20px">
                  <a href="mailto:{message.Email}?subject=Re: {Uri.EscapeDataString(message.Subject)}" 
                     style="display:inline-block;background:#003977;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
                    Răspunde direct
                  </a>
                </div>
              </div>
              <div style="padding:14px 32px;background:#f1f5f9;font-size:11px;color:#94a3b8;text-align:center">
                Mesaj salvat în baza de date ASIMBV · ID #{message.Id}
              </div>
            </div>
            """;

        await _email.SendNotificationAsync(
            subject:  $"[Contact ASIMBV] {message.Subject} — de la {message.Name}",
            htmlBody: notifHtml);

        return Ok(new
        {
            success = true,
            message = "Mesajul tău a fost transmis cu succes! Te vom contacta în cel mai scurt timp."
        });
    }

    // GET: api/contact (For viewing submitted messages — protect with [Authorize] in production)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
    {
        return await _context.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }
}
