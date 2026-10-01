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
        
        using var pragmaCmd = connection.CreateCommand();
        pragmaCmd.CommandText = "PRAGMA table_info(Events);";
        using var reader = pragmaCmd.ExecuteReader();
        bool hasFormUrl = false;
        while (reader.Read())
        {
            var colName = reader["name"]?.ToString();
            if (string.Equals(colName, "FormUrl", StringComparison.OrdinalIgnoreCase))
            {
                hasFormUrl = true;
                break;
            }
        }
        reader.Close();

        if (!hasFormUrl)
        {
            using var alterCmd = connection.CreateCommand();
            alterCmd.CommandText = "ALTER TABLE Events ADD COLUMN FormUrl TEXT;";
            alterCmd.ExecuteNonQuery();
        }

        using var updateCmd = connection.CreateCommand();
        updateCmd.CommandText = @"
            UPDATE Events 
            SET FormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfCEd2yubl7p6Zh-fH2nwbRa0A2lX3ecQldH_Kiq-fvC-mdgw/viewform?utm_source=ig&utm_medium=social&utm_content=link_in_bio'
            WHERE (Title LIKE '%CNDOS%' OR Id = 12) AND (FormUrl IS NULL OR FormUrl = '');";
        updateCmd.ExecuteNonQuery();
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
