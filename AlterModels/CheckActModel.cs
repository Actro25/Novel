using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class CheckActModel
    {
        public ActsModel Act { get; set; } = new ActsModel();
        public bool StartActOrEnd { get; set; } = true; // true for start, false for end
    }
}
