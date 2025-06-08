using Microsoft.AspNetCore.Mvc;
using NovelProject.AlterModels;
using NovelProject.Data;
using NovelProject.Models;
using System.Data.Entity;

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
        var res = new SceneViewAllModel
        {
            Scene = scenes,
            Answers = answer,
            Parts = parts
        };


        return View(res);
    }
    public IActionResult CreatePart()
    {
        var temp = new PartOneAndAllModel
        {
            Parts = new PartsModel(),
            AllParts = _context.Parts.ToList()
        };
        return View(temp);
    }
    [HttpPost]
    public IActionResult CreatePart(PartOneAndAllModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        _context.Parts.Add(model.Parts);
        _context.SaveChanges();

        return RedirectToAction("CreatePart", "Test");
    }
    public IActionResult DetailPart(int id)
    {
        var part = _context.Parts.Find(id);
        if (part == null)
        {
            return NotFound();
        }
        var model = new PartOneAndAllModel
        {
            Parts = part,
            AllParts = _context.Parts.ToList()
        };
        return View(model);
    }
    [HttpPost]
    public IActionResult EditPart(PartOneAndAllModel model) {
        if (!ModelState.IsValid) {
            return View(model);
        }
        _context.Parts.Update(model.Parts);
        _context.SaveChanges();
        return RedirectToAction("CreatePart", "Test");
    }
    [HttpPost]
    public IActionResult DeletePart(int id) {
        var part =  _context.Parts.FirstOrDefault(p => p.id == id);
        if (part == null) { 
            return NotFound();
        }

        _context.Parts.Remove(part);
        _context.SaveChanges();
        return RedirectToAction("CreatePart", "Test");
    }
}
