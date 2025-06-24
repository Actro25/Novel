using System.ComponentModel.DataAnnotations;

namespace NovelProject.AlterModels
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Вкажіть Email")]
        [EmailAddress(ErrorMessage = "Некоректний Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Вкажіть пароль")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
