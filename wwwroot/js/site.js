// Імпорт необхідних модулів Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// Якщо ви використовували OrbitControls для налагодження, його імпорт тут не потрібен для фінальної версії,
// але якщо ви хочете його залишити для подальшого тестування, додайте:
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// --- Функції прелоадера ---
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function hidePreloader() {
    let preloader = document.querySelector(".preloader");
    if (preloader) {
        preloader.classList.add("preloader--fade");
        setTimeout(() => {
            preloader.classList.add("preloader--hide");
        }, 1500); // Цей час повинен відповідати transition-duration у CSS
    }
}

// --- Налаштування Three.js сцени ---
let scene, camera, renderer, character, headBone;
let mouseX = 0, mouseY = 0; // Зберігають поточні нормалізовані координати курсору
let targetRotationX = new THREE.Vector2(); // Цілі для плавного повороту голови по X
let targetRotationY = new THREE.Vector2(); // Цілі для плавного повороту голови по Y

// Константи для керування рухом голови
const rotationSpeed = 0.002; // Швидкість реакції голови на рух миші
const maxHeadRotation = Math.PI / 10; // Максимальний кут повороту голови в радіанах (приблизно 18 градусів)

// Змінні для відстеження наведення курсору на інтерактивні елементи
let isHoveringMenu = false;
let isHoveringHotBar = false; // Якщо у вас є hot-bar і він повинен блокувати рух голови

function init3DScene() {
    const canvas = document.getElementById('three-js-canvas');
    if (!canvas) {
        console.error("Canvas element for Three.js not found!");
        return;
    }

    // 1. Сцена
    scene = new THREE.Scene();
    // Ви можете встановити фоновий колір сцени, якщо не хочете повністю прозорий канвас
    // scene.background = new THREE.Color(0x1a1a1a); // Темно-сірий фон

    // 2. Рендерер
    // alpha: true - дозволяє прозорість канвасу, щоб бачити HTML під ним
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Встановлює прозорий колір очищення (0 - повна прозорість)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Для чіткішого рендерингу на HiDPI екранах

    // 3. Камера
    // Налаштуйте FOV (перший параметр) для зміни "широти" огляду
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // НАЛАШТУЙТЕ ПОЗИЦІЮ КАМЕРИ АБО ПЕРСОНАЖА!
    // Оскільки меню справа, можливо, персонаж має бути лівіше або камера віддаленіша.
    // Експериментуйте з цими значеннями.
    // Приклад: камера трохи лівіше від центру
    camera.position.set(-2, 1.5, 3); // X, Y, Z (X: вліво/вправо, Y: вгору/вниз, Z: вперед/назад)


    // 4. Освітлення
    // AmbientLight - м'яке освітлення, яке рівномірно освітлює всю сцену
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Колір, інтенсивність
    scene.add(ambientLight);

    // DirectionalLight - світло, що йде з одного напрямку (як сонце)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize(); // Напрямок світла
    scene.add(directionalLight);

    // PointLight - світло, що виходить з однієї точки в усі напрямки (як лампочка)
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 3, 0); // Позиція джерела світла
    scene.add(pointLight);

    // Optional: Додайте інші джерела світла, якщо потрібно покращити вигляд моделі
    // const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
    // rectLight.position.set(5, 5, 5);
    // scene.add(rectLight);


    // 5. Завантаження 3D-моделі
    const loader = new GLTFLoader();
    loader.load(
        '/models/my_character.glb', // <--- ЗМІНІТЬ ЦЕЙ ШЛЯХ ТА НАЗВУ ФАЙЛУ НА ВАШУ МОДЕЛЬ!
        function (gltf) {
            character = gltf.scene;
            scene.add(character);

            // НАЛАШТУЙТЕ МАСШТАБУВАННЯ ТА ПОЗИЦІОНУВАННЯ МОДЕЛІ!
            // Ці значення дуже залежать від розміру вашої моделі та бажаного розміщення
            character.scale.set(1.5, 1.5, 1.5); // Масштабування (X, Y, Z)
            character.position.set(-1.5, -1, 0); // Позиція (X: вліво/вправо, Y: вгору/вниз, Z: вперед/назад)

            // Пошук кістки "голови"
            character.traverse((object) => {
                // Перевіряємо, чи об'єкт є кісткою і має потрібну назву
                // <--- ЦЕЙ РЯДОК ДУЖЕ ВАЖЛИВИЙ! ЗМІНІТЬ 'Head' НА ТОЧНУ НАЗВУ КІСТКИ ГОЛОВИ У ВАШІЙ МОДЕЛІ
                if (object.isBone && object.name === 'Head') { // Приклади назв: 'Head', 'neck_01', 'mixamorigHead', 'Spine2_Head'
                    headBone = object;
                    console.log("Знайдено кістку голови:", headBone.name);
                }
            });

            if (!headBone) {
                console.warn("Кістку голови не знайдено. Рух голови за курсором не буде працювати.");
            }
        },
        // onProgress callback (необов'язково, для індикатора завантаження моделі)
        undefined,
        // onError callback
        function (error) {
            console.error('Помилка завантаження 3D-моделі:', error);
        }
    );

    // Optional: OrbitControls для налагодження (розкоментуйте, якщо потрібно)
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.screenSpacePanning = false;

    // 6. Обробники подій
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Запускаємо анімаційний цикл
    animate();
}

// Функція для обробки зміни розміру вікна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Функція для обробки руху миші
function onDocumentMouseMove(event) {
    // Нормалізуємо координати миші від -1 до 1
    // event.clientX / window.innerWidth дає від 0 до 1, * 2 - 1 дає від -1 до 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Інвертуємо Y, бо у Three.js Y йде вгору
}

// Анімаційний цикл
function animate() {
    requestAnimationFrame(animate); // Запитуємо наступний кадр

    // Optional: Оновлення OrbitControls (розкоментуйте, якщо використовуєте)
    // controls.update();

    if (headBone) {
        // Якщо курсор знаходиться над меню або hot-bar, плавно повертаємо голову в початкове положення (по центру)
        if (isHoveringMenu || isHoveringHotBar) {
            targetRotationY.x = 0; // Ціль для X-координати (зміщення)
            targetRotationX.y = 0; // Ціль для Y-координати (зміщення)
            
            // Плавне повернення до центру, якщо миша над елементом
            headBone.rotation.y += (0 - headBone.rotation.y) * 0.05;
            headBone.rotation.x += (0 - headBone.rotation.x) * 0.05;
        } else {
            // Плавний перехід до цільових кутів повороту, щоб рух був менш різким
            targetRotationY.x += (mouseX - targetRotationY.x) * 0.05; // Для повороту по осі Y (вліво/вправо)
            targetRotationX.y += (mouseY - targetRotationX.y) * 0.05; // Для повороту по осі X (вгору/вниз)

            // Обмежуємо максимальний поворот голови, щоб не було неприродних рухів
            const clampedRotY = Math.max(-maxHeadRotation, Math.min(maxHeadRotation, targetRotationY.x * rotationSpeed));
            const clampedRotX = Math.max(-maxHeadRotation, Math.min(maxHeadRotation, targetRotationX.y * rotationSpeed));

            // Застосовуємо поворот до кістки голови
            // ЗНАКИ та ОСІ МОЖУТЬ ВІДРІЗНЯТИСЯ ЗАЛЕЖНО ВІД ОРІЄНТАЦІЇ ВАШОЇ МОДЕЛІ!
            // Експериментуйте з headBone.rotation.x, headBone.rotation.y, headBone.rotation.z
            // та знаками + або - для коректного руху.
            headBone.rotation.y = clampedRotY; // Поворот вліво/вправо
            headBone.rotation.x = -clampedRotX; // Поворот вгору/вниз (часто потрібно інвертувати Y для відчуття "вгору")
            // headBone.rotation.z = ... якщо потрібен нахил голови
        }
    }

    renderer.render(scene, camera); // Рендеримо сцену
}

// --- Основна логіка DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Ініціалізуємо 3D-сцену одразу після завантаження DOM
    init3DScene();

    // 2. Логіка прелоадера
    document.documentElement.style.overflow = "hidden"; // Забороняємо прокрутку на HTML-елементі
    document.body.classList.add('lock-scroll'); // Додаємо клас для блокування скролу, якщо потрібно для інших ефектів

    const imgs = document.querySelectorAll('img, video'); // Отримати всі зображення та відео на сторінці
    let loadedCount = 0;

    const intprochentChet = document.getElementById("intprochent_chet");
    const perchenload = document.getElementById("perchenload");

    const updateProgress = () => {
        loadedCount++;
        let percent = ((loadedCount * 100) / imgs.length).toFixed(0);

        if (intprochentChet) {
            intprochentChet.innerHTML = `${percent}%`;
        }
        if (perchenload) {
            perchenload.style.width = `${percent}%`;
        }

        // Якщо всі ресурси завантажені
        if (loadedCount === imgs.length) {
            setTimeout(() => {
                document.body.classList.remove('lock-scroll');
                document.documentElement.style.overflow = "visible"; // Дозволяємо прокрутку після завантаження
                hidePreloader(); // Приховуємо прелоадер
            }, 1500); // Затримка перед приховуванням прелоадера
        }
    };

    // Якщо на сторінці немає зображень/відео, приховати прелоадер одразу
    if (imgs.length === 0) {
        setTimeout(() => {
            document.body.classList.remove('lock-scroll');
            document.documentElement.style.overflow = "visible";
            hidePreloader();
        }, 500);
    } else {
        // Інакше чекаємо завантаження всіх зображень
        imgs.forEach((img) => {
            if (img.complete) {
                updateProgress();
            } else {
                img.onload = updateProgress;
                img.onerror = updateProgress; // Обробка помилок завантаження
            }
        });
    }

    // --- Логіка відстеження наведення курсору на елементи інтерфейсу ---
    const menuContainer = document.querySelector('.menu-container');
    if (menuContainer) {
        menuContainer.addEventListener('mouseenter', () => {
            isHoveringMenu = true;
        });
        menuContainer.addEventListener('mouseleave', () => {
            isHoveringMenu = false;
        });
    }

    const hotBar = document.querySelector('.layer-hot-bar'); // Зверніть увагу, що це .layer-hot-bar, а не .hot-bar-inner
    if (hotBar) {
        hotBar.addEventListener('mouseenter', () => {
            isHoveringHotBar = true;
        });
        hotBar.addEventListener('mouseleave', () => {
            isHoveringHotBar = false;
        });
    }
    // В site.js, всередині DOMContentLoaded, після hidePreloader()
const bgMusic = document.getElementById('background-music');
if (bgMusic) {
    // Автоматичне відтворення може бути заблоковано браузерами,
    // тому краще додати кнопку "грати" або запустити після першої взаємодії користувача
    // Для демо можна спробувати:
    setTimeout(() => { // Запуск через невелику затримку після приховування прелоадера
        bgMusic.volume = 0.5; // Налаштуйте гучність
        bgMusic.play().catch(e => console.error("Could not play music:", e));
    }, 1500); // Після завершення анімації приховування прелоадера
}

// Звукові ефекти для кнопок:
const menuItems = document.querySelectorAll('.menu-item');
const hoverSound = new Audio('~/audio/hover_effect.mp3'); // Створіть такий файл
const clickSound = new Audio('~/audio/click_effect.mp3'); // Створіть такий файл

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        hoverSound.play();
    });
    item.addEventListener('click', () => {
        clickSound.play();
    });
});
});