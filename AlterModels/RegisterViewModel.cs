using System.ComponentModel.DataAnnotations;

namespace NovelProject.AlterModels
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Вкажіть ім’я")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Вкажіть Email")]
        [EmailAddress(ErrorMessage = "Некоректний Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Вкажіть пароль")]
        [DataType(DataType.Password)]
        [MinLength(6, ErrorMessage = "Пароль повинен містити щонайменше 6 символів")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Підтвердіть пароль")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Паролі не співпадають")]
        public string ConfirmPassword { get; set; }
    }
}
