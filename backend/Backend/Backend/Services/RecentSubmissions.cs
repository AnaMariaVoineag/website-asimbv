using System.Security.Cryptography;
using System.Text;

namespace Backend.Services;

/// <summary>
/// Remembers recently accepted submissions so that an identical repeat (double submit,
/// retry after a lost response) is not stored twice. Kept in memory: it resets on restart
/// and assumes a single backend instance. Only hashes are held, never the content itself.
/// </summary>
public sealed class RecentSubmissions
{
    private static readonly TimeSpan Window = TimeSpan.FromSeconds(60);

    private readonly Dictionary<string, DateTime> _expiresAt = new();
    private readonly object _lock = new();

    public static string KeyFor(params string[] parts) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(string.Join('\0', parts))));

    /// <summary>Returns false if the same key was registered within the window.</summary>
    public bool TryRegister(string key)
    {
        var now = DateTime.UtcNow;
        lock (_lock)
        {
            foreach (var expired in _expiresAt.Where(e => e.Value <= now).Select(e => e.Key).ToList())
                _expiresAt.Remove(expired);

            return _expiresAt.TryAdd(key, now + Window);
        }
    }

    /// <summary>Forgets a key whose submission failed, so the user can retry straight away.</summary>
    public void Forget(string key)
    {
        lock (_lock)
        {
            _expiresAt.Remove(key);
        }
    }
}
