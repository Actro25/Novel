using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class DetailSceneModel
    {
        public ScenesModel Scenes { get; set; }
        public List<AnswersModel> Answers { get; set; }
        public int preview_scene { get; set; }
        public IFormFile? backgroundImage { get; set; } = null!;
        public SceneViewAllModel AllItems { get; set; }
    }
}
