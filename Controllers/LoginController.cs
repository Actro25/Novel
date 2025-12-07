using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovelProject.AlterModels;
using NovelProject.Data;
using NovelProject.Models;
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
        public async Task UpdateAchivments(int userId)
        {
            var userAchivmentIds = await _context.UserAchivments
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AchivmentId)
                .ToListAsync();

            var missingAchivments = await _context.Achivments
                .Where(a => !userAchivmentIds.Contains(a.Id))
                .ToListAsync();

            foreach (var achivment in missingAchivments)
            {
                _context.UserAchivments.Add(new UserAchivmentsModel
                {
                    UserId = userId,
                    AchivmentId = achivment.Id,
                    IsAchieved = false
                });
            }

            await _context.SaveChangesAsync();
        }

        [HttpGet]
        public IActionResult LoginUser()
        {
            var model = new LoginViewModel();
            return View(model);
        }
        [HttpGet]
        public IActionResult RegisterUser()
        {
            var model = new RegisterViewModel();
            return View(model);
        }
        [HttpPost]
        public async Task<IActionResult> LoginUser(LoginViewModel model) 
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user == null)
            {
                ModelState.AddModelError("Email", "User not found.");
                return View(model);
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

                await UpdateAchivments(user.Id);



                return RedirectToAction("Index", "Home", new { claims = claim });
            }
            else
            {
                ModelState.AddModelError("Password", "Incorrect password.");
                return View(model);
            }
        }
        [HttpPost]
        public IActionResult RegisterUser(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var nameExists = _context.Users.Any(u => u.FullName == model.Name);
            if (nameExists)
            {
                ModelState.AddModelError("Name", "This name already exists.");
                return View(model);
            }

            var userExists = _context.Users.Any(u => u.Email == model.Email);
            if (userExists)
            {
                ModelState.AddModelError("Email", "Email already exists.");
                return View(model);
            }

            var user = new Models.UsersModel
            {
                FullName = model.Name,
                Email = model.Email,
                PasswordHash = _passwordHasher.HashPassword(null, model.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var allAchivments = _context.Achivments.ToList();
            if (allAchivments.Any())
            {
                foreach (var achivment in allAchivments)
                {
                    var userAchivment = new UserAchivmentsModel
                    {
                        UserId = user.Id,
                        AchivmentId = achivment.Id
                    };
                    _context.UserAchivments.Add(userAchivment);
                }
                _context.SaveChanges();
            }

            var newSaveFile = new SaveFileModel
            {
                UserId = user.Id,
                FirstSaveName = "None",
                FirstSaveId = 0,
                SecondSaveName = "None",
                SecondSaveId = 0,
                ThirdSaveName = "None",
                ThirdSaveId = 0,
            };
            _context.SaveFile.Add(newSaveFile);

            var reputation = new ReputationModel
            {
                UserId = user.Id,
                CatReputation = 0
            };
            _context.Reputation.Add(reputation);
            _context.SaveChanges();

            return RedirectToAction("LoginUser");
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
            var claims = result.Principal.Claims;

            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return RedirectToAction("LoginUser");
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                user = new UsersModel
                {
                    FullName = name ?? "Google User",
                    Email = email,
                    PasswordHash = "[EXTERNAL]"
                };

                _context.Users.Add(user);
                _context.SaveChanges();

                var allAchivments = _context.Achivments.ToList();
                foreach (var achivment in allAchivments)
                {
                    var userAchivment = new UserAchivmentsModel
                    {
                        UserId = user.Id,
                        AchivmentId = achivment.Id
                    };
                    _context.UserAchivments.Add(userAchivment);
                }

                var newSaveFile = new SaveFileModel
                {
                    UserId = user.Id,
                    FirstSaveName = "None",
                    FirstSaveId = 0,
                    SecondSaveName = "None",
                    SecondSaveId = 0,
                    ThirdSaveName = "None",
                    ThirdSaveId = 0,
                };
                _context.SaveFile.Add(newSaveFile);
                var reputation = new ReputationModel
                {
                    UserId = user.Id,
                    CatReputation = 0
                };
                _context.Reputation.Add(reputation);
                _context.SaveChanges();
            }

            var userClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var identity = new ClaimsIdentity(userClaims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            await UpdateAchivments(user.Id);

            return RedirectToAction("Index", "Home");
        }


        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
    }
}
