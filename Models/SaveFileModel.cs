namespace NovelProject.Models
{
    public class SaveFileModel
    {
        public int Id { get; set; }
        public string FirstSaveName { get; set; } = string.Empty;
        public int FirstSaveId { get; set; }
        public string SecondSaveName { get; set; } = string.Empty;
        public int SecondSaveId { get; set; }
        public string ThirdSaveName { get; set; } = string.Empty;
        public int ThirdSaveId { get; set; }
        public int UserId { get; set; }
    }
}
