using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class SceneViewAllModel
    {
        public List<ScenesModel> Scene { get; set; } = new List<ScenesModel>();
        public List<AnswersModel> Answers { get; set; } = new List<AnswersModel>();
        public List<PartsModel> Parts { get; set; } = new List<PartsModel>();
        public List<ActsModel> Acts { get; set; } = new List<ActsModel>();
    }
}
