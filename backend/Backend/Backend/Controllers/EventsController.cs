using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/events?category=Workshop&search=hackathon&page=1&pageSize=6
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventItem>>> GetEvents(
        [FromQuery] string? category,
        [FromQuery] string? search)
    {
        IQueryable<EventItem> query = _context.Events.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase) && !category.Equals("Toate", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(e => e.Category.ToLower() == category.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(term) || e.Description.ToLower().Contains(term));
        }

        var events = await query.OrderBy(e => e.Id).ToListAsync();
        return Ok(events);
    }

    // GET: api/events/5
    [HttpGet("{id}")]
    public async Task<ActionResult<EventItem>> GetEvent(int id)
    {
        var eventItem = await _context.Events.FindAsync(id);

        if (eventItem == null)
        {
            return NotFound();
        }

        return eventItem;
    }

    // POST: api/events
    [HttpPost]
    public async Task<ActionResult<EventItem>> PostEvent(EventItem eventItem)
    {
        _context.Events.Add(eventItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Id }, eventItem);
    }

    // PUT: api/events/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEvent(int id, EventItem eventItem)
    {
        if (id != eventItem.Id)
        {
            return BadRequest();
        }

        _context.Entry(eventItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EventExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/events/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var eventItem = await _context.Events.FindAsync(id);
        if (eventItem == null)
        {
            return NotFound();
        }

        _context.Events.Remove(eventItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool EventExists(int id)
    {
        return _context.Events.Any(e => e.Id == id);
    }
}
