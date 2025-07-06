namespace NovelProject.Models
{
    public class AchivmentsModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconPath { get; set; } = string.Empty;
        public int SceneId { get; set; }
    }
}
