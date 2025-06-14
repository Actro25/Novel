using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class CheckPartModel
    {
        public PartsModel Part { get; set; } = new PartsModel();
        public bool StartPartOrEnd { get; set; } = true;
    }
}
