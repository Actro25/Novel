using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using NovelProject.AlterModels;
using NovelProject.Data;
using NovelProject.Models;
using System.Data.Entity;
using System.Security.Claims;

namespace NovelProject.Controllers
{
    public class PlayGameController : Controller
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PlayGameController> _logger;
        public PlayGameController(AppDbContext context, ILogger<PlayGameController> logger)
        {
            _context = context;
            _logger = logger;
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
        [HttpGet]
        public IActionResult LoadGame(int sceneId)
        {
            var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (currentScene == null)
                return NotFound("Scene not found.");
            var currentPart = _context.Parts.FirstOrDefault(p => p.id == currentScene.id_part);
            if (currentPart == null)
                return NotFound("Part not found.");
            var currentAct = _context.Acts.FirstOrDefault(a => a.Id == currentPart.act_id);
            if (currentAct == null)
                return NotFound("Act not found.");
            return RedirectToAction("ActionSeeScene", new { actId = currentAct.Id, StartAct = false, partId = currentPart.id, sceneID = currentScene.id });
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


            List<AchivmentsModel> filteredAchivments;

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? userId = null;

            if (int.TryParse(userIdStr, out int parsedUserId))
            {
                userId = parsedUserId;

                var currentSceneAchivments = _context.Achivments
                    .Where(a => a.SceneId == sceneId)
                    .ToList();

                var unachievedAchivmentIds = _context.UserAchivments
                    .Where(a => a.UserId == userId && !a.IsAchieved)
                    .Select(a => a.AchivmentId)
                    .ToList();

                filteredAchivments = currentSceneAchivments
                    .Where(a => unachievedAchivmentIds.Contains(a.Id))
                    .ToList();
            }
            else
            {
                filteredAchivments = _context.Achivments
                    .Where(a => a.SceneId == sceneId)
                    .ToList();
            }



            var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (currentScene == null)
                return NotFound("Scene not found.");

            var nextScene = _context.Scenes.FirstOrDefault(s => s.id == currentScene.id_next_scene);

            bool endOfPartReached = nextScene != null && nextScene.id_part != currentScene.id_part;
            int nextPartId = nextScene?.id_part ?? currentScene.id_part;
            var temp = new PlayGameSceneChange
            {
                CurrentScene = currentScene,
                actId = actId,
                StartPart = StartPart,
                EndOfPartReached = endOfPartReached,
                NextSceneId = nextScene?.id ?? 0,
                NextPartId = nextPartId,
                Achivments = filteredAchivments,
            };

            if (userId.HasValue)
            {
                var SaveFile = _context.SaveFile.FirstOrDefault(s => s.UserId == userId.Value);
                if (SaveFile != null)
                {
                    temp.SaveFile = SaveFile;
                }
            }
            return View(temp);
        }
        [HttpPost]
        public IActionResult SaveGame(int selectedSlot, string saveName, int partId, int actId, int sceneId)
        {
            var scene_save = 0;
            if (selectedSlot == 0)
                return BadRequest("Please select a valid slot.");

            if (saveName == null)
                return BadRequest("Please provide a save name.");

            if (partId > 0 && sceneId == 0)
            {
                var current_part_save = _context.Parts.FirstOrDefault(p => p.id == partId);
                if (current_part_save == null)
                    return NotFound("Part not found.");
                scene_save = current_part_save.end_scene_id;
            }
            else if (partId > 0 && sceneId > 0)
            {
                var current_scene_save = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
                if (current_scene_save == null)
                    return NotFound("Scene not found.");
                scene_save = current_scene_save.id;
            }
            else if (partId == 0 && sceneId == 0)
            {
                var current_act_save = _context.Acts.FirstOrDefault(a => a.Id == actId);
                if (current_act_save == null)
                    return NotFound("Act not found.");
                var current_part_save = _context.Parts.FirstOrDefault(p => p.id == current_act_save.EndPartId);
                if (current_part_save == null)
                    return NotFound("Part not found.");
                scene_save = current_part_save.end_scene_id;
            }
            else if (partId == 0 && sceneId > 0)
            {
                scene_save = sceneId;
            }
            else
            {
                return BadRequest("Invalid part or scene ID.");
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User not logged in.");
            }

            int userId = int.Parse(userIdClaim.Value);

            var SaveFile = new SaveFileModel();

            switch (selectedSlot)
            {
                case 1:
                    SaveFile.FirstSaveId = scene_save;
                    SaveFile.FirstSaveName = saveName;
                    break;
                case 2:
                    SaveFile.SecondSaveId = scene_save;
                    SaveFile.SecondSaveName = saveName;
                    break;
                case 3:
                    SaveFile.ThirdSaveId = scene_save;
                    SaveFile.ThirdSaveName = saveName;
                    break;
            }

            SaveFile.UserId = userId;

            var perevirka = _context.SaveFile.FirstOrDefault(s => s.UserId == userId);
            if (perevirka == null)
            {
                _context.SaveFile.Add(SaveFile);
            }
            else
            {
                switch (selectedSlot) {
                    case 1:
                        perevirka.FirstSaveId = scene_save;
                        perevirka.FirstSaveName = saveName;
                        break;
                    case 2:
                        perevirka.SecondSaveId = scene_save;
                        perevirka.SecondSaveName = saveName;
                        break;
                    case 3:
                        perevirka.ThirdSaveId = scene_save;
                        perevirka.ThirdSaveName = saveName;
                        break;
                }
                _context.SaveFile.Update(perevirka);
            }

            _context.SaveChanges();
            return RedirectToAction("ActionSeeScene", new { partId, sceneId, StartPart = false, actId });
        }
        [HttpPost]
        public async Task<IActionResult> UpdateAchivments([FromBody] List<int> achivmentIds)
        {
            try
            {
                if (achivmentIds == null || !achivmentIds.Any())
                    return BadRequest("No achivment IDs provided");

                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdStr, out int userId))
                    return Unauthorized();

                var achivments = _context.UserAchivments
                    .Where(a => a.UserId == userId && achivmentIds.Contains(a.AchivmentId) && !a.IsAchieved)
                    .ToList();

                if (!achivments.Any())
                    return Ok("No new achivments to update");

                foreach (var ach in achivments)
                {
                    ach.IsAchieved = true;
                    ach.AchievedAt = DateTime.UtcNow; // Додайте дату отримання
                }

                await _context.SaveChangesAsync();

                return Ok(achivments.Select(a => a.AchivmentId));
            }
            catch (Exception ex)
            {
                // Логування помилки
                _logger.LogError(ex, "Error updating achivments");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
