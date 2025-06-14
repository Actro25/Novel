using Microsoft.AspNetCore.Mvc;
using NovelProject.AlterModels;
using NovelProject.Data;
using NovelProject.Models;

public class TestController : Controller
{
    private readonly AppDbContext _context;

    public List<string> BackgroundImagePaths { get; private set; }
    public List<string> PersonageImagePaths { get; private set; }
    public List<string> AdditionalImagePaths { get; private set; }

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
        var acts = _context.Acts.ToList();
        var res = new SceneViewAllModel
        {
            Scene = scenes,
            Answers = answer,
            Parts = parts,
            Acts = acts
        };


        return View(res);
    }
    //Acts actions start <--------------------------------------------------------
    public IActionResult CreateAct()
    {
        var temp = new CreateActsModel
        {
            Act = new ActsModel(),
            AllActs = _context.Acts.ToList()
        };
        return View(temp);
    }
       // var temp = new ActsModel();
    [HttpPost]
    public IActionResult CreateAct(CreateActsModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }
        _context.Acts.Add(model.Act);
        _context.SaveChanges();
        return RedirectToAction("Index", "Test");
    }
    public IActionResult DetailAct(int id)
    {
        var act = _context.Acts.Find(id);
        if (act == null)
        {
            return NotFound();
        }
        return View(act);
    }
    [HttpPost]
    public IActionResult EditAct(ActsModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }
        _context.Acts.Update(model);
        _context.SaveChanges();
        return RedirectToAction("Index", "Test");
    }
    [HttpPost]
    public IActionResult DeleteAct(int id)
    {
        var act = _context.Acts.FirstOrDefault(a => a.Id == id);
        if (act == null)
        {
            return NotFound();
        }
        // Видалення всіх частин, пов'язаних з актом
        var parts = _context.Parts.Where(p => p.act_id == id).ToList();
        _context.Parts.RemoveRange(parts);
        // Видалення акта
        _context.Acts.Remove(act);
        _context.SaveChanges();
        return RedirectToAction("Index", "Test");
    }
    //Acts actions end <-----------------------------------------------------------
    //Parts actions start <--------------------------------------------------------
    public IActionResult CreatePart()
    {
        var temp = new PartOneAndAllModel
        {
            Parts = new PartsModel(),
            AllParts = _context.Parts.ToList(),
            AllActs = _context.Acts.ToList(),

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

        var part = _context.Parts.FirstOrDefault(p => p.id == model.Parts.id);
        if (part == null)
        {
            return NotFound("Part not found after creation.");
        }
        var temp_Act = _context.Acts.FirstOrDefault(a => a.Id == part.act_id);
        if (temp_Act != null)
        {
            var temp_Parts_For_Act = _context.Parts.Where(p => p.act_id == temp_Act.Id).ToList();
            if (temp_Parts_For_Act.Count == 1)
            {
                temp_Act.StartPartId = part.id;
            }
            else
            {
                temp_Act.EndPartId = part.id;
            }
            _context.Acts.Update(temp_Act);
            _context.SaveChanges();
        }

        return RedirectToAction("Index", "Test");
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
    //Parts actions end <-----------------------------------------------------------

    //Scenes actions start <--------------------------------------------------------
    public IActionResult CreateScene(int partId)
    {
        SceneViewAllModel AllItems = new SceneViewAllModel();
        AllItems.Scene = _context.Scenes.ToList();
        AllItems.Answers = _context.Answers.ToList();
        AllItems.Parts = _context.Parts.ToList();
        var temp = new CreateSceneModel
        {
            Scenes = new ScenesModel(),
            Answers = new List<AnswersModel>(),
            partId = partId,
            AllItems = AllItems,
            BackgroundImagePaths = Directory.GetFiles("wwwroot/scene_images/backgrounds").Select(f => "/scene_images/backgrounds/" + Path.GetFileName(f)).ToList(),
            PersonageImagePaths = Directory.GetFiles("wwwroot/scene_images/personage_images").Select(f => "/scene_images/personage_images/" + Path.GetFileName(f)).ToList(),
            AdditionalImagePaths = Directory.GetFiles("wwwroot/scene_images/additional_images").Select(f => "/scene_images/additional_images/" + Path.GetFileName(f)).ToList()
        };

        return View(temp);
    }
    [HttpPost]
    public IActionResult CreateScene(CreateSceneModel items)
    {
        if (!ModelState.IsValid)
            return View(items);


        items.Scenes.background_scene_img = items.backgroundImagePath ?? string.Empty;
        items.Scenes.personage_scene_img = items.personageImagePath ?? string.Empty;
        items.Scenes.additional_scene_img = items.additionalImagePath ?? string.Empty;
        // — 2. Додаємо нову сцену
        _context.Scenes.Add(items.Scenes);
        _context.SaveChanges();

        // — 3. Додаємо всі відповіді з форми
        if (items.Answers != null && items.Answers.Any())
        {
            foreach (var ans in items.Answers)
            {
                ans.id_scene = items.Scenes.id;
                // Якщо у вас є логіка next_scene_id — тут її теж можна призначити
                _context.Answers.Add(ans);
            }
            _context.SaveChanges();
        }
        if (items.preview_scene_ids.Count != 0)
        {
            foreach (var previewId in items.preview_scene_ids)
            {
                var temp_preview_scene = _context.Scenes.FirstOrDefault(s => s.id == previewId);
                if (temp_preview_scene != null)
                {
                    temp_preview_scene.id_next_scene = items.Scenes.id;
                    _context.Scenes.Update(temp_preview_scene);
                }
            }
        }
        else if(items.preview_answer_ids.Count != 0)
        {
            foreach (var previewId in items.preview_answer_ids)
            {
                var temp_preview_answer = _context.Answers.FirstOrDefault(a => a.id == previewId);
                if (temp_preview_answer != null)
                {
                    temp_preview_answer.next_scene_id = items.Scenes.id;
                    _context.Answers.Update(temp_preview_answer);
                }
            }
        }
        _context.SaveChanges();

        var temp_all_scenes = _context.Scenes.Where(s => s.id_part == items.partId).ToList();
        var temp_part = _context.Parts.FirstOrDefault(p => p.id == items.partId);
        if (temp_part != null)
        {
            if (temp_all_scenes.Count == 1)
                temp_part.start_scene_id = items.Scenes.id;
            else
                temp_part.end_scene_id = items.Scenes.id;

            _context.Parts.Update(temp_part);
            _context.SaveChanges();
        }

        return RedirectToAction(nameof(Index));
    }


    public IActionResult DetailScene(int id)
    {
        var currentScene = _context.Scenes.FirstOrDefault(s => s.id == id);
        if (currentScene == null)
            return NotFound();

        var answersForScene = _context.Answers
            .Where(a => a.id_scene == id)
            .ToList(); // Отримуємо **всі** відповіді

        var preview_scene_ids_temp = _context.Scenes
            .Where(s => s.id_next_scene == currentScene.id)
            .ToList(); // Отримуємо всі сцени, які ведуть до поточної сцени

        var preview_answer_ids_temp = _context.Answers
            .Where(a => a.next_scene_id == currentScene.id)
            .ToList(); // Отримуємо всі відповіді, які ведуть до поточної сцени
        var model = new DetailSceneModel
        {
            Scenes = currentScene,
            Answers = answersForScene, // Передаємо список відповідей
            preview_scene_ids = preview_scene_ids_temp.Select(s => s.id).ToList(), // Передаємо ID сцен
            preview_answer_ids = preview_answer_ids_temp.Select(a => a.id).ToList(), // Передаємо ID відповідей
            BackgroundImagePaths = Directory.GetFiles("wwwroot/scene_images/backgrounds").Select(f => "/scene_images/backgrounds/" + Path.GetFileName(f)).ToList(),
            PersonageImagePaths = Directory.GetFiles("wwwroot/scene_images/personage_images").Select(f => "/scene_images/personage_images/" + Path.GetFileName(f)).ToList(),
            AdditionalImagePaths = Directory.GetFiles("wwwroot/scene_images/additional_images").Select(f => "/scene_images/additional_images/" + Path.GetFileName(f)).ToList(),
            AllItems = new SceneViewAllModel
            {
                Scene = _context.Scenes.ToList(),
                Answers = _context.Answers.ToList(),
                Parts = _context.Parts.ToList()
            }
        };

        return View(model);
    }
    [HttpPost]
    public IActionResult DetailScene(DetailSceneModel model)
    {
        ModelState.Remove("AllItems");
        ModelState.Remove("Answers");
        if (!ModelState.IsValid)
        {
            // Повертаємо назад модель з усіма потрібними даними для повторного рендеру форми
            model.AllItems = new SceneViewAllModel
            {
                Scene = _context.Scenes.ToList(),
                Answers = _context.Answers.ToList(),
                Parts = _context.Parts.ToList()
            };
            return View(model);
        }

        var scene = _context.Scenes.Find(model.Scenes.id);
        if (scene == null)
            return NotFound();

        // Оновлюємо значення сцени
        scene.text_scene = model.Scenes.text_scene;
        scene.answer = model.Scenes.answer;
        scene.background_scene_img = model.Scenes.background_scene_img;
        scene.personage_scene_img = model.Scenes.personage_scene_img;
        scene.additional_scene_img = model.Scenes.additional_scene_img;
        if (model.preview_scene_ids != null)
        {
            foreach (var previewId in model.preview_scene_ids)
            {
                var temp_preview_scene = _context.Scenes.FirstOrDefault(s => s.id == previewId);
                if (temp_preview_scene != null)
                {
                    temp_preview_scene.id_next_scene = model.Scenes.id;
                    _context.Scenes.Update(temp_preview_scene);
                }
            }
        }
        else if (model.preview_scene_ids != null)
        {
            foreach (var previewId in model.preview_answer_ids)
            {
                var temp_preview_answer = _context.Answers.FirstOrDefault(a => a.id == previewId);
                if (temp_preview_answer != null)
                {
                    temp_preview_answer.next_scene_id = model.Scenes.id;
                    _context.Answers.Update(temp_preview_answer);
                }
            }
        }

        // Видаляємо старі відповіді
        var oldAnswers = _context.Answers.Where(a => a.id_scene == scene.id).ToList();
        _context.Answers.RemoveRange(oldAnswers);

        // Додаємо нові відповіді, якщо це сцена з варіантами
        if (scene.answer && model.Answers != null)
        {
            foreach (var answer in model.Answers)
            {
                if (!string.IsNullOrWhiteSpace(answer.asnwer_for_scene))
                {
                    _context.Answers.Add(new AnswersModel
                    {
                        id_scene = scene.id,
                        asnwer_for_scene = answer.asnwer_for_scene
                    });
                }
            }
        }

        _context.SaveChanges();

        return RedirectToAction("Index"); // або інша сторінка після збереження
    }
    [HttpPost]
    public IActionResult DeleteScene(int id)
    {
        var scene = _context.Scenes.FirstOrDefault(s => s.id == id);
        if (scene == null)
            return NotFound();

        // 1. Видалення зображення з диску
        if (!string.IsNullOrEmpty(scene.background_scene_img))
        {
            // Отримуємо фізичний шлях
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", scene.background_scene_img.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        // 2. Видалення пов'язаних відповідей
        var answers = _context.Answers.Where(a => a.id_scene == id).ToList();
        _context.Answers.RemoveRange(answers);

        // 3. Видалення сцени
        _context.Scenes.Remove(scene);

        _context.SaveChanges();

        return RedirectToAction("Index"); // або інша сторінка після видалення
    }
    //Scenes actions end <----------------------------------------------------------

    //Add Images start <--------------------------------------------------------
    public IActionResult AddImageToScene()
    {
        return View();
    }

    [HttpPost]
    public IActionResult AddImageToScene(List<IFormFile> scenePhotos)
    {
        if (scenePhotos != null && scenePhotos.Any())
        {
            var imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "scene_images/backgrounds");
            Directory.CreateDirectory(imageFolder);

            foreach (var photo in scenePhotos)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";
                var filePath = Path.Combine(imageFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    photo.CopyTo(stream);
                }
            }
        }
        return Redirect("SeeFullHistoryTree");
    }

    public IActionResult AddPersonageToScene()
    {
        return RedirectToAction("AddImageToScene");
    }
    [HttpPost]
    public IActionResult AddPersonageToScene(List<IFormFile> characterPhotos)
    {
        if (characterPhotos != null && characterPhotos.Any())
        {
            var imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "scene_images/personage_images");
            Directory.CreateDirectory(imageFolder);
            foreach (var photo in characterPhotos)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";
                var filePath = Path.Combine(imageFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    photo.CopyTo(stream);
                }
            }
        }
        return Redirect("SeeFullHistoryTree");
    }

    public IActionResult AddAdditionalToScene()
    {
        return RedirectToAction("AddImageToScene");
    }
    [HttpPost]
    public IActionResult AddAdditionalToScene(List<IFormFile> extraPhotos)
    {
        if (extraPhotos != null && extraPhotos.Any())
        {
            var imageFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "scene_images/additional_images");
            Directory.CreateDirectory(imageFolder);
            foreach (var photo in extraPhotos)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photo.FileName)}";
                var filePath = Path.Combine(imageFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    photo.CopyTo(stream);
                }
            }
        }
        return Redirect("SeeFullHistoryTree");
    }
    //Add Images end <----------------------------------------------------------
    //Start binnary tree <--------------------------------------------------------
    public IActionResult BinaryTreeView(int id)
    {
        var scenes = _context.Scenes.ToList();
        var answer = _context.Answers.ToList();
        var parts = _context.Parts.ToList();
        var SceneViewBinarry = new SceneViewAllAndIdPartModel
        {
            SceneViewAll = new SceneViewAllModel
            {
                Scene = scenes,
                Answers = answer,
                Parts = parts
            },
            IdPart = id
        };
        return View(SceneViewBinarry);
    }
    //End binnary tree <----------------------------------------------------------
}
