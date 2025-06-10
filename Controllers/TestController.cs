using Microsoft.AspNetCore.Mvc;
using NovelProject.AlterModels;
using NovelProject.Data;
using NovelProject.Models;

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
    //Parts actions start <--------------------------------------------------------
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
    //Parts actions end <-----------------------------------------------------------

    //Scenes actions start <--------------------------------------------------------
    public IActionResult CreateScene(int partId)
    {
        SceneViewAllModel AllItems = new SceneViewAllModel();
        AllItems.Scene = _context.Scenes.ToList();
        AllItems.Answers = _context.Answers.ToList();
        AllItems.Parts = _context.Parts.ToList();
        var temp = new CreateSceneModel {
            Scenes = new ScenesModel(),
            Answers = new List<AnswersModel>(),
            partId = partId,
            AllItems = AllItems
        };
        return View(temp);
    }
    [HttpPost]
    public IActionResult CreateScene(CreateSceneModel items)
    {
        if(items.Scenes.text_scene == null)
        {
            items.Scenes.text_scene = string.Empty;
        }
        if (!ModelState.IsValid)
            return View(items);

        // — 1. Зберігаємо фон, якщо є
        if (items.backgroundImage?.Length > 0)
        {
            var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "scene_images");
            Directory.CreateDirectory(imagesFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(items.backgroundImage.FileName)}";
            var filePath = Path.Combine(imagesFolder, fileName);

            using var fs = new FileStream(filePath, FileMode.Create);
            items.backgroundImage.CopyTo(fs);

            items.Scenes.background_scene_img = $"/scene_images/{fileName}";
        }

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
        if (items.preview_scene != -1)
        {
            var temp_preview_scene = _context.Scenes.FirstOrDefault(s => s.id == items.preview_scene);
            _context.Scenes.Update(temp_preview_scene);
        }
        // Після успіху — перекидаємо кудись (наприклад, список сцен)
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

        var previewSceneId = currentScene.id_next_scene;

        var model = new DetailSceneModel
        {
            Scenes = currentScene,
            Answers = answersForScene, // Передаємо список відповідей
            preview_scene = previewSceneId,
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
        scene.id_next_scene = model.preview_scene;

        // Збереження зображення, якщо передано нове
        if (model.backgroundImage != null && model.backgroundImage.Length > 0)
        {
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "іcene_images");
            Directory.CreateDirectory(uploadsDir);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.backgroundImage.FileName);
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                model.backgroundImage.CopyTo(stream);
            }

            scene.background_scene_img = "/іcene_images/" + fileName;
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
}
