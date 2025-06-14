namespace NovelProject.Models
{
    public class ActsModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string StartActText { get; set; } = string.Empty;
        public string EndActText { get; set; } = string.Empty;
        public int StartPartId { get; set; }
        public int EndPartId { get; set; }

    }
}
