using NovelProject.Models;

namespace NovelProject.AlterModels
{
    public class CreateActsModel
    {
        public ActsModel Act { get; set; } = new ActsModel();
        public List<ActsModel> AllActs { get; set; } = new List<ActsModel>();
    }
}
