using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "event_categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_event_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "members",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    last_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    faculty = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    year_of_study = table.Column<short>(type: "smallint", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_members", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    hierarchy_level = table.Column<short>(type: "smallint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sponsors",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    company_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    logo_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    contact_person = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    contact_email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    contact_phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sponsors", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "events",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    start_datetime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_datetime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    location = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    category_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    is_published = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_events", x => x.id);
                    table.ForeignKey(
                        name: "FK_events_event_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "event_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_events_members_created_by",
                        column: x => x.created_by,
                        principalTable: "members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "member_roles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    member_id = table.Column<Guid>(type: "uuid", nullable: false),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false),
                    assigned_by = table.Column<Guid>(type: "uuid", nullable: true),
                    valid_from = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    valid_until = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_member_roles", x => x.id);
                    table.ForeignKey(
                        name: "FK_member_roles_members_assigned_by",
                        column: x => x.assigned_by,
                        principalTable: "members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_member_roles_members_member_id",
                        column: x => x.member_id,
                        principalTable: "members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_member_roles_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "event_participants",
                columns: table => new
                {
                    event_id = table.Column<Guid>(type: "uuid", nullable: false),
                    member_id = table.Column<Guid>(type: "uuid", nullable: false),
                    role_at_event = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    attendance_status = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    registered_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_event_participants", x => new { x.event_id, x.member_id });
                    table.ForeignKey(
                        name: "FK_event_participants_events_event_id",
                        column: x => x.event_id,
                        principalTable: "events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_event_participants_members_member_id",
                        column: x => x.member_id,
                        principalTable: "members",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "event_sponsors",
                columns: table => new
                {
                    event_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sponsor_id = table.Column<Guid>(type: "uuid", nullable: false),
                    contribution_desc = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_event_sponsors", x => new { x.event_id, x.sponsor_id });
                    table.ForeignKey(
                        name: "FK_event_sponsors_events_event_id",
                        column: x => x.event_id,
                        principalTable: "events",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_event_sponsors_sponsors_sponsor_id",
                        column: x => x.sponsor_id,
                        principalTable: "sponsors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "event_categories",
                columns: new[] { "id", "created_at", "description", "name" },
                values: new object[,]
                {
                    { new Guid("26fe6790-2580-4cf7-9a4d-ef048fa562b3"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Hackathon" },
                    { new Guid("4fa5789a-ec22-4911-adcf-8d96eefb8ef1"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Parteneriat" },
                    { new Guid("9356b690-e5bf-4d8a-92a0-0081d77a83d7"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Social" },
                    { new Guid("bc8adbf0-89ef-4bf8-b6ec-4f7f2b1d3d6e"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Training" },
                    { new Guid("f2efd6d2-b054-49c0-9cf4-fa5f6c8d76ee"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Adunare Generala" }
                });

            migrationBuilder.InsertData(
                table: "events",
                columns: new[] { "id", "category_id", "created_at", "created_by", "description", "end_datetime", "is_published", "location", "start_datetime", "title", "updated_at" },
                values: new object[] { new Guid("5e89d2d0-1b77-4b68-8094-1bc2d8612140"), null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, null, true, null, new DateTime(2025, 10, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Student Login", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "created_at", "description", "hierarchy_level", "name" },
                values: new object[,]
                {
                    { new Guid("21e15b3c-62b9-44ff-89d7-8ab0769cfcb5"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, (short)4, "Trezorier" },
                    { new Guid("7e01b7a2-f8b1-4f19-9cf3-94c6f50519f7"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, (short)2, "Vicepresedinte" },
                    { new Guid("8a1df16f-16b7-4a11-8e54-469b61ef2630"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, (short)1, "Presedinte" },
                    { new Guid("8e6c464e-0cfa-4cf7-8097-7f55a1d7f6e4"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, (short)5, "Membru" },
                    { new Guid("954bf4d2-d7b0-449e-ba78-ef0156ccdf56"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, (short)3, "Secretar" }
                });

            migrationBuilder.InsertData(
                table: "events",
                columns: new[] { "id", "category_id", "created_at", "created_by", "description", "end_datetime", "is_published", "location", "start_datetime", "title", "updated_at" },
                values: new object[,]
                {
                    { new Guid("90b1c2b5-e6a8-4221-a3f2-ef9cd0b6fa81"), new Guid("f2efd6d2-b054-49c0-9cf4-fa5f6c8d76ee"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, null, true, null, new DateTime(2025, 11, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Adunare Generala in cadrul USR", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("d9df11c4-118e-4a6c-9c3f-ee9c6fd8b6b2"), new Guid("26fe6790-2580-4cf7-9a4d-ef048fa562b3"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, null, true, null, new DateTime(2026, 4, 24, 0, 0, 0, 0, DateTimeKind.Utc), "Hackaton Codestorm MI", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_event_categories_name",
                table: "event_categories",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_event_participants_member_id",
                table: "event_participants",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_event_sponsors_sponsor_id",
                table: "event_sponsors",
                column: "sponsor_id");

            migrationBuilder.CreateIndex(
                name: "IX_events_category_id",
                table: "events",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_events_created_by",
                table: "events",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_member_roles_assigned_by",
                table: "member_roles",
                column: "assigned_by");

            migrationBuilder.CreateIndex(
                name: "IX_member_roles_member_id",
                table: "member_roles",
                column: "member_id");

            migrationBuilder.CreateIndex(
                name: "IX_member_roles_role_id",
                table: "member_roles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_members_email",
                table: "members",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_roles_hierarchy_level",
                table: "roles",
                column: "hierarchy_level",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_roles_name",
                table: "roles",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_sponsors_company_name",
                table: "sponsors",
                column: "company_name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "event_participants");

            migrationBuilder.DropTable(
                name: "event_sponsors");

            migrationBuilder.DropTable(
                name: "member_roles");

            migrationBuilder.DropTable(
                name: "events");

            migrationBuilder.DropTable(
                name: "sponsors");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "event_categories");

            migrationBuilder.DropTable(
                name: "members");
        }
    }
}
