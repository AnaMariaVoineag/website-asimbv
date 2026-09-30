using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();


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

    // SQLite fallback tables if DB was created before these models existed
    if (dbContext.Database.IsSqlite())
    {
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
