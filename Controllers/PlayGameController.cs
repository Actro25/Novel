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
            return RedirectToAction("ActionSee", new { actId = firstAct.Id, StartAct = true });
        }
        public IActionResult ChangePart(int ActId, int PartId)
        {
            var currentAct = _context.Acts.FirstOrDefault(a => a.Id == ActId);
            var currentPart = _context.Parts.FirstOrDefault(p => p.id == PartId);
            if (currentAct == null || currentPart == null)
            {
                return NotFound("Act or Part not found.");
            }
            if (currentAct.EndPartId == currentPart.id)
            {
                var nextAct = _context.Acts.FirstOrDefault(a => a.Id == currentAct.NextActId);
                if (nextAct == null)
                {
                    return NotFound("Next Act not found.");
                }
                var nextPart = _context.Parts.FirstOrDefault(p => p.id == nextAct.StartPartId && p.act_id == nextAct.Id);
                if (nextPart == null)
                {
                    return NotFound("Next Part not found.");
                }
                return RedirectToAction("ActionSee", new { actId = nextAct.Id, partId = nextPart.id, StartAct = true });
            }
            else
            {
                var nextPart = _context.Parts.FirstOrDefault(p => p.id == currentPart.next_part_id);
                if (nextPart == null)
                {
                    return NotFound("Next Part not found.");
                }
                return RedirectToAction("ActionSeePart", new { partId = nextPart.id, actId = currentAct.Id, StartAct = true  });
            }
        }
        public IActionResult ActionSee(int actId, bool StartAct, int partId)
        {
            if (!StartAct)
            {
                return RedirectToAction("ChangePart", new { actId, partId });
            }
            var temp = new CheckActModel
            {
                Act = _context.Acts.FirstOrDefault(a => a.Id == actId) ?? new ActsModel(),
                StartActOrEnd = StartAct
            };
            return View(temp);
        }
        [HttpGet]
        public IActionResult ActionSeePart(int partId, int actId, bool StartAct)
        {
            var CurrentAct = _context.Acts.FirstOrDefault(a => a.Id == actId);
            if (CurrentAct == null)
            {
                return NotFound("Act not found.");
            }
            var CurrentPart = _context.Parts.FirstOrDefault(p => p.id == partId);
            if (CurrentPart == null)
            {
                return NotFound("Part not found.");
            }

            var temp = new CheckPartModel
            {
                Part = CurrentPart,
                StartPartOrEnd = StartAct,
                ActId = actId
            };

            return View(temp);
        }
        public IActionResult ActionSeeScene(int partId, int sceneId, bool StartPart, int actId)
        {
            if (sceneId == 0)
            {
                return RedirectToAction("ActionSeePart", new { partId, actId, StartAct = false });
            }
            var CurrentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (CurrentScene == null)
            {
                return NotFound("Scene not found.");
            }
            var temp = new PlayGameSceneChange
            {
                CurrentScene = CurrentScene,
                actId = actId,
                StartPart = StartPart
            };
            return View(temp);
        }
    }
}
