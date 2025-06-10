namespace NovelProject.Models
{
    public class PartsModel
    {
        public int id {  get; set; }
        public string name { get; set; } = string.Empty;
        public string start_part_text { get; set; } = string.Empty;
        public string end_part_text { get; set; } = string.Empty;
        public int start_scene_id { get; set; }
        public int end_scene_id { get; set; }
    }
}
