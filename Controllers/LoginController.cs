using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using NovelProject.Data;

namespace NovelProject.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILogger<LoginController> _logger;
        private readonly GmailService gmailService;
        public LoginController(ILogger<LoginController> logger, GmailService gmailService)
        {
            _logger = logger;
            this.gmailService = gmailService;
        }
        public IActionResult Index()
        {
            return View();
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
