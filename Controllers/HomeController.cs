using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
<<<<<<< HEAD
using NovelProject.Models; 
=======
using NovelProject.Models;
>>>>>>> Vergil_Main

namespace NovelProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        
        public IActionResult Index()
        {
            
            return View(); 
        }

<<<<<<< HEAD
        
        public IActionResult NewGame()
        {
            
            return View(); 
        }

        
        public IActionResult LoadGame()
=======
        public IActionResult NewGame()
>>>>>>> Vergil_Main
        {
            return View();
        }

        
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }

        
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}