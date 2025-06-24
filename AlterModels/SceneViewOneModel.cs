using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class SceneViewOneModel
    {
        public ScenesModel Scene { get; set; }
        public List<AnswersModel> Answers { get; set; } = new();
        public PartsModel Parts { get; set; }

        public List<ScenesModel> AllScenes { get; set; } = new();
        public List<PartsModel> AllParts { get; set; } = new();
    }
}
