using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class MenuShowModel
    {
        public List<ShowSaveFileModel> SaveFiles { get; set; } = new List<ShowSaveFileModel>();
        public List<UserAchivmentsModel> UserAchivments { get; set; } = new List<UserAchivmentsModel>();
        public List<AchivmentsModel> AllAhivments { get; set; } = new List<AchivmentsModel>();
        public ManualSaveModel ManualSave { get; set; } = new ManualSaveModel();
        public bool IsHaveManualSave { get; set; } = false;
    }
}
