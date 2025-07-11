namespace NovelProject.Models
{
    public class ManualSaveModel
    {
        public int id { get; set; }
        public int SaveFileId { get; set; }
        public int SceneId { get; set; }
        public int PartId { get; set; }
        public int ActId { get; set; }
        public bool IsStart { get; set; }
        public bool IsSaveFromScene { get; set; }
        public bool IsSaveFromPart { get; set; }
        public bool IsSaveFromAct { get; set; }
    }
}
