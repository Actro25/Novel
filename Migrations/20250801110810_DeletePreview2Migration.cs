using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovelProject.Migrations
{
    /// <inheritdoc />
    public partial class DeletePreview2Migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsStartFromPartOrAct",
                table: "ManualSave");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsStartFromPartOrAct",
                table: "ManualSave",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
