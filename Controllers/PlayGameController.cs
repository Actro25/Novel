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

            var currentAct = _context.Acts.FirstOrDefault(a => a.Id == ActId);
            var currentPart = _context.Parts.FirstOrDefault(p => p.id == PartId);
            if (currentAct == null || currentPart == null)
                return NotFound("Act or Part or Scene not found.");
            if (sceneId == 0)
            {
                if (currentAct.EndPartId == currentPart.id)
                {
                    if (currentAct.NextActId == 0)
                    {
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        var nextAct = _context.Acts.FirstOrDefault(a => a.Id == currentAct.NextActId);
                        if (nextAct == null)
                            return NotFound("Next Act not found.");

                        var nextPart = _context.Parts.FirstOrDefault(p => p.id == nextAct.StartPartId && p.act_id == nextAct.Id);
                        if (nextPart == null)
                            return NotFound("Next Part not found.");

                        return RedirectToAction("ActionSee", new { actId = nextAct.Id, partId = nextPart.id, sceneId = nextPart.start_scene_id, StartAct = true });
                    }
                }
            }

            var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (currentScene == null)
                return NotFound("Scene not found.");



            var currentPart_forScene = _context.Parts.FirstOrDefault(p => p.id == currentScene.id_part);
            if (currentPart_forScene == null)
                return NotFound("Part for the current scene not found.");

            if (currentPart_forScene.act_id != currentAct.Id)
            {
                var currentAct_forScene = _context.Acts.FirstOrDefault(a => a.Id == currentPart_forScene.act_id);
                if (currentAct_forScene == null)
                    return NotFound("Act for the current scene not found.");

                return RedirectToAction("ActionSee", new { actId = currentAct_forScene.Id, partId = currentPart_forScene.id, sceneID = currentScene.id, StartAct = true });
            }
            else if (currentAct.EndPartId == currentPart.id)
            {
                var nextAct = _context.Acts.FirstOrDefault(a => a.Id == currentAct.NextActId);
                if (nextAct == null)
                    return RedirectToAction("Index", "Home");

                var nextPart = _context.Parts.FirstOrDefault(p => p.id == nextAct.StartPartId && p.act_id == nextAct.Id);
                if (nextPart == null)
                    return NotFound("Next Part not found.");

                return RedirectToAction("ActionSee", new { actId = nextAct.Id, partId = nextPart.id, sceneID = nextPart.start_scene_id, StartAct = true });
            }
            else if (currentPart.next_part_id != currentPart_forScene.id)
            {
                if (currentPart.act_id == currentPart_forScene.act_id)
                    return RedirectToAction("ActionSeePart", new { partId = currentPart_forScene.id, actId = currentAct.Id, StartAct = true, sceneID = currentScene.id });
                else
                    return RedirectToAction("ActionSee", new { partId = currentPart_forScene.id, actId = currentAct.Id, StartAct = true, sceneID = currentScene.id });
            }
            else if (currentPart.next_part_id == currentPart_forScene.id)
            {
                var nextPart = _context.Parts.FirstOrDefault(p => p.id == currentPart.next_part_id);
                if (nextPart == null)
                    return NotFound("Next Part not found.");
                if (nextPart.start_scene_id != currentScene.id)
                    return RedirectToAction("ActionSeePart", new { partId = nextPart.id, actId = currentAct.Id, StartAct = true, sceneID = currentScene.id });
                else
                    return RedirectToAction("ActionSeePart", new { partId = nextPart.id, actId = currentAct.Id, StartAct = true, sceneID = nextPart.start_scene_id });
            }
            else {
                return RedirectToAction("Index", "Home");
            }
        }
        [HttpGet]
        public IActionResult ActionSee(int actId, bool StartAct, int partId, int sceneId)
        {
            if (sceneId != 0)
            {
                var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
                if (currentScene == null)
                    return NotFound("Scene not found.");

                var previousScenes = _context.Scenes
                    .Where(s => s.id_next_scene == currentScene.id)
                    .ToList();

                if (previousScenes.Count > 0)
                {
                    var prevPartIds = previousScenes.Select(s => s.id_part).Distinct().ToList();
                    var prevParts = _context.Parts
                        .Where(p => prevPartIds.Contains(p.id))
                        .ToList();

                    bool comesFromAnotherPartOrAct = prevParts.Any(p => p.id != partId || p.act_id != actId);

                    if (!comesFromAnotherPartOrAct)
                    {
                        return RedirectToAction("ChangePart", "PlayGame", new { partId, actId, sceneId });
                    }
                    
                }
            }

            var temp = new CheckActModel
            {
                Act = _context.Acts.FirstOrDefault(a => a.Id == actId) ?? new ActsModel(),
                StartActOrEnd = StartAct,
                SceneId = sceneId,
                PartId = partId
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

            var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (currentScene == null)
                return NotFound("Scene not found.");

            var nextScene = _context.Scenes.FirstOrDefault(s => s.id == currentScene.id_next_scene);

            // Зберігаємо інформацію про перехід у новий парт
            bool endOfPartReached = nextScene != null && nextScene.id_part != currentScene.id_part;
            int nextPartId = nextScene?.id_part ?? currentScene.id_part;
            var temp = new PlayGameSceneChange
            {
                CurrentScene = currentScene,
                actId = actId,
                StartPart = StartPart,
                EndOfPartReached = endOfPartReached,
                NextSceneId = nextScene?.id ?? 0,
                NextPartId = nextPartId
            };

            return View(temp);
        }

    }
}
