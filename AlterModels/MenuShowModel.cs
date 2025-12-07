using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class MenuShowModel
    {
        public List<ShowSaveFileModel> SaveFiles { get; set; } = new List<ShowSaveFileModel>();
        public List<UserAchivmentsModel> UserAchivments { get; set; } = new List<UserAchivmentsModel>();
        public ManualSaveModel ManualSave { get; set; } = new ManualSaveModel();
        public bool IsHaveManualSave { get; set; } = false;
        public int ProchentAchivments { get; set; } = 0;
        public AchivmentsShowModel AchivmentsShowModel { get; set; } = new AchivmentsShowModel();
        public int CatReputationPointe { get; set; } = 0;
    }
}
