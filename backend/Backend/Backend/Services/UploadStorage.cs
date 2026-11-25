namespace Backend.Services;

/// <summary>
/// Where images uploaded from the admin dashboard are kept, and how they are recognised.
/// Files are served by the static file middleware under <see cref="RequestPath"/>.
/// </summary>
public sealed class UploadStorage
{
    public const string RequestPath = "/api/uploads";
    public const long MaxFileBytes = 8 * 1024 * 1024;

    /// <summary>Sub-folders an upload may go to.</summary>
    public static readonly string[] Folders = ["events", "partners"];

    public string RootPath { get; }

    public UploadStorage(string rootPath)
    {
        RootPath = Path.GetFullPath(rootPath);
        foreach (var folder in Folders)
            Directory.CreateDirectory(Path.Combine(RootPath, folder));
    }

    /// <summary>
    /// The file extension for the image format found in the first bytes, or null when the file is not
    /// a PNG, JPEG, GIF or WebP. The content is checked rather than the name or the declared type, and
    /// SVG is not accepted because it can carry scripts.
    /// </summary>
    public static string? DetectExtension(ReadOnlySpan<byte> header)
    {
        if (header.StartsWith(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A })) return ".png";
        if (header.StartsWith(new byte[] { 0xFF, 0xD8, 0xFF })) return ".jpg";
        if (header.StartsWith("GIF87a"u8) || header.StartsWith("GIF89a"u8)) return ".gif";
        if (header.Length >= 12 && header[..4].SequenceEqual("RIFF"u8) && header[8..12].SequenceEqual("WEBP"u8)) return ".webp";
        return null;
    }
}
