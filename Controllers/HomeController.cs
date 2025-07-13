using Microsoft.AspNetCore.Mvc;
using NovelProject.AlterModels;
using NovelProject.Data;
using NovelProject.Models; 
using System.Diagnostics;
using System.Security.Claims;


namespace NovelProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context;

        public HomeController(ILogger<HomeController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }


        public IActionResult Index()
        {
            bool isHaveManualSave = false;
            var manualSave = new ManualSaveModel();
            var AllAchivments = new List<AchivmentsModel>();
            var UserAchivment = new List<UserAchivmentsModel>();
            var saveFiles = new List<ShowSaveFileModel>
            {
                new ShowSaveFileModel(),
                new ShowSaveFileModel(),
                new ShowSaveFileModel()
            };

            if (User.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out int userId))
                {
                    var saveFile = _context.SaveFile.FirstOrDefault(s => s.UserId == userId);

                    if (saveFile != null)
                    {
                        if (!string.IsNullOrEmpty(saveFile.FirstSaveName))
                        {
                            saveFiles[0] = FillSaveFileModel(
                                saveFile.FirstSaveName,
                                saveFile.FirstSaveId,
                                _context
                            );
                        }

                        if (!string.IsNullOrEmpty(saveFile.SecondSaveName))
                        {
                            saveFiles[1] = FillSaveFileModel(
                                saveFile.SecondSaveName,
                                saveFile.SecondSaveId,
                                _context
                            );
                        }

                        if (!string.IsNullOrEmpty(saveFile.ThirdSaveName))
                        {
                            saveFiles[2] = FillSaveFileModel(
                                saveFile.ThirdSaveName,
                                saveFile.ThirdSaveId,
                                _context
                            );
                        }
                        manualSave = _context.ManualSave.FirstOrDefault(ma => ma.SaveFileId == saveFile.Id);
                        if(manualSave == null)
                        {
                            manualSave = new ManualSaveModel();
                            isHaveManualSave = false;
                        }
                        else
                        {
                            isHaveManualSave = true;
                        }
                    }

                    UserAchivment = _context.UserAchivments
                        .Where(ua => ua.UserId == userId)
                        .ToList();
                    if (UserAchivment.Count > 0)
                    {
                        AllAchivments = _context.Achivments
                            .Where(a => UserAchivment.Select(ua => ua.AchivmentId).Contains(a.Id))
                            .ToList();
                    }
                    else
                    {
                        AllAchivments = _context.Achivments.ToList();
                    }
                }
            }
            else
            {
                manualSave = new ManualSaveModel();
                AllAchivments = _context.Achivments.ToList();
            }

            var result = new MenuShowModel
            {
                SaveFiles = saveFiles,
                UserAchivments = UserAchivment,
                AllAhivments = AllAchivments,
                ManualSave = manualSave,
                IsHaveManualSave = isHaveManualSave
            };

            return View(result);
        }

        private ShowSaveFileModel FillSaveFileModel(string fileName, int sceneId, AppDbContext context)
        {
            var scene = context.Scenes.FirstOrDefault(s => s.id == sceneId);
            var part = scene != null ? context.Parts.FirstOrDefault(p => p.id == scene.id_part) : null;
            var act = part != null ? context.Acts.FirstOrDefault(a => a.Id == part.act_id) : null;

            return new ShowSaveFileModel
            {
                FileName = fileName,
                SceneId = sceneId,
                SceneFirstText = scene?.text_scene ?? string.Empty,
                PartId = part?.id ?? 0,
                PartName = part?.name ?? string.Empty,
                ActId = act?.Id ?? 0,
                ActName = act?.Name ?? string.Empty,
            };
        }

        public IActionResult NewGame()
        {
            
            return View(); 
        }

        
        public IActionResult LoadMenu()
        {
            return View();
        }


        
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }

        
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View();
        }
    }
}