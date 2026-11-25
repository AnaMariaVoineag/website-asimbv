using Backend.Security;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin;

[ApiController]
[Route("api/admin/uploads")]
[RequireAdmin]
public class AdminUploadsController : ControllerBase
{
    private const long RequestLimit = UploadStorage.MaxFileBytes + 64 * 1024;

    private readonly UploadStorage _storage;

    public AdminUploadsController(UploadStorage storage)
    {
        _storage = storage;
    }

    // POST api/admin/uploads?folder=events|partners  (multipart/form-data, field "file")
    // Returns { url } to put in an event's images or a partner's logo.
    [HttpPost]
    [RequestSizeLimit(RequestLimit)]
    [RequestFormLimits(MultipartBodyLengthLimit = RequestLimit)]
    public async Task<IActionResult> Upload(IFormFile? file, [FromQuery] string? folder)
    {
        if (folder is null || !UploadStorage.Folders.Contains(folder))
            return BadRequest(new { message = "Folder de încărcare invalid." });

        if (file is null || file.Length == 0)
            return BadRequest(new { message = "Niciun fișier nu a fost încărcat." });

        if (file.Length > UploadStorage.MaxFileBytes)
            return BadRequest(new { message = $"Imaginea poate avea cel mult {UploadStorage.MaxFileBytes / (1024 * 1024)} MB." });

        var header = new byte[12];
        int read;
        await using (var probe = file.OpenReadStream())
        {
            read = await probe.ReadAtLeastAsync(header, header.Length, throwOnEndOfStream: false);
        }

        var extension = UploadStorage.DetectExtension(header.AsSpan(0, read));
        if (extension is null)
            return BadRequest(new { message = "Sunt acceptate doar imagini PNG, JPG, WEBP sau GIF." });

        // The name is generated, never taken from the upload, so it can't escape the folder or collide.
        var fileName = $"{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid():N}{extension}";
        var path = Path.Combine(_storage.RootPath, folder, fileName);

        await using (var target = new FileStream(path, FileMode.CreateNew, FileAccess.Write))
        {
            await file.CopyToAsync(target);
        }

        return Ok(new { url = $"{UploadStorage.RequestPath}/{folder}/{fileName}" });
    }
}
