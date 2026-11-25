using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

/// <summary>
/// EnsureCreated() never alters an existing table, so columns added to the models after a database
/// was created are added here, on both providers. Safe to run on every startup.
/// </summary>
public static class SchemaUpgrade
{
    private static readonly (string Table, string Column, string PostgresType, string SqliteType)[] Columns =
    [
        ("ContactMessages", "IsRead",            "boolean NOT NULL DEFAULT false", "INTEGER NOT NULL DEFAULT 0"),
        ("ContactMessages", "IsArchived",        "boolean NOT NULL DEFAULT false", "INTEGER NOT NULL DEFAULT 0"),
        ("ContactMessages", "Notes",             "text",                           "TEXT"),
        ("Events",          "TitleEn",           "text",                           "TEXT"),
        ("Events",          "DescriptionEn",     "text",                           "TEXT"),
        ("Events",          "LongDescriptionEn", "text",                           "TEXT"),
        ("Partners",        "Label",             "text",                           "TEXT"),
        ("Partners",        "LabelEn",           "text",                           "TEXT"),
    ];

    public static void Apply(AppDbContext db)
    {
        foreach (var (table, column, postgresType, sqliteType) in Columns)
        {
            try
            {
                // Table and column names are the constants above, never user input.
                if (db.Database.IsNpgsql())
                {
#pragma warning disable EF1002
                    db.Database.ExecuteSqlRaw(
                        $"ALTER TABLE \"{table}\" ADD COLUMN IF NOT EXISTS \"{column}\" {postgresType};");
                }
                else if (db.Database.IsSqlite())
                {
                    var exists = db.Database
                        .SqlQuery<string>($"SELECT name AS \"Value\" FROM pragma_table_info({table})")
                        .AsEnumerable()
                        .Any(name => string.Equals(name, column, StringComparison.OrdinalIgnoreCase));

                    if (!exists)
                        db.Database.ExecuteSqlRaw($"ALTER TABLE \"{table}\" ADD COLUMN \"{column}\" {sqliteType};");
#pragma warning restore EF1002
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Schema Upgrade] Could not add {table}.{column}: {ex.Message}");
            }
        }
    }
}
