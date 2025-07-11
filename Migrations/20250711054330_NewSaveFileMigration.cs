using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovelProject.Migrations
{
    /// <inheritdoc />
    public partial class NewSaveFileMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastManualSaveId",
                table: "SaveFile");

            migrationBuilder.CreateTable(
                name: "ManualSave",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SaveFileId = table.Column<int>(type: "INTEGER", nullable: false),
                    SceneId = table.Column<int>(type: "INTEGER", nullable: false),
                    PartId = table.Column<int>(type: "INTEGER", nullable: false),
                    ActId = table.Column<int>(type: "INTEGER", nullable: false),
                    IsStart = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsSaveFromScene = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsSaveFromPart = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsSaveFromAct = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManualSave", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ManualSave");

            migrationBuilder.AddColumn<int>(
                name: "LastManualSaveId",
                table: "SaveFile",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
