using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NovelProject.AlterModels;
using NovelProject.Data;
using System.Security.Claims;

namespace NovelProject.Controllers
{
    public class LoginController : Controller
    {
        private readonly PasswordHasher<string> _passwordHasher = new PasswordHasher<string>();
        private readonly ILogger<LoginController> _logger;
        private readonly AppDbContext _context;
        public LoginController(ILogger<LoginController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }
        public IActionResult Index()
        {
            var model = new AuthViewModel();
            return View(model);
        }
        [HttpPost]
        public async Task<IActionResult> LoginUser(LoginViewModel model) 
        {
            if (!ModelState.IsValid)
            {
                return View("Index", new AuthViewModel { Login = model });
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user == null)
            {
                ModelState.AddModelError("Email", "User not found.");
                return View("Index", new AuthViewModel { Login = model });
            }

            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(null, user.PasswordHash, model.Password);
            if ( passwordVerificationResult == PasswordVerificationResult.Success || passwordVerificationResult == PasswordVerificationResult.SuccessRehashNeeded)
            {
                var claim = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Email, user.Email)
                };

                var identity = new ClaimsIdentity(claim, CookieAuthenticationDefaults.AuthenticationScheme);
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                return RedirectToAction("Index", "Home", new { claims = claim });
            }
            else
            {
                ModelState.AddModelError("Password", "Incorrect password.");
                return View("Index", new AuthViewModel { Login = model });
            }
        }
        [HttpPost]
        public IActionResult RegisterUser(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("Index", new AuthViewModel { Register = model, ShowRegisterForm = true });
            }

            var nameExists = _context.Users.Any(u => u.FullName == model.Name);
            if (nameExists)
            {
                ModelState.AddModelError("Name", "This name already exists.");
                return View("Index", new AuthViewModel { Register = model, ShowRegisterForm = true });
            }

            var userExists = _context.Users.Any(u => u.Email == model.Email);
            if (userExists)
            {
                ModelState.AddModelError("Email", "Email already exists.");
                return View("Index", new AuthViewModel { Register = model, ShowRegisterForm = true });
            }

            var user = new Models.UsersModel
            {
                FullName = model.Name,
                Email = model.Email,
                PasswordHash = _passwordHasher.HashPassword(null, model.Password)
            };
            _context.Users.Add(user);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
        public async Task Login()
        {
            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            var claim = result.Principal.Identities.FirstOrDefault().Claims.Select(claim => new {
                claim.Issuer,
                claim.OriginalIssuer,
                claim.Type,
                claim.Value
            });

            return RedirectToAction("Index", "Home", new { claims = claim });
        }
        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index");
        }
    }
}
