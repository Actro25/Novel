namespace NovelProject.Models
{
    public class ScenesModel
    {
        public int id { get; set; }
        public int id_next_scene { get; set; }
        public string text_scene { get; set; } = string.Empty;
        public bool answer { get; set; }
        public required string background_scene_img { get; set; }
        public int id_part { get; set; }
    }
}
