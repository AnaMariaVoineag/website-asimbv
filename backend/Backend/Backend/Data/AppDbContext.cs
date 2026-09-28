using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<EventItem> Events => Set<EventItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<EventItem>().HasData(
            new EventItem
            {
                Id = 1,
                Date = "6 octombrie 2024",
                Title = "Înființare ASIMBv",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 2,
                Date = "1 octombrie 2025",
                Title = "Student Login",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 3,
                Date = "3-10 noiembrie 2025",
                Title = "Recrutări",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 4,
                Date = "28 noiembrie 2025",
                Title = "Afiliere Uniunea Studenților din România UNI",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 5,
                Date = "Decembrie 2025",
                Title = "Campanie feedback profesori",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 6,
                Date = "3 Martie 2026",
                Title = "Promovare Târg Practică Anul II",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 7,
                Date = "24-25 aprilie 2026",
                Title = "Voluntariat Hackathon Transilvania Codestorm@MI",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 8,
                Date = "21 mai 2026",
                Title = "Workshop ASIMBv x BEST Brașov",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 9,
                Date = "21-24 mai 2026",
                Title = "AG UNI București",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 10,
                Date = "17-19 iulie 2026",
                Title = "Voluntariat Zilele UNI x ASIMBv x ASSM",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 11,
                Date = "21-23 August 2026",
                Title = "Bootcamp teamwork & leadership UNI Zona Centru-Nord",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 12,
                Date = "Septembrie 2026",
                Title = "Promovare CNDOS",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 13,
                Date = "10-13 Septembrie 2026",
                Title = "AG UNI Alba Iulia",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            },
            new EventItem
            {
                Id = 14,
                Date = "1 octombrie 2026",
                Title = "Student Login",
                Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            }
        );
    }
}
