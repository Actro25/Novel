<<<<<<< HEAD
﻿namespace NovelProject.Models
=======
﻿using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace NovelProject.Models
>>>>>>> Vergil_Main
{
    public class ScenesModel
    {
        public int id { get; set; }
        public int id_next_scene { get; set; }
<<<<<<< HEAD
        public string text_scene { get; set; } = string.Empty;
        public bool answer { get; set; }
        public required string background_scene_img { get; set; }
=======
        public string? text_scene { get; set; } = string.Empty;
        public bool answer { get; set; }
        public string background_scene_img { get; set; } = string.Empty;
        public string personage_scene_img { get; set; } = string.Empty;
        public string additional_scene_img { get; set; } = string.Empty;
>>>>>>> Vergil_Main
        public int id_part { get; set; }
    }
}
