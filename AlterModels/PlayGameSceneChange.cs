using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class PlayGameSceneChange
    {
        public ScenesModel CurrentScene { get; set; } = new ScenesModel();
        public int actId { get; set; }
        public bool StartPart { get; set; }

        public bool EndOfPartReached { get; set; } 
        public int NextSceneId { get; set; }
        public int NextPartId { get; set; }
        public List<AchivmentsModel> Achivments { get; set; } = new List<AchivmentsModel>();
        public SaveFileModel SaveFile { get; set; } = new SaveFileModel();
    }
}
