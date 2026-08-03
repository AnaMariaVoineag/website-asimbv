using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Member> Members { get; set; } = null!;
    public DbSet<MemberRole> MemberRoles { get; set; } = null!;
    public DbSet<EventCategory> EventCategories { get; set; } = null!;
    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<EventParticipant> EventParticipants { get; set; } = null!;
    public DbSet<Sponsor> Sponsors { get; set; } = null!;
    public DbSet<EventSponsor> EventSponsors { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Roles
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasIndex(r => r.Name).IsUnique();
            entity.HasIndex(r => r.HierarchyLevel).IsUnique();
        });

        // 2. Members
        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasIndex(m => m.Email).IsUnique();
            entity.HasIndex(m => m.Phone).IsUnique();
        });

        // 3. Member Roles
        modelBuilder.Entity<MemberRole>(entity =>
        {
            // Relationship: MemberRoles -> Member
            entity.HasOne(mr => mr.Member)
                .WithMany(m => m.MemberRoles)
                .HasForeignKey(mr => mr.MemberId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relationship: MemberRoles -> Role
            entity.HasOne(mr => mr.Role)
                .WithMany(r => r.MemberRoles)
                .HasForeignKey(mr => mr.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship: MemberRoles -> Member (AssignedBy)
            entity.HasOne(mr => mr.AssignedBy)
                .WithMany(m => m.AssignedRoles)
                .HasForeignKey(mr => mr.AssignedById)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // 4. Event Categories
        modelBuilder.Entity<EventCategory>(entity =>
        {
            entity.HasIndex(ec => ec.Name).IsUnique();
        });

        // 5. Events
        modelBuilder.Entity<Event>(entity =>
        {
            // Relationship: Event -> EventCategory
            entity.HasOne(e => e.Category)
                .WithMany(ec => ec.Events)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Relationship: Event -> Member (Creator)
            entity.HasOne(e => e.Creator)
                .WithMany(m => m.CreatedEvents)
                .HasForeignKey(e => e.CreatedById)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // 6. Event participants
        modelBuilder.Entity<EventParticipant>(entity =>
        {
            entity.HasKey(ep => new { ep.EventId, ep.MemberId });

            entity.HasOne(ep => ep.Event)
                .WithMany(e => e.EventParticipants)
                .HasForeignKey(ep => ep.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ep => ep.Member)
                .WithMany(m => m.EventParticipants)
                .HasForeignKey(ep => ep.MemberId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 7. Sponsors
        modelBuilder.Entity<Sponsor>(entity =>
        {
            entity.HasIndex(s => s.CompanyName).IsUnique();
        });

        // 8. Event sponsors
        modelBuilder.Entity<EventSponsor>(entity =>
        {
            entity.HasKey(es => new { es.EventId, es.SponsorId });

            entity.HasOne(es => es.Event)
                .WithMany(e => e.EventSponsors)
                .HasForeignKey(es => es.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(es => es.Sponsor)
                .WithMany(s => s.EventSponsors)
                .HasForeignKey(es => es.SponsorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seeding Roles
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Presedinte", HierarchyLevel = 1, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Role { Id = 2, Name = "Vicepresedinte", HierarchyLevel = 2, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Role { Id = 3, Name = "Secretar", HierarchyLevel = 3, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Role { Id = 4, Name = "Trezorier", HierarchyLevel = 4, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Role { Id = 5, Name = "Membru", HierarchyLevel = 5, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        // Seeding Event Categories
        modelBuilder.Entity<EventCategory>().HasData(
            new EventCategory { Id = 1, Name = "Adunare Generala", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new EventCategory { Id = 2, Name = "Hackathon", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new EventCategory { Id = 3, Name = "Social", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new EventCategory { Id = 4, Name = "Training", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new EventCategory { Id = 5, Name = "Parteneriat", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        // Seeding Events
        modelBuilder.Entity<Event>().HasData(
            new Event 
            { 
                Id = 1, 
                Title = "Student Login", 
                StartDatetime = new DateTime(2025, 10, 1, 0, 0, 0, DateTimeKind.Utc), 
                CategoryId = 3, // Social
                IsPublished = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Event 
            { 
                Id = 2, 
                Title = "Adunare Generala in cadrul USR", 
                StartDatetime = new DateTime(2025, 11, 28, 0, 0, 0, DateTimeKind.Utc), 
                CategoryId = 1, // Adunare Generala
                IsPublished = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Event 
            { 
                Id = 3, 
                Title = "Hackaton Codestorm MI", 
                StartDatetime = new DateTime(2026, 4, 24, 0, 0, 0, DateTimeKind.Utc), 
                CategoryId = 2, // Hackathon
                IsPublished = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
