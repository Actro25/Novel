using Microsoft.AspNetCore.Mvc.ModelBinding;
using NovelProject.AlterModels;
using NovelProject.Models;

public class CreateSceneModel
{
    public ScenesModel Scenes { get; set; } = new ScenesModel();
    public List<AnswersModel> Answers { get; set; } = new List<AnswersModel>();
    public int partId { get; set; }
    public List<int> preview_scene_ids { get; set; } = new List<int>();
    public List<int> preview_answer_ids { get; set; } = new List<int>();
    public IFormFile? backgroundImage { get; set; }
    public List<string> BackgroundImagePaths { get; set; } = new();
    public List<string> PersonageImagePaths { get; set; } = new();
    public List<string> AdditionalImagePaths { get; set; } = new();
    public string? backgroundImagePath { get; set; } = string.Empty;
    public string? personageImagePath { get; set; } = string.Empty;
    public string? additionalImagePath { get; set; } = string.Empty;
    [BindNever]
    public SceneViewAllModel? AllItems { get; set; }
}
