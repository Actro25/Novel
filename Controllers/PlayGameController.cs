using Microsoft.AspNetCore.Mvc;
using NovelProject.AlterModels;
using NovelProject.Data;
using NovelProject.Models;

namespace NovelProject.Controllers
{
    public class PlayGameController : Controller
    {
        private readonly AppDbContext _context;
        public PlayGameController(AppDbContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {

            var firstAct = _context.Acts.OrderBy(a => a.Id).FirstOrDefault();
            if (firstAct == null)
            {
                return NotFound("No acts found in the database.");
            }
            //var CurentPart = _context.Parts.FirstOrDefault(p => p.act_id == firstAct.Id);
            //if (CurentPart == null)
            //{
            //    return NotFound("No parts found for the first act.");
            //}
            //var CurrentScene = _context.Scenes.FirstOrDefault(s => s.id == CurentPart.start_scene_id);
            //if (CurrentScene == null)
            //{
            //    return NotFound("No starting scene found for the current part.");
            //}
            //if (CurrentScene.answer != false)
            //{
            //    var CurrentAnswers = _context.Answers.Where(a => a.id_scene == CurrentScene.id).ToList();
            //}
            return RedirectToAction("ActionSee", new { actId = firstAct.Id, StartActOrEnd = true });
        }
        public IActionResult ActionSee(int actId, bool StartActOrEnd)
        {
            var temp = new CheckActModel
            {
                Act = _context.Acts.FirstOrDefault(a => a.Id == actId) ?? new ActsModel(),
                StartActOrEnd = StartActOrEnd
            };
            return View(temp);
        }
        [HttpGet]
        public IActionResult ActionSeePart(int partId, int actId)
        {
            var CurrentAct = _context.Acts.FirstOrDefault(a => a.Id == actId);
            if (CurrentAct == null)
            {
                return NotFound("Act not found.");
            }
            var StartPartOrEnd = (CurrentAct.StartPartId == partId) ? true : false;
            var CurrentPart = _context.Parts.FirstOrDefault(p => p.id == partId);
            if (CurrentPart == null)
            {
                return NotFound("Part not found.");
            }
            var temp = new CheckPartModel
            {
                Part = CurrentPart,
                StartPartOrEnd = StartPartOrEnd
            };

            return View(temp);
        }
        public IActionResult ActionSeeScene(int partId, int sceneId)
        {
            var CurrentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (CurrentScene == null)
            {
                return NotFound("Scene not found.");
            }
            return View(CurrentScene);
        }
    }
}
