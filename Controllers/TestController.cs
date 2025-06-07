using Microsoft.AspNetCore.Mvc;
using NovelProject.Data;

namespace NovelProject.Controllers
{
    public class TestController : Controller
    {
        private readonly AppDbContext _context;

        public TestController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            try
            {
                int scenesCount = _context.Scenes.Count();
                return Content($"✅ Підключення до бази працює! Scenes: {scenesCount}");
            }
            catch (Exception ex)
            {
                return Content($"❌ Помилка: {ex.Message}");
            }
        }
    }
}
