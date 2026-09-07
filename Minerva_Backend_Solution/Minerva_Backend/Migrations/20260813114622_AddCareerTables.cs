using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minerva_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCareerTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CareerComparisons",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AttemptId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ComparisonResultJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareerComparisons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CareerMatches",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AttemptId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TopCareersJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareerMatches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Careers",
                columns: table => new
                {
                    CareerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CareerName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequiredSkillsJson = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Careers", x => x.CareerId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CareerComparisons");

            migrationBuilder.DropTable(
                name: "CareerMatches");

            migrationBuilder.DropTable(
                name: "Careers");
        }
    }
}
