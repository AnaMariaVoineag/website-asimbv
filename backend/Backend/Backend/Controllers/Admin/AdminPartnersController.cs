using Backend.Data;
using Backend.Models;
using Backend.Security;
using Backend.Validation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Admin;

/// <summary>Type null = only credited on event pages, not shown on the partners page or in the footer.</summary>
public record PartnerInput(string? Name, string? Type, bool IsFeatured, int DisplayOrder, string? LogoUrl, string? WebsiteUrl);

public record AdminPartnerDto(int Id, string Name, string? Type, bool IsFeatured, int DisplayOrder, string? LogoUrl, string? WebsiteUrl, int EventCount);

[ApiController]
[Route("api/admin/partners")]
[RequireAdmin]
public class AdminPartnersController : ControllerBase
{
    private const int NameMaxLength = 150;

    private static readonly string[] Types =
        [PartnerTypes.Educational, PartnerTypes.Affiliation, PartnerTypes.Association, PartnerTypes.Company];

    private readonly AppDbContext _context;

    public AdminPartnersController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/admin/partners (all organisations, including the ones only credited on events)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminPartnerDto>>> GetPartners()
    {
        var eventCounts = await _context.EventPartners
            .GroupBy(l => l.PartnerId)
            .Select(g => new { PartnerId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.PartnerId, x => x.Count);

        var partners = await _context.Partners.AsNoTracking()
            .OrderBy(p => p.DisplayOrder).ThenBy(p => p.Name)
            .ToListAsync();

        return partners.Select(p => ToDto(p, eventCounts.GetValueOrDefault(p.Id))).ToList();
    }

    // POST api/admin/partners
    [HttpPost]
    public async Task<ActionResult<AdminPartnerDto>> CreatePartner([FromBody] PartnerInput input)
    {
        var error = await ValidateAsync(input, currentId: null);
        if (error is not null)
            return BadRequest(new { message = error });

        var partner = new Partner();
        Apply(partner, input);
        _context.Partners.Add(partner);
        await _context.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, ToDto(partner, 0));
    }

    // PUT api/admin/partners/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AdminPartnerDto>> UpdatePartner(int id, [FromBody] PartnerInput input)
    {
        var partner = await _context.Partners.FindAsync(id);
        if (partner is null)
            return NotFound(new { message = "Partenerul nu mai există." });

        var error = await ValidateAsync(input, currentId: id);
        if (error is not null)
            return BadRequest(new { message = error });

        Apply(partner, input);
        await _context.SaveChangesAsync();

        var eventCount = await _context.EventPartners.CountAsync(l => l.PartnerId == id);
        return ToDto(partner, eventCount);
    }

    // DELETE api/admin/partners/5 (also removes it from every event page)
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePartner(int id)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        await _context.EventPartners.Where(l => l.PartnerId == id).ExecuteDeleteAsync();
        var deleted = await _context.Partners.Where(p => p.Id == id).ExecuteDeleteAsync();

        await transaction.CommitAsync();
        return deleted == 0 ? NotFound(new { message = "Partenerul nu mai există." }) : NoContent();
    }

    private async Task<string?> ValidateAsync(PartnerInput input, int? currentId)
    {
        if (string.IsNullOrWhiteSpace(input.Name))
            return "Numele este obligatoriu.";
        if (input.Name.Trim().Length > NameMaxLength)
            return $"Numele poate avea cel mult {NameMaxLength} de caractere.";

        if (!string.IsNullOrEmpty(input.Type) && !Types.Contains(input.Type))
            return "Tipul selectat nu este valid.";

        if (!string.IsNullOrWhiteSpace(input.LogoUrl) && !AdminValidation.IsAssetPath(input.LogoUrl))
            return "Adresa logo-ului este invalidă.";

        if (!string.IsNullOrWhiteSpace(input.WebsiteUrl) && !AdminValidation.IsHttpUrl(input.WebsiteUrl))
            return "Site-ul trebuie să fie o adresă completă (https://...).";

        // Names are unique (index IX_Partners_Name); compared without case so near-duplicates are caught too.
        var name = input.Name.Trim().ToLower();
        var taken = await _context.Partners.AnyAsync(p => p.Name.ToLower() == name && p.Id != (currentId ?? 0));
        return taken ? "Există deja un partener cu acest nume." : null;
    }

    private static void Apply(Partner partner, PartnerInput input)
    {
        partner.Name = input.Name!.Trim();
        partner.Type = string.IsNullOrEmpty(input.Type) ? null : input.Type;
        // Featured only means something for partners shown on the partners page.
        partner.IsFeatured = partner.Type is not null && input.IsFeatured;
        partner.DisplayOrder = input.DisplayOrder;
        partner.LogoUrl = AdminValidation.Clean(input.LogoUrl);
        partner.WebsiteUrl = AdminValidation.Clean(input.WebsiteUrl);
    }

    private static AdminPartnerDto ToDto(Partner p, int eventCount) =>
        new(p.Id, p.Name, p.Type, p.IsFeatured, p.DisplayOrder, p.LogoUrl, p.WebsiteUrl, eventCount);
}
