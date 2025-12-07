using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovelProject.Migrations
{
    /// <inheritdoc />
    public partial class SaveFile2Migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SaveFile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstSaveName = table.Column<string>(type: "TEXT", nullable: false),
                    FirstSaveId = table.Column<int>(type: "INTEGER", nullable: false),
                    SecondSaveName = table.Column<string>(type: "TEXT", nullable: false),
                    SecondSaveId = table.Column<int>(type: "INTEGER", nullable: false),
                    ThirdSaveName = table.Column<string>(type: "TEXT", nullable: false),
                    ThirdSaveId = table.Column<int>(type: "INTEGER", nullable: false),
                    LastManualSaveId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaveFile", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SaveFile");
        }
    }
}
