namespace Backend.Validation;

/// <summary>Small helpers shared by the admin endpoints.</summary>
public static class AdminValidation
{
    public const int UrlMaxLength = 2000;

    /// <summary>Trimmed text with "\n" line endings, or null when empty.</summary>
    public static string? Clean(string? text) =>
        string.IsNullOrWhiteSpace(text) ? null : text.Trim().ReplaceLineEndings("\n");

    public static int LengthOf(string? text) => text?.Trim().Length ?? 0;

    public static bool IsHttpUrl(string? text) =>
        !string.IsNullOrWhiteSpace(text)
        && text.Trim().Length <= UrlMaxLength
        && Uri.TryCreate(text.Trim(), UriKind.Absolute, out var uri)
        && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);

    /// <summary>
    /// An image/logo reference: a path from the site root ("/poze_evenimente/x.png", "/api/uploads/events/x.jpg")
    /// or an absolute http(s) URL.
    /// </summary>
    public static bool IsAssetPath(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return false;
        var value = text.Trim();
        if (value.Length > UrlMaxLength) return false;
        if (IsHttpUrl(value)) return true;
        return value.StartsWith('/')
            && !value.StartsWith("//")
            && !value.Contains("..")
            && !value.Contains('\\')
            && !value.Any(char.IsControl);
    }
}
