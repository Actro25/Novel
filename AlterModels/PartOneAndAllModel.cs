using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class PartOneAndAllModel
    {
        public PartsModel Parts { get; set; }
        public List<PartsModel> AllParts { get; set; } = new();
    }
}
