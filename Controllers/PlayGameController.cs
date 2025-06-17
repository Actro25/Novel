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
                return NotFound("No acts found in the database.");
            var firstPart = _context.Parts.FirstOrDefault(p => p.id == firstAct.StartPartId);
            if (firstPart == null)
                return NotFound("No parts found for the first act.");
            var firstScene = _context.Scenes.FirstOrDefault(s => s.id == firstPart.start_scene_id);
            if (firstScene == null)
                return NotFound("No scenes found for the first part.");

            return RedirectToAction("ActionSee", new { actId = firstAct.Id, StartAct = true, partId = firstPart.id, sceneId = firstScene.id });
        }
        public IActionResult ChangePart(int ActId, int PartId, int sceneId)
        {
            var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);


            var currentAct = _context.Acts.FirstOrDefault(a => a.Id == ActId);
            var currentPart = _context.Parts.FirstOrDefault(p => p.id == PartId);
            if (currentAct == null || currentPart == null || currentScene == null)
                return NotFound("Act or Part or Scene not found.");

            var currentPart_forScene = _context.Parts.FirstOrDefault(p => p.id == currentScene.id_part);
            if (currentPart_forScene == null)
                return NotFound("Part for the current scene not found.");

            if (currentPart_forScene.act_id != currentAct.Id)
            {
                var currentAct_forScene = _context.Acts.FirstOrDefault(a => a.Id == currentPart_forScene.act_id);
                if (currentAct_forScene == null)
                    return NotFound("Act for the current scene not found.");

                return RedirectToAction("ActionSee", new { actId = currentAct_forScene.Id, partId = currentPart_forScene, StartAct = true });
            }
            else if (currentAct.EndPartId == currentPart.id)
            {
                var nextAct = _context.Acts.FirstOrDefault(a => a.Id == currentAct.NextActId);
                if (nextAct == null)
                    return RedirectToAction("Index", "Home");

                var nextPart = _context.Parts.FirstOrDefault(p => p.id == nextAct.StartPartId && p.act_id == nextAct.Id);
                if (nextPart == null)
                    return NotFound("Next Part not found.");

                return RedirectToAction("ActionSee", new { actId = nextAct.Id, partId = nextPart.id, StartAct = true });
            }
            else if (currentPart.next_part_id != currentPart_forScene.id)
            {

                return RedirectToAction("ActionSeePart", new { partId = currentPart_forScene.id, actId = currentAct.Id, StartAct = true, sceneID = currentScene.id });
            }
            else
            {
                var nextPart = _context.Parts.FirstOrDefault(p => p.id == currentPart.next_part_id);
                if (nextPart == null)
                    return NotFound("Next Part not found.");

                return RedirectToAction("ActionSeePart", new { partId = nextPart.id, actId = currentAct.Id, StartAct = true });
            }
        }
        [HttpGet]
        public IActionResult ActionSee(int actId, bool StartAct, int partId, int sceneId)
        {
            var temp = new CheckActModel
            {
                Act = _context.Acts.FirstOrDefault(a => a.Id == actId) ?? new ActsModel(),
                StartActOrEnd = StartAct,
                SceneId = sceneId
            };
            return View(temp);
        }
        [HttpGet]
        public IActionResult ActionSeePart(int partId, int actId, bool StartAct, int sceneID)
        {
            var CurrentAct = _context.Acts.FirstOrDefault(a => a.Id == actId);
            if (CurrentAct == null)
                return NotFound("Act not found.");

            var CurrentPart = _context.Parts.FirstOrDefault(p => p.id == partId);
            if (CurrentPart == null)
                return NotFound("Part not found.");

            var temp = new CheckPartModel
            {
                Part = CurrentPart,
                StartPartOrEnd = StartAct,
                ActId = actId,
                SceneId = sceneID
            };

            return View(temp);
        }
        [HttpGet]
        public IActionResult ActionSeeScene(int partId, int sceneId, bool StartPart, int actId)
        {
            if (sceneId == 0)
                return RedirectToAction("ActionSeePart", new { partId, actId, StartAct = false, sceneID = sceneId });

            var CurrentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (CurrentScene == null)
                return NotFound("Scene not found.");

            var temp_preview = _context.Scenes.Where(s => s.id_next_scene == CurrentScene.id && s.id_part != CurrentScene.id_part).ToList();
            if (temp_preview.Count > 0)
                return RedirectToAction("ActionSeePart", new { partId, actId, StartAct = false, sceneId = CurrentScene.id });

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
