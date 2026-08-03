using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EventsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents(
        [FromQuery] int? categoryId,
        [FromQuery] string? search,
        [FromQuery] bool? isPublished)
    {
        var query = _context.Events
            .Include(e => e.Category)
            .Include(e => e.Creator)
            .AsQueryable();

        // Filter by category
        if (categoryId.HasValue)
        {
            query = query.Where(e => e.CategoryId == categoryId.Value);
        }

        // Filter by search query (title / location)
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(e => e.Title.ToLower().Contains(searchLower) || 
                                     (e.Location != null && e.Location.ToLower().Contains(searchLower)));
        }

        // Filter by published status
        if (isPublished.HasValue)
        {
            query = query.Where(e => e.IsPublished == isPublished.Value);
        }

        var events = await query
            .OrderBy(e => e.StartDatetime)
            .Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                StartDatetime = e.StartDatetime,
                EndDatetime = e.EndDatetime,
                Location = e.Location,
                CategoryId = e.CategoryId,
                CategoryName = e.Category != null ? e.Category.Name : null,
                CreatedById = e.CreatedById,
                CreatorName = e.Creator != null ? $"{e.Creator.FirstName} {e.Creator.LastName}" : null,
                IsPublished = e.IsPublished,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            })
            .ToListAsync();

        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetEvent(int id)
    {
        var ev = await _context.Events
            .Include(e => e.Category)
            .Include(e => e.Creator)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (ev == null)
        {
            return NotFound(new { message = $"Event with ID {id} was not found." });
        }

        var dto = new EventDto
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            StartDatetime = ev.StartDatetime,
            EndDatetime = ev.EndDatetime,
            Location = ev.Location,
            CategoryId = ev.CategoryId,
            CategoryName = ev.Category != null ? ev.Category.Name : null,
            CreatedById = ev.CreatedById,
            CreatorName = ev.Creator != null ? $"{ev.Creator.FirstName} {ev.Creator.LastName}" : null,
            IsPublished = ev.IsPublished,
            CreatedAt = ev.CreatedAt,
            UpdatedAt = ev.UpdatedAt
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<EventDto>> CreateEvent(CreateEventDto dto)
    {
        // If CategoryId is specified, check if it exists
        if (dto.CategoryId.HasValue)
        {
            var categoryExists = await _context.EventCategories.AnyAsync(c => c.Id == dto.CategoryId.Value);
            if (!categoryExists)
            {
                return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist." });
            }
        }

        // If CreatedById is specified, check if it exists
        if (dto.CreatedById.HasValue)
        {
            var memberExists = await _context.Members.AnyAsync(m => m.Id == dto.CreatedById.Value);
            if (!memberExists)
            {
                return BadRequest(new { message = $"Member (Creator) with ID {dto.CreatedById} does not exist." });
            }
        }

        var ev = new Event
        {
            // Id is auto-incremented by PostgreSQL
            Title = dto.Title,
            Description = dto.Description,
            StartDatetime = dto.StartDatetime,
            EndDatetime = dto.EndDatetime,
            Location = dto.Location,
            CategoryId = dto.CategoryId,
            CreatedById = dto.CreatedById,
            IsPublished = dto.IsPublished,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        // Reload to include relations for output DTO
        var createdEvent = await _context.Events
            .Include(e => e.Category)
            .Include(e => e.Creator)
            .FirstAsync(e => e.Id == ev.Id);

        var resultDto = new EventDto
        {
            Id = createdEvent.Id,
            Title = createdEvent.Title,
            Description = createdEvent.Description,
            StartDatetime = createdEvent.StartDatetime,
            EndDatetime = createdEvent.EndDatetime,
            Location = createdEvent.Location,
            CategoryId = createdEvent.CategoryId,
            CategoryName = createdEvent.Category != null ? createdEvent.Category.Name : null,
            CreatedById = createdEvent.CreatedById,
            CreatorName = createdEvent.Creator != null ? $"{createdEvent.Creator.FirstName} {createdEvent.Creator.LastName}" : null,
            IsPublished = createdEvent.IsPublished,
            CreatedAt = createdEvent.CreatedAt,
            UpdatedAt = createdEvent.UpdatedAt
        };

        return CreatedAtAction(nameof(GetEvent), new { id = ev.Id }, resultDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(int id, UpdateEventDto dto)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null)
        {
            return NotFound(new { message = $"Event with ID {id} was not found." });
        }

        if (dto.CategoryId.HasValue)
        {
            var categoryExists = await _context.EventCategories.AnyAsync(c => c.Id == dto.CategoryId.Value);
            if (!categoryExists)
            {
                return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist." });
            }
        }

        ev.Title = dto.Title;
        ev.Description = dto.Description;
        ev.StartDatetime = dto.StartDatetime;
        ev.EndDatetime = dto.EndDatetime;
        ev.Location = dto.Location;
        ev.CategoryId = dto.CategoryId;
        ev.IsPublished = dto.IsPublished;
        ev.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null)
        {
            return NotFound(new { message = $"Event with ID {id} was not found." });
        }

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
