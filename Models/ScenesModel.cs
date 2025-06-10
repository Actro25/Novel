using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace NovelProject.Models
{
    public class ScenesModel
    {
        public int id { get; set; }
        public int id_next_scene { get; set; }
        public string? text_scene { get; set; } = string.Empty;
        public bool answer { get; set; }
        [BindNever]
        public string background_scene_img { get; set; } = string.Empty;
        public int id_part { get; set; }
    }
}
