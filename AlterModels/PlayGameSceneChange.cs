using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class PlayGameSceneChange
    {
        public ScenesModel CurrentScene { get; set; } = new ScenesModel();
        public int actId { get; set; }
        public bool StartPart { get; set; }
    }
}
