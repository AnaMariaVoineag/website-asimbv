namespace Backend.Models;

/// <summary>Values of <see cref="Partner.Type"/>. Each one is a section of the partners page.</summary>
public static class PartnerTypes
{
    public const string Educational = "educational";
    public const string Affiliation = "affiliation";
    public const string Association = "association";
    public const string Company = "company";
}

/// <summary>An organisation credited on the partners page, on event pages, or both.</summary>
public class Partner
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// See <see cref="PartnerTypes"/>. Null means the organisation is only credited on the events it
    /// took part in and is NOT a partner of ASIMBv itself, so it stays off the partners page and footer.
    /// </summary>
    public string? Type { get; set; }
    /// <summary>Shown in the footer band. Only meaningful when <see cref="Type"/> is set.</summary>
    public bool IsFeatured { get; set; }
    public int DisplayOrder { get; set; }
    /// <summary>
    /// Path relative to the frontend public root, e.g. "/parteneri/siemens.svg".
    /// Null means the name is displayed instead of a logo.
    /// </summary>
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
}

/// <summary>Links a partner to an event. The role belongs here because it can differ per event.</summary>
public class EventPartner
{
    public int EventId { get; set; }
    public int PartnerId { get; set; }
    /// <summary>Heading the partner is grouped under on the event page, e.g. "Companii participante".</summary>
    public string Role { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public Partner? Partner { get; set; }
}
