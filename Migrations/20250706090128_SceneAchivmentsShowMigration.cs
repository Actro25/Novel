using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovelProject.Migrations
{
    /// <inheritdoc />
    public partial class SceneAchivmentsShowMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ScenesModelid",
                table: "Achivments",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Achivments_ScenesModelid",
                table: "Achivments",
                column: "ScenesModelid");

            migrationBuilder.AddForeignKey(
                name: "FK_Achivments_Scenes_ScenesModelid",
                table: "Achivments",
                column: "ScenesModelid",
                principalTable: "Scenes",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Achivments_Scenes_ScenesModelid",
                table: "Achivments");

            migrationBuilder.DropIndex(
                name: "IX_Achivments_ScenesModelid",
                table: "Achivments");

            migrationBuilder.DropColumn(
                name: "ScenesModelid",
                table: "Achivments");
        }
    }
}
