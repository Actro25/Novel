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
        public DbSet<ActsModel> Acts { get; set; }

        public DbSet<UsersModel> Users { get; set; }

        public DbSet<SaveFileModel> SaveFile { get; set; }
        public DbSet<ManualSaveModel> ManualSave { get; set; }

        public DbSet<AchivmentsModel> Achivments { get; set; }
        public DbSet<UserAchivmentsModel> UserAchivments { get; set; }
    }
}
