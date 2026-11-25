using System.Text.Json;
using Backend.Data;
using Backend.Models;
using Backend.Security;
using Backend.Validation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers.Admin;

public record EventPartnerLinkInput(int PartnerId, string? Role);

/// <summary>Body of POST/PUT. Partners are listed in the order they appear on the event page.</summary>
public record EventInput(
    string? Title,
    string? TitleEn,
    string? Date,
    string? Category,
    string? Description,
    string? DescriptionEn,
    string? LongDescription,
    string? LongDescriptionEn,
    string? FormUrl,
    List<string>? Images,
    List<EventPartnerLinkInput>? Partners);

public record AdminEventPartnerDto(int PartnerId, string Name, string? LogoUrl, string Role);

public record AdminEventDto(
    int Id,
    string Title,
    string? TitleEn,
    string Date,
    string Category,
    string Description,
    string? DescriptionEn,
    string? LongDescription,
    string? LongDescriptionEn,
    string? FormUrl,
    List<string> Images,
    List<AdminEventPartnerDto> Partners);

public record AdminEventSummaryDto(
    int Id,
    string Title,
    string? TitleEn,
    string Date,
    string Category,
    string? Cover,
    int ImageCount,
    int PartnerCount,
    bool HasForm);

[ApiController]
[Route("api/admin/events")]
[RequireAdmin]
public class AdminEventsController : ControllerBase
{
    /// <summary>Keep in sync with KNOWN_CATEGORIES / the filters in the frontend.</summary>
    public static readonly string[] Categories = ["Workshop", "Social", "Competition"];

    private const int TitleMaxLength = 200;
    private const int DateMaxLength = 100;
    private const int DescriptionMaxLength = 600;
    private const int LongDescriptionMaxLength = 20000;
    private const int RoleMaxLength = 100;
    private const int MaxImages = 30;

    private readonly AppDbContext _context;

    public AdminEventsController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/admin/events (newest first)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminEventSummaryDto>>> GetEvents()
    {
        var events = await _context.Events.AsNoTracking().OrderByDescending(e => e.Id).ToListAsync();
        var partnerCounts = await _context.EventPartners
            .GroupBy(l => l.EventId)
            .Select(g => new { EventId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.EventId, x => x.Count);

        return events.Select(e =>
        {
            var images = ParseImages(e.Images);
            return new AdminEventSummaryDto(
                e.Id, e.Title, e.TitleEn, e.Date, e.Category,
                images.FirstOrDefault(), images.Count,
                partnerCounts.GetValueOrDefault(e.Id),
                !string.IsNullOrWhiteSpace(e.FormUrl));
        }).ToList();
    }

    // GET api/admin/events/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AdminEventDto>> GetEvent(int id)
    {
        var item = await _context.Events.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        if (item is null)
            return NotFound(new { message = "Evenimentul nu mai există." });

        return await ToDtoAsync(item);
    }

    // POST api/admin/events
    [HttpPost]
    public async Task<ActionResult<AdminEventDto>> CreateEvent([FromBody] EventInput input)
    {
        var error = await ValidateAsync(input);
        if (error is not null)
            return BadRequest(new { message = error });

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var item = new EventItem();
        Apply(item, input);
        _context.Events.Add(item);
        await _context.SaveChangesAsync();

        await ReplacePartnersAsync(item.Id, input.Partners);
        await transaction.CommitAsync();

        return StatusCode(StatusCodes.Status201Created, await ToDtoAsync(item));
    }

    // PUT api/admin/events/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AdminEventDto>> UpdateEvent(int id, [FromBody] EventInput input)
    {
        var item = await _context.Events.FindAsync(id);
        if (item is null)
            return NotFound(new { message = "Evenimentul nu mai există." });

        var error = await ValidateAsync(input);
        if (error is not null)
            return BadRequest(new { message = error });

        await using var transaction = await _context.Database.BeginTransactionAsync();

        Apply(item, input);
        await _context.SaveChangesAsync();

        await ReplacePartnersAsync(item.Id, input.Partners);
        await transaction.CommitAsync();

        return await ToDtoAsync(item);
    }

    // DELETE api/admin/events/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        // Links are removed explicitly so this never depends on the database enforcing the cascade.
        await _context.EventPartners.Where(l => l.EventId == id).ExecuteDeleteAsync();
        var deleted = await _context.Events.Where(e => e.Id == id).ExecuteDeleteAsync();

        await transaction.CommitAsync();
        return deleted == 0 ? NotFound(new { message = "Evenimentul nu mai există." }) : NoContent();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    internal static List<string> ParseImages(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return [];
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }

    private async Task<string?> ValidateAsync(EventInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
            return "Titlul este obligatoriu.";
        if (AdminValidation.LengthOf(input.Title) > TitleMaxLength || AdminValidation.LengthOf(input.TitleEn) > TitleMaxLength)
            return $"Titlul poate avea cel mult {TitleMaxLength} de caractere.";

        if (string.IsNullOrWhiteSpace(input.Date))
            return "Data este obligatorie.";
        if (AdminValidation.LengthOf(input.Date) > DateMaxLength)
            return $"Data poate avea cel mult {DateMaxLength} de caractere.";

        if (input.Category is null || !Categories.Contains(input.Category))
            return "Categoria selectată nu este validă.";

        if (string.IsNullOrWhiteSpace(input.Description))
            return "Descrierea scurtă este obligatorie.";
        if (AdminValidation.LengthOf(input.Description) > DescriptionMaxLength || AdminValidation.LengthOf(input.DescriptionEn) > DescriptionMaxLength)
            return $"Descrierea scurtă poate avea cel mult {DescriptionMaxLength} de caractere.";

        if (AdminValidation.LengthOf(input.LongDescription) > LongDescriptionMaxLength || AdminValidation.LengthOf(input.LongDescriptionEn) > LongDescriptionMaxLength)
            return $"Descrierea completă poate avea cel mult {LongDescriptionMaxLength} de caractere.";

        if (!string.IsNullOrWhiteSpace(input.FormUrl) && !AdminValidation.IsHttpUrl(input.FormUrl))
            return "Linkul de înscriere trebuie să fie o adresă completă (https://...).";

        var images = input.Images ?? [];
        if (images.Count > MaxImages)
            return $"Un eveniment poate avea cel mult {MaxImages} de imagini.";
        if (images.Any(image => !AdminValidation.IsAssetPath(image)))
            return "Una dintre imagini are o adresă invalidă.";

        var links = input.Partners ?? [];
        if (links.Select(l => l.PartnerId).Distinct().Count() != links.Count)
            return "Un partener apare de mai multe ori la acest eveniment.";
        if (links.Any(l => string.IsNullOrWhiteSpace(l.Role) || l.Role.Trim().Length > RoleMaxLength))
            return $"Fiecare partener are nevoie de un rol (cel mult {RoleMaxLength} de caractere).";

        if (links.Count > 0)
        {
            var ids = links.Select(l => l.PartnerId).ToList();
            var found = await _context.Partners.CountAsync(p => ids.Contains(p.Id));
            if (found != ids.Count)
                return "Unul dintre partenerii selectați nu mai există.";
        }

        return null;
    }

    // Only called after ValidateAsync succeeded, so the required fields are present.
    private static void Apply(EventItem item, EventInput input)
    {
        item.Title = input.Title!.Trim();
        item.TitleEn = AdminValidation.Clean(input.TitleEn);
        item.Date = input.Date!.Trim();
        item.Category = input.Category!;
        item.Description = AdminValidation.Clean(input.Description)!;
        item.DescriptionEn = AdminValidation.Clean(input.DescriptionEn);
        item.LongDescription = AdminValidation.Clean(input.LongDescription);
        item.LongDescriptionEn = AdminValidation.Clean(input.LongDescriptionEn);
        item.FormUrl = AdminValidation.Clean(input.FormUrl);

        var images = (input.Images ?? []).Select(image => image.Trim()).ToList();
        item.Images = images.Count == 0 ? null : JsonSerializer.Serialize(images);
    }

    private async Task ReplacePartnersAsync(int eventId, List<EventPartnerLinkInput>? links)
    {
        await _context.EventPartners.Where(l => l.EventId == eventId).ExecuteDeleteAsync();

        var position = 0;
        foreach (var link in links ?? [])
        {
            _context.EventPartners.Add(new EventPartner
            {
                EventId = eventId,
                PartnerId = link.PartnerId,
                Role = link.Role!.Trim(),
                DisplayOrder = ++position,
            });
        }

        await _context.SaveChangesAsync();
    }

    private async Task<AdminEventDto> ToDtoAsync(EventItem item)
    {
        var partners = await _context.EventPartners
            .AsNoTracking()
            .Where(l => l.EventId == item.Id)
            .OrderBy(l => l.DisplayOrder)
            .Select(l => new AdminEventPartnerDto(l.PartnerId, l.Partner!.Name, l.Partner.LogoUrl, l.Role))
            .ToListAsync();

        return new AdminEventDto(
            item.Id, item.Title, item.TitleEn, item.Date, item.Category,
            item.Description, item.DescriptionEn, item.LongDescription, item.LongDescriptionEn,
            item.FormUrl, ParseImages(item.Images), partners);
    }
}
