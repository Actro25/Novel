using Microsoft.AspNetCore.Mvc;
using NovelProject.Data;

public class TestController : Controller
{
    private readonly AppDbContext _context;

    public TestController(AppDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var scenes = _context.Scenes.ToList();
        return Content($"{scenes}");
    }
}
