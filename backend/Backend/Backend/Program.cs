using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();


// Configure SQLite Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
                      ?? "Data Source=asimbv.db"));

// Configure CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
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

    // CREATE TABLE IF NOT EXISTS for any tables added after initial DB creation.
    // EnsureCreated is a no-op on an existing DB, so we handle new tables explicitly.
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
        while (reader.Read())
        {
            var colName = reader["name"]?.ToString();
            if (string.Equals(colName, "FormUrl", StringComparison.OrdinalIgnoreCase))
                hasFormUrl = true;
            if (string.Equals(colName, "Images", StringComparison.OrdinalIgnoreCase))
                hasImages = true;
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
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database Migration Notice] {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
