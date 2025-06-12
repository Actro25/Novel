using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class DetailSceneModel
    {
        public ScenesModel Scenes { get; set; }
        public List<AnswersModel> Answers { get; set; }
        public List<int> preview_scene_ids { get; set; } = new List<int>();
        public List<int> preview_answer_ids { get; set; } = new List<int>();
        public IFormFile? backgroundImage { get; set; } = null!;
        public SceneViewAllModel AllItems { get; set; }
        public List<string> BackgroundImagePaths { get; set; } = new();
        public List<string> PersonageImagePaths { get; set; } = new();
        public List<string> AdditionalImagePaths { get; set; } = new();
        public string? backgroundImagePath { get; set; } = string.Empty;
        public string? personageImagePath { get; set; } = string.Empty;
        public string? additionalImagePath { get; set; } = string.Empty;
    }
}
