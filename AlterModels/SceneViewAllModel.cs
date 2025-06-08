using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class SceneViewAllModel
    {
        public List<ScenesModel> Scene { get; set; }
        public List<AnswersModel> Answers { get; set; }
        public List<PartsModel> Parts { get; set; }
    }
}
