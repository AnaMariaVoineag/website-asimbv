using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

/// <summary>
/// Records which one-time data syncs (seed content, legacy fix-ups) have already run on this database.
/// The syncs used to run on every startup, which silently undid edits made from the admin dashboard
/// (texts overwritten, deleted events and partners coming back). Now each runs once per database.
/// To ship NEW seed content later, give it a new marker name (e.g. "event-content-v2").
/// </summary>
public static class DataSyncMarkers
{
    // Same SQL on PostgreSQL and SQLite.
    public static void EnsureTable(AppDbContext db) =>
        db.Database.ExecuteSqlRaw(
            "CREATE TABLE IF NOT EXISTS \"DataSyncMarkers\" (\"Name\" text NOT NULL PRIMARY KEY, \"AppliedAt\" text NOT NULL);");

    public static bool IsApplied(AppDbContext db, string name) =>
        db.Database
            .SqlQuery<long>($"SELECT COUNT(*) AS \"Value\" FROM \"DataSyncMarkers\" WHERE \"Name\" = {name}")
            .AsEnumerable()
            .First() > 0;

    public static void MarkApplied(AppDbContext db, string name)
    {
        var appliedAt = DateTime.UtcNow.ToString("O");
        db.Database.ExecuteSql(
            $"INSERT INTO \"DataSyncMarkers\" (\"Name\", \"AppliedAt\") VALUES ({name}, {appliedAt})");
    }
}
