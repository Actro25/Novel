using Microsoft.EntityFrameworkCore;
using NovelProject.Models;

namespace NovelProject.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ScenesModel> Scenes { get; set; }
        public DbSet<AnswersModel> Answers { get; set; }
        public DbSet<PartsModel> Parts { get; set; }
    }
}
