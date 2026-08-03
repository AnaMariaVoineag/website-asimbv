using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/event-categories")]
public class EventCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EventCategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventCategoryDto>>> GetCategories()
    {
        var categories = await _context.EventCategories
            .OrderBy(c => c.Name)
            .Select(c => new EventCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventCategoryDto>> GetCategory(int id)
    {
        var category = await _context.EventCategories.FindAsync(id);

        if (category == null)
        {
            return NotFound(new { message = $"Category with ID {id} was not found." });
        }

        var dto = new EventCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<EventCategoryDto>> CreateCategory(CreateEventCategoryDto dto)
    {
        if (await _context.EventCategories.AnyAsync(c => c.Name.ToLower() == dto.Name.ToLower()))
        {
            return BadRequest(new { message = $"A category with the name '{dto.Name}' already exists." });
        }

        var category = new EventCategory
        {
            // Id is auto-incremented by PostgreSQL
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.EventCategories.Add(category);
        await _context.SaveChangesAsync();

        var resultDto = new EventCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt
        };

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, resultDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.EventCategories.FindAsync(id);
        if (category == null)
        {
            return NotFound(new { message = $"Category with ID {id} was not found." });
        }

        _context.EventCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
