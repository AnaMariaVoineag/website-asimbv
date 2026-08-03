using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/sponsors")]
public class SponsorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SponsorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SponsorDto>>> GetSponsors()
    {
        var sponsors = await _context.Sponsors
            .OrderBy(s => s.CompanyName)
            .Select(s => new SponsorDto
            {
                Id = s.Id,
                CompanyName = s.CompanyName,
                Website = s.Website,
                LogoUrl = s.LogoUrl,
                ContactPerson = s.ContactPerson,
                ContactEmail = s.ContactEmail,
                ContactPhone = s.ContactPhone,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            })
            .ToListAsync();

        return Ok(sponsors);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SponsorDto>> GetSponsor(int id)
    {
        var sponsor = await _context.Sponsors.FindAsync(id);
        if (sponsor == null)
        {
            return NotFound(new { message = $"Sponsor with ID {id} was not found." });
        }

        var dto = new SponsorDto
        {
            Id = sponsor.Id,
            CompanyName = sponsor.CompanyName,
            Website = sponsor.Website,
            LogoUrl = sponsor.LogoUrl,
            ContactPerson = sponsor.ContactPerson,
            ContactEmail = sponsor.ContactEmail,
            ContactPhone = sponsor.ContactPhone,
            CreatedAt = sponsor.CreatedAt,
            UpdatedAt = sponsor.UpdatedAt
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<SponsorDto>> CreateSponsor(CreateSponsorDto dto)
    {
        if (await _context.Sponsors.AnyAsync(s => s.CompanyName.ToLower() == dto.CompanyName.ToLower()))
        {
            return BadRequest(new { message = $"A sponsor with the company name '{dto.CompanyName}' already exists." });
        }

        var sponsor = new Sponsor
        {
            // Id is auto-incremented by PostgreSQL
            CompanyName = dto.CompanyName,
            Website = dto.Website,
            LogoUrl = dto.LogoUrl,
            ContactPerson = dto.ContactPerson,
            ContactEmail = dto.ContactEmail,
            ContactPhone = dto.ContactPhone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Sponsors.Add(sponsor);
        await _context.SaveChangesAsync();

        var resultDto = new SponsorDto
        {
            Id = sponsor.Id,
            CompanyName = sponsor.CompanyName,
            Website = sponsor.Website,
            LogoUrl = sponsor.LogoUrl,
            ContactPerson = sponsor.ContactPerson,
            ContactEmail = sponsor.ContactEmail,
            ContactPhone = sponsor.ContactPhone,
            CreatedAt = sponsor.CreatedAt,
            UpdatedAt = sponsor.UpdatedAt
        };

        return CreatedAtAction(nameof(GetSponsor), new { id = sponsor.Id }, resultDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSponsor(int id, CreateSponsorDto dto)
    {
        var sponsor = await _context.Sponsors.FindAsync(id);
        if (sponsor == null)
        {
            return NotFound(new { message = $"Sponsor with ID {id} was not found." });
        }

        if (sponsor.CompanyName.ToLower() != dto.CompanyName.ToLower() &&
            await _context.Sponsors.AnyAsync(s => s.CompanyName.ToLower() == dto.CompanyName.ToLower()))
        {
            return BadRequest(new { message = $"A sponsor with the company name '{dto.CompanyName}' already exists." });
        }

        sponsor.CompanyName = dto.CompanyName;
        sponsor.Website = dto.Website;
        sponsor.LogoUrl = dto.LogoUrl;
        sponsor.ContactPerson = dto.ContactPerson;
        sponsor.ContactEmail = dto.ContactEmail;
        sponsor.ContactPhone = dto.ContactPhone;
        sponsor.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSponsor(int id)
    {
        var sponsor = await _context.Sponsors.FindAsync(id);
        if (sponsor == null)
        {
            return NotFound(new { message = $"Sponsor with ID {id} was not found." });
        }

        _context.Sponsors.Remove(sponsor);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Event sponsorships endpoints mapped inside Sponsors controller via custom routes

    [HttpGet("/api/events/{eventId}/sponsors")]
    public async Task<ActionResult<IEnumerable<EventSponsorDto>>> GetEventSponsors(int eventId)
    {
        if (!await _context.Events.AnyAsync(e => e.Id == eventId))
        {
            return NotFound(new { message = $"Event with ID {eventId} was not found." });
        }

        var sponsorships = await _context.EventSponsors
            .Include(es => es.Sponsor)
            .Include(es => es.Event)
            .Where(es => es.EventId == eventId)
            .Select(es => new EventSponsorDto
            {
                EventId = es.EventId,
                EventTitle = es.Event.Title,
                SponsorId = es.SponsorId,
                SponsorName = es.Sponsor.CompanyName,
                ContributionDesc = es.ContributionDesc,
                CreatedAt = es.CreatedAt
            })
            .ToListAsync();

        return Ok(sponsorships);
    }

    [HttpPost("/api/events/{eventId}/sponsors")]
    public async Task<ActionResult<EventSponsorDto>> AssociateSponsor(int eventId, AssociateSponsorDto dto)
    {
        var ev = await _context.Events.FindAsync(eventId);
        if (ev == null)
        {
            return NotFound(new { message = $"Event with ID {eventId} was not found." });
        }

        if (!await _context.Sponsors.AnyAsync(s => s.Id == dto.SponsorId))
        {
            return BadRequest(new { message = $"Sponsor with ID {dto.SponsorId} does not exist." });
        }

        // Check if already associated
        var alreadyAssociated = await _context.EventSponsors
            .AnyAsync(es => es.EventId == eventId && es.SponsorId == dto.SponsorId);

        if (alreadyAssociated)
        {
            return BadRequest(new { message = "Sponsor is already associated with this event." });
        }

        var sponsorship = new EventSponsor
        {
            EventId = eventId,
            SponsorId = dto.SponsorId,
            ContributionDesc = dto.ContributionDesc,
            CreatedAt = DateTime.UtcNow
        };

        _context.EventSponsors.Add(sponsorship);
        await _context.SaveChangesAsync();

        // Reload to get names
        var created = await _context.EventSponsors
            .Include(es => es.Sponsor)
            .Include(es => es.Event)
            .FirstAsync(es => es.EventId == eventId && es.SponsorId == dto.SponsorId);

        var resultDto = new EventSponsorDto
        {
            EventId = created.EventId,
            EventTitle = created.Event.Title,
            SponsorId = created.SponsorId,
            SponsorName = created.Sponsor.CompanyName,
            ContributionDesc = created.ContributionDesc,
            CreatedAt = created.CreatedAt
        };

        return Ok(resultDto);
    }

    [HttpDelete("/api/events/{eventId}/sponsors/{sponsorId}")]
    public async Task<IActionResult> DisassociateSponsor(int eventId, int sponsorId)
    {
        var sponsorship = await _context.EventSponsors
            .FirstOrDefaultAsync(es => es.EventId == eventId && es.SponsorId == sponsorId);

        if (sponsorship == null)
        {
            return NotFound(new { message = $"Sponsorship was not found for sponsor {sponsorId} at event {eventId}." });
        }

        _context.EventSponsors.Remove(sponsorship);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
