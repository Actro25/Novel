using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovelProject.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Acts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    StartActText = table.Column<string>(type: "TEXT", nullable: false),
                    EndActText = table.Column<string>(type: "TEXT", nullable: false),
                    StartPartId = table.Column<int>(type: "INTEGER", nullable: false),
                    EndPartId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Acts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    asnwer_for_scene = table.Column<string>(type: "TEXT", nullable: false),
                    next_scene_id = table.Column<int>(type: "INTEGER", nullable: false),
                    id_scene = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answers", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Parts",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    act_id = table.Column<int>(type: "INTEGER", nullable: false),
                    name = table.Column<string>(type: "TEXT", nullable: false),
                    start_part_text = table.Column<string>(type: "TEXT", nullable: false),
                    end_part_text = table.Column<string>(type: "TEXT", nullable: false),
                    start_scene_id = table.Column<int>(type: "INTEGER", nullable: false),
                    end_scene_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parts", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Scenes",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    id_next_scene = table.Column<int>(type: "INTEGER", nullable: false),
                    text_scene = table.Column<string>(type: "TEXT", nullable: true),
                    answer = table.Column<bool>(type: "INTEGER", nullable: false),
                    background_scene_img = table.Column<string>(type: "TEXT", nullable: false),
                    personage_scene_img = table.Column<string>(type: "TEXT", nullable: false),
                    additional_scene_img = table.Column<string>(type: "TEXT", nullable: false),
                    id_part = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scenes", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Acts");

            migrationBuilder.DropTable(
                name: "Answers");

            migrationBuilder.DropTable(
                name: "Parts");

            migrationBuilder.DropTable(
                name: "Scenes");
        }
    }
}
