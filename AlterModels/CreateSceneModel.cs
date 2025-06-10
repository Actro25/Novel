using Microsoft.AspNetCore.Mvc.ModelBinding;
using NovelProject.AlterModels;
using NovelProject.Models;

public class CreateSceneModel
{
    public ScenesModel Scenes { get; set; } = new ScenesModel();
    public List<AnswersModel> Answers { get; set; } = new List<AnswersModel>();
    public int partId { get; set; }
    public int preview_scene { get; set; }
    public IFormFile? backgroundImage { get; set; }

    [BindNever]
    public SceneViewAllModel? AllItems { get; set; }
}
