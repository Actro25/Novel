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
                return View("~/Views/Home/Error.cshtml");
            var firstPart = _context.Parts.FirstOrDefault(p => p.id == firstAct.StartPartId);
            if (firstPart == null)
                return View("~/Views/Home/Error.cshtml");
            var firstScene = _context.Scenes.FirstOrDefault(s => s.id == firstPart.start_scene_id);
            if (firstScene == null)
                return View("~/Views/Home/Error.cshtml");

            return RedirectToAction("ActionSee", new { actId = firstAct.Id, StartAct = true, partId = firstPart.id, sceneId = firstScene.id });
        }
        [HttpGet]
        public IActionResult LoadGame(int sceneId)
        {
            var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (currentScene == null)
                return View("~/Views/Home/Error.cshtml");
            var currentPart = _context.Parts.FirstOrDefault(p => p.id == currentScene.id_part);
            if (currentPart == null)
                return View("~/Views/Home/Error.cshtml");
            var currentAct = _context.Acts.FirstOrDefault(a => a.Id == currentPart.act_id);
            if (currentAct == null)
                return View("~/Views/Home/Error.cshtml");
            return RedirectToAction("ActionSeeScene", new { actId = currentAct.Id, StartAct = false, partId = currentPart.id, sceneID = currentScene.id });
        }
        [HttpGet]
        public IActionResult ManualSaveGame(int partId, int sceneId, int actId, bool StartAct, bool IsSaveFromScene, bool IsSaveFromPart, bool IsSaveFromAct)
        {
            if (partId <= 0 && sceneId <= 0 && actId <= 0)
            {
                return View("~/Views/Home/Error.cshtml");
            }

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdStr, out int parsedUserId))
            {
                var userSaveFile = _context.SaveFile.FirstOrDefault(s => s.UserId == parsedUserId);
                if (userSaveFile == null)
                {
                    return View("~/Views/Home/Error.cshtml");
                }

                var existingManualSave = _context.ManualSave.FirstOrDefault(ms => ms.SaveFileId == userSaveFile.Id);

                if (existingManualSave != null)
                {
                    existingManualSave.SceneId = sceneId;
                    existingManualSave.PartId = partId;
                    existingManualSave.ActId = actId;
                    existingManualSave.IsStart = StartAct;
                    existingManualSave.IsSaveFromScene = IsSaveFromScene;
                    existingManualSave.IsSaveFromPart = IsSaveFromPart;
                    existingManualSave.IsSaveFromAct = IsSaveFromAct;

                    _context.ManualSave.Update(existingManualSave);
                }
                else
                {
                    var manualSave = new ManualSaveModel
                    {
                        SceneId = sceneId,
                        PartId = partId,
                        ActId = actId,
                        IsStart = StartAct,
                        IsSaveFromScene = IsSaveFromScene,
                        IsSaveFromPart = IsSaveFromPart,
                        IsSaveFromAct = IsSaveFromAct,
                        SaveFileId = userSaveFile.Id
                    };

                    _context.ManualSave.Add(manualSave);
                }

                _context.SaveChanges();
            }

            return RedirectToAction("Index", "Home");
        }
        [HttpGet]
        public IActionResult Continue()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdStr, out int parsedUserId))
            {
                var UserSaveFile = _context.SaveFile.FirstOrDefault(s => s.UserId == parsedUserId);
                if (UserSaveFile == null)
                {
                    return View("~/Views/Home/Error.cshtml");
                }
                var ManualSave = _context.ManualSave.FirstOrDefault(ms => ms.SaveFileId == UserSaveFile.Id);
                if (ManualSave == null)
                {
                    return View("~/Views/Home/Error.cshtml");
                }
                if (ManualSave.IsSaveFromScene)
                {
                    return RedirectToAction("ActionSeeScene", new { partId = ManualSave.PartId, sceneId = ManualSave.SceneId, StartPart = ManualSave.IsStart, actId = ManualSave.ActId });
                }
                else if (ManualSave.IsSaveFromPart)
                {
                    return RedirectToAction("ActionSeePart", new { partId = ManualSave.PartId, actId = ManualSave.ActId, StartAct = ManualSave.IsStart, sceneID = ManualSave.SceneId });
                }
                else if (ManualSave.IsSaveFromAct)
                {
                    return RedirectToAction("ActionSee", new { actId = ManualSave.ActId, StartAct = ManualSave.IsStart, partId = ManualSave.PartId, sceneId = ManualSave.SceneId });
                }
            }
            return RedirectToAction("Index", "PlayGame");
        }
        public IActionResult ChangePart(int ActId, int PartId, int sceneId)
        {

            var currentAct = _context.Acts.FirstOrDefault(a => a.Id == ActId);
            var currentPart = _context.Parts.FirstOrDefault(p => p.id == PartId);
            if (currentAct == null || currentPart == null)
                return View("~/Views/Home/Error.cshtml");
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
                            return View("~/Views/Home/Error.cshtml");

                        var nextPart = _context.Parts.FirstOrDefault(p => p.id == nextAct.StartPartId && p.act_id == nextAct.Id);
                        if (nextPart == null)
                            return View("~/Views/Home/Error.cshtml");

                        return RedirectToAction("ActionSee", new { actId = nextAct.Id, partId = nextPart.id, sceneId = nextPart.start_scene_id, StartAct = true });
                    }
                }
            }

            var currentScene = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
            if (currentScene == null)
                return View("~/Views/Home/Error.cshtml");



            var currentPart_forScene = _context.Parts.FirstOrDefault(p => p.id == currentScene.id_part);
            if (currentPart_forScene == null)
                return View("~/Views/Home/Error.cshtml");

            if (currentPart_forScene.act_id != currentAct.Id)
            {
                var currentAct_forScene = _context.Acts.FirstOrDefault(a => a.Id == currentPart_forScene.act_id);
                if (currentAct_forScene == null)
                    return View("~/Views/Home/Error.cshtml");

                return RedirectToAction("ActionSee", new { actId = currentAct_forScene.Id, partId = currentPart_forScene.id, sceneID = currentScene.id, StartAct = true });
            }
            else if (currentAct.EndPartId == currentPart.id)
            {
                var nextAct = _context.Acts.FirstOrDefault(a => a.Id == currentAct.NextActId);
                if (nextAct == null)
                    return RedirectToAction("Index", "Home");

                var nextPart = _context.Parts.FirstOrDefault(p => p.id == nextAct.StartPartId && p.act_id == nextAct.Id);
                if (nextPart == null)
                    return View("~/Views/Home/Error.cshtml");

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
                    return View("~/Views/Home/Error.cshtml");
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
                    return View("~/Views/Home/Error.cshtml");

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
                return View("~/Views/Home/Error.cshtml");

            var CurrentPart = _context.Parts.FirstOrDefault(p => p.id == partId);
            if (CurrentPart == null)
                return View("~/Views/Home/Error.cshtml");

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
                return View("~/Views/Home/Error.cshtml");

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
                return View("~/Views/Home/Error.cshtml");

            if (saveName == null)
                return View("~/Views/Home/Error.cshtml");

            if (partId > 0 && sceneId == 0)
            {
                var current_part_save = _context.Parts.FirstOrDefault(p => p.id == partId);
                if (current_part_save == null)
                    return View("~/Views/Home/Error.cshtml");
                scene_save = current_part_save.end_scene_id;
            }
            else if (partId > 0 && sceneId > 0)
            {
                var current_scene_save = _context.Scenes.FirstOrDefault(s => s.id == sceneId);
                if (current_scene_save == null)
                    return View("~/Views/Home/Error.cshtml");
                scene_save = current_scene_save.id;
            }
            else if (partId == 0 && sceneId == 0)
            {
                var current_act_save = _context.Acts.FirstOrDefault(a => a.Id == actId);
                if (current_act_save == null)
                    return View("~/Views/Home/Error.cshtml");
                var current_part_save = _context.Parts.FirstOrDefault(p => p.id == current_act_save.EndPartId);
                if (current_part_save == null)
                    return View("~/Views/Home/Error.cshtml");
                scene_save = current_part_save.end_scene_id;
            }
            else if (partId == 0 && sceneId > 0)
            {
                scene_save = sceneId;
            }
            else
            {
                return View("~/Views/Home/Error.cshtml");
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
                    return View("~/Views/Home/Error.cshtml");

                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdStr, out int userId))
                    return Unauthorized();

                var achivments = _context.UserAchivments
                    .Where(a => a.UserId == userId && achivmentIds.Contains(a.AchivmentId) && !a.IsAchieved)
                    .ToList();

                if (!achivments.Any())
                    return Ok();

                foreach (var ach in achivments)
                {
                    ach.IsAchieved = true;
                    ach.AchievedAt = DateTime.UtcNow; // Додайте дату отримання
                }

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating achivments");
                return View("~/Views/Home/Error.cshtml");
            }
        }
    }
}
