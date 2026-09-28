using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContactController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/contact
    [HttpPost]
    public async Task<IActionResult> SubmitMessage([FromBody] ContactMessage message)
    {
        if (string.IsNullOrWhiteSpace(message.Name) ||
            string.IsNullOrWhiteSpace(message.Email) ||
            string.IsNullOrWhiteSpace(message.Subject) ||
            string.IsNullOrWhiteSpace(message.Message))
        {
            return BadRequest(new { message = "Toate câmpurile sunt obligatorii." });
        }

        message.CreatedAt = DateTime.UtcNow;
        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        return Ok(new 
        { 
            success = true, 
            message = "Mesajul tău a fost transmis cu succes! Te vom contacta în cel mai scurt timp." 
        });
    }

    // GET: api/contact (For viewing submitted messages)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
    {
        return await _context.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }
}
