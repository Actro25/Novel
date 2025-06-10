// Models/UserSettings.cs
namespace DreamGame.Models // Замініть на назву вашого проекту (наприклад, DreamGame.Models)
{
    public class UserSettings
    {
        public int Id { get; set; } // Унікальний ID для запису налаштувань. EF Core зробить його первинним ключем та Identity (автоінкрементним)
        public string Theme { get; set; } = "light"; // "light", "dark", "blue"
        public string Scale { get; set; } = "normal"; // "small", "normal", "large"
        public string Language { get; set; } = "ukrainian"; // "ukrainian", "russian", "english"
        // Можна додати інші налаштування, наприклад:
        // public int Volume { get; set; } = 50;
    }
}