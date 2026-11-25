using Backend.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Backend.Controllers.Admin;

public record AdminLoginRequest(string? Email, string? Password);

[ApiController]
[Route("api/admin")]
public class AdminAuthController : ControllerBase
{
    /// <summary>Rate-limit policy name, registered in Program.cs.</summary>
    public const string LoginRateLimitPolicy = "admin-login";

    private readonly AdminAuth _auth;
    private readonly ILogger<AdminAuthController> _logger;

    public AdminAuthController(AdminAuth auth, ILogger<AdminAuthController> logger)
    {
        _auth = auth;
        _logger = logger;
    }

    // POST api/admin/login  { "email": "...", "password": "..." } -> { token, email, expiresAt }
    [HttpPost("login")]
    [EnableRateLimiting(LoginRateLimitPolicy)]
    [RequestSizeLimit(16 * 1024)]
    public IActionResult Login([FromBody] AdminLoginRequest request)
    {
        if (!_auth.IsConfigured)
            return StatusCode(StatusCodes.Status503ServiceUnavailable,
                new { message = "Contul de administrare nu este configurat pe server." });

        if (!_auth.CredentialsMatch(request.Email, request.Password))
        {
            _logger.LogWarning("[Admin] Failed login from {Ip}.", HttpContext.Connection.RemoteIpAddress);
            return Unauthorized(new { message = "Email sau parolă greșită." });
        }

        var (token, expiresAt) = _auth.IssueToken();
        _logger.LogInformation("[Admin] Login from {Ip}.", HttpContext.Connection.RemoteIpAddress);
        return Ok(new { token, email = _auth.Email, expiresAt });
    }
}
