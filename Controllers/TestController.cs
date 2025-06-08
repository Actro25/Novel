using Microsoft.AspNetCore.Mvc;
using NovelProject.AlterModels;
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
        return RedirectToAction("SeeFullHistoryTree");
    }
    public IActionResult SeeFullHistoryTree()
    {
        var scenes = _context.Scenes.ToList();
        var answer = _context.Answers.ToList();
        var parts = _context.Parts.ToList();
        var res = new SceneViewModel
        {
            Scene = scenes,
            Answers = answer,
            Parts = parts
        };


        return View(res);
    }
}
