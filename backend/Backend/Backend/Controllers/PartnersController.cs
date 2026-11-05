using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

public record PartnerDto(string Name, string Type, string? LogoUrl, string? WebsiteUrl);

[ApiController]
[Route("api/[controller]")]
public class PartnersController : ControllerBase
{
    private readonly AppDbContext _context;

    public PartnersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/partners and api/partners?featured=true
    // Organisations without a Type are only credited on their events, so they are left out here.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PartnerDto>>> GetPartners([FromQuery] bool featured = false)
    {
        var partners = await _context.Partners
            .AsNoTracking()
            .Where(p => p.Type != null && (!featured || p.IsFeatured))
            .OrderBy(p => p.DisplayOrder)
            .ThenBy(p => p.Name)
            .Select(p => new PartnerDto(p.Name, p.Type!, p.LogoUrl, p.WebsiteUrl))
            .ToListAsync();

        return Ok(partners);
    }
}
