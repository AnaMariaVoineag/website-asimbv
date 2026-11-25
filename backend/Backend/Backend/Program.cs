using System.Threading.RateLimiting;
using Backend.Controllers.Admin;
using Backend.Data;
using Backend.Security;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddSingleton<RecentSubmissions>();

// Admin dashboard account (Admin:Email / Admin:Password) and its encrypted session tokens.
builder.Services.AddDataProtection();
builder.Services.AddSingleton<AdminAuth>();

// At most 5 login attempts per minute per IP address, so the password can't be guessed by brute force.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = (context, cancellationToken) =>
        new ValueTask(context.HttpContext.Response.WriteAsJsonAsync(
            new { message = "Prea multe încercări. Așteaptă un minut și încearcă din nou." }, cancellationToken));
    options.AddPolicy(AdminAuthController.LoginRateLimitPolicy, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(1) }));
});

// Images uploaded from the admin dashboard. In Docker this folder is a volume (see docker-compose.yml).
var uploadsRoot = builder.Configuration["Uploads:Path"];
if (string.IsNullOrWhiteSpace(uploadsRoot))
    uploadsRoot = Path.Combine(builder.Environment.ContentRootPath, "uploads");
builder.Services.AddSingleton(new UploadStorage(uploadsRoot));


// Configure Database (Dual-Provider: PostgreSQL when configured, SQLite fallback)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Data Source=asimbv.db";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase) ||
        connectionString.Contains("Server=", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

// Configure CORS: only the origins listed in "Cors:AllowedOrigins" may call the API.
// Set per environment in appsettings*.json or via env var Cors__AllowedOrigins__0, __1, ...
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()?
    .Select(o => o.Trim().TrimEnd('/'))
    .Where(o => o.Length > 0)
    .ToArray() ?? Array.Empty<string>();

if (allowedOrigins.Length == 0)
{
    Console.WriteLine("[CORS] No allowed origins configured (Cors:AllowedOrigins): all cross-origin requests will be rejected.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")
              .WithHeaders("Content-Type", "Authorization");
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ensure the database and all tables exist
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Create DB + seed data if it doesn't exist at all
    dbContext.Database.EnsureCreated();
    DataSyncMarkers.EnsureTable(dbContext);

    // EnsureCreated() never alters an existing table, so add the LongDescription column
    // to Postgres databases created before it existed.
    if (dbContext.Database.IsNpgsql())
    {
        try
        {
            dbContext.Database.ExecuteSqlRaw(
                "ALTER TABLE \"Events\" ADD COLUMN IF NOT EXISTS \"LongDescription\" text;");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Database Migration Notice] {ex.Message}");
        }
    }

    // SQLite fallback tables if DB was created before these models existed
    if (dbContext.Database.IsSqlite())
    {
        // The data fix-ups below used to run on every startup and would undo admin edits
        // (e.g. delete any event titled "...Feedback..."), so they now run once per database.
        const string legacyFixesMarker = "legacy-sqlite-fixes-v1";
        var legacyFixesApplied = DataSyncMarkers.IsApplied(dbContext, legacyFixesMarker);

        dbContext.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS NewsletterSubscribers (
                Id                INTEGER PRIMARY KEY AUTOINCREMENT,
                Email             TEXT NOT NULL DEFAULT '',
                Name              TEXT NOT NULL DEFAULT '',
                IsActive          INTEGER NOT NULL DEFAULT 1,
                SubscribedAt      TEXT NOT NULL DEFAULT '',
                UnsubscribedAt    TEXT,
                UnsubscribeToken  TEXT NOT NULL DEFAULT ''
            )");

        dbContext.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ContactMessages (
                Id          INTEGER PRIMARY KEY AUTOINCREMENT,
                Name        TEXT NOT NULL DEFAULT '',
                Email       TEXT NOT NULL DEFAULT '',
                Subject     TEXT NOT NULL DEFAULT '',
                Message     TEXT NOT NULL DEFAULT '',
                CreatedAt   TEXT NOT NULL DEFAULT ''
            )");

        try
        {
            using var connection = dbContext.Database.GetDbConnection();
            connection.Open();
            
            // --- Check existing columns in Events table ---
            using var pragmaCmd = connection.CreateCommand();
            pragmaCmd.CommandText = "PRAGMA table_info(Events);";
            using var reader = pragmaCmd.ExecuteReader();
            bool hasFormUrl = false;
            bool hasImages = false;
            bool hasLongDescription = false;
            while (reader.Read())
            {
                var colName = reader["name"]?.ToString();
                if (string.Equals(colName, "FormUrl", StringComparison.OrdinalIgnoreCase))
                    hasFormUrl = true;
                if (string.Equals(colName, "Images", StringComparison.OrdinalIgnoreCase))
                    hasImages = true;
                if (string.Equals(colName, "LongDescription", StringComparison.OrdinalIgnoreCase))
                    hasLongDescription = true;
            }
            reader.Close();

            // --- Add FormUrl column if missing ---
            if (!hasFormUrl)
            {
                using var alterCmd = connection.CreateCommand();
                alterCmd.CommandText = "ALTER TABLE Events ADD COLUMN FormUrl TEXT;";
                alterCmd.ExecuteNonQuery();
            }

            // --- Add Images column if missing ---
            if (!hasImages)
            {
                using var alterImagesCmd = connection.CreateCommand();
                alterImagesCmd.CommandText = "ALTER TABLE Events ADD COLUMN Images TEXT;";
                alterImagesCmd.ExecuteNonQuery();
            }

            // --- Add LongDescription column if missing ---
            if (!hasLongDescription)
            {
                using var alterLongCmd = connection.CreateCommand();
                alterLongCmd.CommandText = "ALTER TABLE Events ADD COLUMN LongDescription TEXT;";
                alterLongCmd.ExecuteNonQuery();
            }

            if (!legacyFixesApplied)
            {
                // --- Ensure CNDOS FormUrl is set ---
                using var updateFormUrlCmd = connection.CreateCommand();
                updateFormUrlCmd.CommandText = @"
                    UPDATE Events 
                    SET FormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfCEd2yubl7p6Zh-fH2nwbRa0A2lX3ecQldH_Kiq-fvC-mdgw/viewform?utm_source=ig&utm_medium=social&utm_content=link_in_bio'
                    WHERE (Title LIKE '%CNDOS%' OR Id = 12) AND (FormUrl IS NULL OR FormUrl = '');";
                updateFormUrlCmd.ExecuteNonQuery();

                // --- Remove Recrutări and Feedback Profesori events ---
                using var deleteCmd = connection.CreateCommand();
                deleteCmd.CommandText = "DELETE FROM Events WHERE Id IN (3, 5) OR Title LIKE '%Recrut%' OR Title LIKE '%Feedback%';";
                deleteCmd.ExecuteNonQuery();

                // --- Populate Images for all events (only where Images is NULL or empty) ---
                var imageUpdates = new Dictionary<int, string>
                {
                    [1]  = "[\"/poze_evenimente/Infiintare_ASIMBV.png\"]",
                    [2]  = "[\"/poze_evenimente/Student_Login_2025/img1.png\",\"/poze_evenimente/Student_Login_2025/img2.png\",\"/poze_evenimente/Student_Login_2025/img3.png\",\"/poze_evenimente/Student_Login_2025/img4.png\"]",
                    [4]  = "[\"/poze_evenimente/Afiliere_Uniunea_Studenților_din_România_UNI/img1.png\",\"/poze_evenimente/Afiliere_Uniunea_Studenților_din_România_UNI/img2.png\"]",
                    [6]  = "[\"/poze_evenimente/Promovare_targ_practica_anul_II/img1.png\",\"/poze_evenimente/Promovare_targ_practica_anul_II/img2.png\",\"/poze_evenimente/Promovare_targ_practica_anul_II/img3.png\"]",
                    [7]  = "[\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img1.png\",\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img2.png\",\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img3.png\",\"/poze_evenimente/voluntariat_Hackathon_Transilvania_Codestorm@MI/img4.png\"]",
                    [8]  = "[\"/poze_evenimente/workshop_asimbv_best/img1.png\"]",
                    [9]  = "[\"/poze_evenimente/AG_UNI_Bucuresti/img1.png\",\"/poze_evenimente/AG_UNI_Bucuresti/img2.png\"]",
                    [10] = "[\"/poze_evenimente/voluntariat_Zilele_UNI_x_ASIMBv_x_ASSM/img1.png\",\"/poze_evenimente/voluntariat_Zilele_UNI_x_ASIMBv_x_ASSM/img2.png\"]",
                    [11] = "[\"/poze_evenimente/bootcamp_uni_centru_vest/img1.png\",\"/poze_evenimente/bootcamp_uni_centru_vest/img2.png\"]",
                    [13] = "[\"/poze_evenimente/AG_UNI_Alba_Iulia/img1.png\"]",
                    [14] = "[\"/poze_evenimente/Student_Login_2026/img2.png\",\"/poze_evenimente/Student_Login_2026/img3.png\"]",
                };

                foreach (var (id, images) in imageUpdates)
                {
                    using var imgCmd = connection.CreateCommand();
                    imgCmd.CommandText = $"UPDATE Events SET Images = '{images.Replace("'", "''")}' WHERE Id = {id} AND (Images IS NULL OR Images = '');";
                    imgCmd.ExecuteNonQuery();
                }

                DataSyncMarkers.MarkApplied(dbContext, legacyFixesMarker);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Database Migration Notice] {ex.Message}");
        }
    }
}

// Approved event texts + the newer events, written in one transaction (see EventContentSync).
// A fresh scope/context is used so it never shares the connection of the raw SQLite steps above.
using (var syncScope = app.Services.CreateScope())
{
    var syncDb = syncScope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Columns added after the tables were first created (message status, English event texts).
    SchemaUpgrade.Apply(syncDb);
    EventContentSync.Apply(syncDb);
    PartnerSync.Apply(syncDb);

    // EnsureCreated() never alters an existing table, so add the unique email index to databases
    // created before it existed. This fails if duplicate emails are already stored: the site keeps
    // working without the index until those rows are cleaned up and the backend is restarted.
    try
    {
        syncDb.Database.ExecuteSqlRaw(
            "CREATE UNIQUE INDEX IF NOT EXISTS \"IX_NewsletterSubscribers_Email\" ON \"NewsletterSubscribers\" (\"Email\");");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database Migration Notice] Could not add the unique newsletter email index, duplicate emails may exist: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseRateLimiter();

app.UseHttpsRedirection();

// Serves the uploaded images under /api/uploads/..., next to the API so the same proxy reaches both.
var uploadStorage = app.Services.GetRequiredService<UploadStorage>();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadStorage.RootPath),
    RequestPath = UploadStorage.RequestPath,
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        // File names are unique per upload, so a file never changes once written.
        ctx.Context.Response.Headers.CacheControl = "public, max-age=31536000, immutable";
    }
});

app.UseAuthorization();

app.MapControllers();

app.Run();
