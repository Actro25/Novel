namespace NovelProject.Models
{
    public class AnswersModel
    {
        public int id { get; set; }
        public string asnwer_for_scene { get; set; } = string.Empty;
        public int next_scene_id { get; set; }
        public int id_scene { get; set; }
    }
}
