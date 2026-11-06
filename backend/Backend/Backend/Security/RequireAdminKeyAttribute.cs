using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Backend.Security;

/// <summary>
/// Restricts an endpoint to callers sending the admin key in the X-Admin-Key header.
/// The key comes from the "Admin:ApiKey" setting (env var Admin__ApiKey). If it is not
/// configured, every request is rejected, so a missing setting can never expose data.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class RequireAdminKeyAttribute : Attribute, IAuthorizationFilter
{
    private const string HeaderName = "X-Admin-Key";

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var services = context.HttpContext.RequestServices;
        var expectedKey = services.GetRequiredService<IConfiguration>()["Admin:ApiKey"];

        if (string.IsNullOrWhiteSpace(expectedKey))
        {
            services.GetRequiredService<ILogger<RequireAdminKeyAttribute>>()
                .LogWarning("[Admin] Admin:ApiKey is not configured: rejecting request to {Path}.", context.HttpContext.Request.Path);
            context.Result = Unauthorized();
            return;
        }

        var providedKey = context.HttpContext.Request.Headers[HeaderName].ToString();
        if (!KeysMatch(providedKey, expectedKey))
        {
            context.Result = Unauthorized();
        }
    }

    private static UnauthorizedObjectResult Unauthorized() =>
        new(new { message = "Acces neautorizat." });

    // Hashing gives both sides the same length, so the comparison time reveals nothing about the key.
    private static bool KeysMatch(string provided, string expected) =>
        CryptographicOperations.FixedTimeEquals(
            SHA256.HashData(Encoding.UTF8.GetBytes(provided)),
            SHA256.HashData(Encoding.UTF8.GetBytes(expected)));
}
