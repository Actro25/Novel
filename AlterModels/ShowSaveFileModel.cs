namespace NovelProject.AlterModels
{
    public class ShowSaveFileModel
    {
        public string FileName { get; set; } = "";

        public int SceneId { get; set; }
        public string SceneFirstText { get; set; } = "";

        public int ActId { get; set; }
        public string ActName { get; set; } = "";

        public int PartId { get; set; }
        public string PartName { get; set; } = "";
    }
}
