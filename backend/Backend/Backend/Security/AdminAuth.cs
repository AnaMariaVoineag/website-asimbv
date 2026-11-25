using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.DataProtection;

namespace Backend.Security;

/// <summary>
/// The single admin account of the dashboard. Its email and password come from configuration
/// ("Admin:Email" / "Admin:Password", env vars Admin__Email / Admin__Password), never from the code.
/// While either is missing or the password is too short, every login is refused.
///
/// A successful login returns an encrypted, time-limited session token (ASP.NET Data Protection).
/// The token also carries a fingerprint of the password, so changing the password signs out every session.
/// </summary>
public sealed class AdminAuth
{
    public const int MinPasswordLength = 12;
    public static readonly TimeSpan SessionLifetime = TimeSpan.FromHours(12);

    private readonly IConfiguration _config;
    private readonly ITimeLimitedDataProtector _protector;
    private readonly ILogger<AdminAuth> _logger;

    public AdminAuth(IConfiguration config, IDataProtectionProvider dataProtection, ILogger<AdminAuth> logger)
    {
        _config = config;
        _protector = dataProtection.CreateProtector("Backend.AdminSession.v1").ToTimeLimitedDataProtector();
        _logger = logger;
    }

    public string? Email => _config["Admin:Email"]?.Trim().ToLowerInvariant() is { Length: > 0 } email ? email : null;
    private string? Password => _config["Admin:Password"] is { Length: >= MinPasswordLength } password ? password : null;

    public bool IsConfigured
    {
        get
        {
            if (Email is not null && Password is not null) return true;
            _logger.LogWarning(
                "[Admin] Admin:Email / Admin:Password not configured (password needs at least {Min} characters): admin login is disabled.",
                MinPasswordLength);
            return false;
        }
    }

    public bool CredentialsMatch(string? email, string? password)
    {
        var expectedEmail = Email;
        var expectedPassword = Password;
        if (expectedEmail is null || expectedPassword is null) return false;

        // Both comparisons always run and take the same time, so timing reveals nothing.
        var emailOk = FixedTimeEquals(email?.Trim().ToLowerInvariant() ?? string.Empty, expectedEmail);
        var passwordOk = FixedTimeEquals(password ?? string.Empty, expectedPassword);
        return emailOk & passwordOk;
    }

    public (string Token, DateTimeOffset ExpiresAt) IssueToken()
    {
        var expiresAt = DateTimeOffset.UtcNow.Add(SessionLifetime);
        var token = _protector.Protect($"{Email}\n{PasswordFingerprint()}", expiresAt);
        return (token, expiresAt);
    }

    public bool ValidateToken(string? token)
    {
        if (string.IsNullOrEmpty(token) || Email is null || Password is null) return false;
        try
        {
            // Throws when the token was tampered with, is malformed, or has expired.
            var payload = _protector.Unprotect(token, out _);
            return FixedTimeEquals(payload, $"{Email}\n{PasswordFingerprint()}");
        }
        catch (CryptographicException)
        {
            return false;
        }
    }

    private string PasswordFingerprint() =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes("admin-session:" + Password)))[..16];

    // Hashing gives both sides the same length, so the comparison time reveals nothing about the values.
    private static bool FixedTimeEquals(string provided, string expected) =>
        CryptographicOperations.FixedTimeEquals(
            SHA256.HashData(Encoding.UTF8.GetBytes(provided)),
            SHA256.HashData(Encoding.UTF8.GetBytes(expected)));
}
