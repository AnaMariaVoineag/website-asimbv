using System.Text.RegularExpressions;

namespace Backend.Validation;

public static class EmailFormat
{
    private static readonly Regex Pattern = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.CultureInvariant);

    /// <summary>Basic shape check (name@domain.tld). Pass a trimmed value that is already length-limited.</summary>
    public static bool IsValid(string email) => Pattern.IsMatch(email);
}
