using System.ComponentModel.DataAnnotations;

namespace NovelProject.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Ім’я є обов’язковим")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email є обов’язковим")]
        [EmailAddress(ErrorMessage = "Некоректний Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Пароль є обов’язковим")]
        public string PasswordHash { get; set; }

        // Необов'язкове поле — ігровий нікнейм
        public string? GameNickname { get; set; }
    }
}
