using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Backend.Security;

/// <summary>
/// Restricts an endpoint to a signed-in admin: the request must carry "Authorization: Bearer &lt;token&gt;"
/// with a session token from POST api/admin/login (see <see cref="AdminAuth"/>).
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class RequireAdminAttribute : Attribute, IAuthorizationFilter
{
    private const string BearerPrefix = "Bearer ";

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var header = context.HttpContext.Request.Headers.Authorization.ToString();
        var token = header.StartsWith(BearerPrefix, StringComparison.OrdinalIgnoreCase)
            ? header[BearerPrefix.Length..].Trim()
            : string.Empty;

        var auth = context.HttpContext.RequestServices.GetRequiredService<AdminAuth>();
        if (!auth.ValidateToken(token))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Sesiunea a expirat. Autentifică-te din nou." });
        }
    }
}
