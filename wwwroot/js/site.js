document.addEventListener('DOMContentLoaded', function() {
    // --- Тема ---
    const themeLightBtn = document.getElementById('themeLight');
    const themeDarkBtn = document.getElementById('themeDark');
    const body = document.body;

    function setTheme(theme) {
        body.classList.remove('theme-light', 'theme-dark');
        if (theme === 'dark') {
            body.classList.add('theme-dark');
        } else {
            body.classList.add('theme-light');
        }
        localStorage.setItem('novel_theme', theme);
    }
    // Инициализация темы
    let savedTheme = localStorage.getItem('novel_theme');
    if (!savedTheme) savedTheme = 'light';
    setTheme(savedTheme);

    if (themeLightBtn) themeLightBtn.onclick = () => setTheme('light');
    if (themeDarkBtn) themeDarkBtn.onclick = () => setTheme('dark');

    // --- Масштаб ---
    const scaleSmallBtn = document.getElementById('scaleSmall');
    const scaleNormalBtn = document.getElementById('scaleNormal');
    const scaleLargeBtn = document.getElementById('scaleLarge');
    const scaleButtons = document.querySelectorAll('.scale-button');
    const scaleCurrentLabel = document.getElementById('scaleCurrentLabel');
    // Для локализации подписи масштаба
    const scaleLabels = {
        small: { uk: 'Дрібний', ru: 'Мелкий', en: 'Small' },
        normal: { uk: 'Звичайний', ru: 'Обычный', en: 'Normal' },
        large: { uk: 'Великий', ru: 'Крупный', en: 'Large' }
    };

    function updateScaleLabel(scale) {
        if (scaleCurrentLabel) {
            let lang = localStorage.getItem('novel_lang') || 'uk';
            scaleCurrentLabel.textContent = scaleLabels[scale] ? scaleLabels[scale][lang] : '';
        }
    }

    function setScale(scale) {
        // Удаляем все классы масштаба
        body.classList.remove('scale-small', 'scale-normal', 'scale-large');
        body.classList.add('scale-' + scale);
        localStorage.setItem('novel_scale', scale);
        scaleButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === 'scale' + scale.charAt(0).toUpperCase() + scale.slice(1));
        });
        // Меняем масштаб всех меню через transform: scale()
        const scaleValue = scale === 'small' ? 0.85 : scale === 'large' ? 1.18 : 1;
        document.querySelectorAll('.menu-container, .settings-menu-container, .authors-menu-container').forEach(el => {
            el.style.transform = `scale(${scaleValue})`;
            el.style.transformOrigin = 'top left';
        });
        updateScaleLabel(scale);
    }
    let savedScale = localStorage.getItem('novel_scale');
    if (!savedScale) savedScale = 'normal';
    setScale(savedScale);
    if (scaleSmallBtn) scaleSmallBtn.onclick = () => setScale('small');
    if (scaleNormalBtn) scaleNormalBtn.onclick = () => setScale('normal');
    if (scaleLargeBtn) scaleLargeBtn.onclick = () => setScale('large');

    // --- Плавное открытие/закрытие меню и подменю как всплывающее окно ---
    function showMenu(menu) {
        document.querySelectorAll('.settings-menu-container, .authors-menu-container').forEach(el => el.classList.add('hidden'));
        if (menu) {
            menu.classList.remove('hidden');
            menu.classList.add('active');
            // Позиционируем справа от экрана (а не от главного меню)
            menu.style.position = 'fixed';
            menu.style.left = 'calc(50vw + 60px)';
            menu.style.top = '60px';
            menu.style.right = '40px';
            menu.style.zIndex = 100;
            menu.style.maxWidth = '420px';
        }
    }
    function hideMenus() {
        document.querySelectorAll('.settings-menu-container, .authors-menu-container').forEach(el => {
            el.classList.remove('active');
            setTimeout(() => el.classList.add('hidden'), 300);
        });
    }
    // Кнопки меню
    const settingsLink = document.getElementById('settingsLink');
    const authorsLink = document.getElementById('authorsLink');
    const settingsMenu = document.getElementById('settingsMenu');
    const authorsMenu = document.getElementById('authorsMenu');
    const closeSettingsMenu = document.getElementById('closeSettingsMenu');
    const closeAuthorsMenu = document.getElementById('closeAuthorsMenu');
    if (settingsLink && settingsMenu) settingsLink.onclick = e => { e.preventDefault(); showMenu(settingsMenu); };
    if (authorsLink && authorsMenu) authorsLink.onclick = e => { e.preventDefault(); showMenu(authorsMenu); };
    if (closeSettingsMenu) closeSettingsMenu.onclick = hideMenus;
    if (closeAuthorsMenu) closeAuthorsMenu.onclick = hideMenus;
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideMenus();
    });

    // --- Язык ---
    const langButtons = document.querySelectorAll('.lang-button');
    const languageValue = document.getElementById('languageValue');
    // --- Локализация ---
    const translations = {
        uk: {
            peaceful_mode: 'МИРНИЙ РЕЖИМ',
            continue_game: 'ПРОДОВЖИТИ',
            new_game: 'НОВА ГРА',
            load_game: 'ЗАВАНТАЖИТИ',
            characters: 'ПЕРСОНАЖІ',
            clothes: 'ОДЯГ',
            settings: 'НАЛАШТУВАННЯ',
            achievements: 'ДОСЯГНЕННЯ',
            authors: 'АВТОРИ',
            language: 'Мова',
            voiceover: 'Озвучка',
            exit: 'ВИХІД',
            settings_title: 'НАЛАШТУВАННЯ',
            interface_themes: 'ТЕМИ ІНТЕРФЕЙСУ',
            theme_light: 'СВІТЛА',
            theme_dark: 'ТЕМНА',
            interface_scale: 'МАСШТАБ ІНТЕРФЕЙСУ',
            music: 'МУЗИКА',
            close: 'ЗАКРИТИ',
            authors_novel_title: 'АВТОРИ НОВЕЛИ',
            scenario_writer: 'Сценарист:',
            artist: 'Художник:',
            programmer: 'Програміст:',
            music_author: 'Музика:'
        },
        ru: {
            peaceful_mode: 'МИРНЫЙ РЕЖИМ',
            continue_game: 'ПРОДОЛЖИТЬ',
            new_game: 'НОВАЯ ИГРА',
            load_game: 'ЗАГРУЗИТЬ',
            characters: 'ПЕРСОНАЖИ',
            clothes: 'ОДЕЖДА',
            settings: 'НАСТРОЙКИ',
            achievements: 'ДОСТИЖЕНИЯ',
            authors: 'АВТОРЫ',
            language: 'Язык',
            voiceover: 'Озвучка',
            exit: 'ВЫХОД',
            settings_title: 'НАСТРОЙКИ',
            interface_themes: 'ТЕМЫ ИНТЕРФЕЙСА',
            theme_light: 'СВЕТЛАЯ',
            theme_dark: 'ТЁМНАЯ',
            interface_scale: 'МАСШТАБ ИНТЕРФЕЙСА',
            music: 'МУЗЫКА',
            close: 'ЗАКРЫТЬ',
            authors_novel_title: 'АВТОРЫ НОВЕЛЛЫ',
            scenario_writer: 'Сценарист:',
            artist: 'Художник:',
            programmer: 'Программист:',
            music_author: 'Музыка:'
        },
        en: {
            peaceful_mode: 'PEACEFUL MODE',
            continue_game: 'CONTINUE',
            new_game: 'NEW GAME',
            load_game: 'LOAD',
            characters: 'CHARACTERS',
            clothes: 'CLOTHES',
            settings: 'SETTINGS',
            achievements: 'ACHIEVEMENTS',
            authors: 'AUTHORS',
            language: 'Language',
            voiceover: 'Voiceover',
            exit: 'EXIT',
            settings_title: 'SETTINGS',
            interface_themes: 'INTERFACE THEMES',
            theme_light: 'LIGHT',
            theme_dark: 'DARK',
            interface_scale: 'INTERFACE SCALE',
            music: 'MUSIC',
            close: 'CLOSE',
            authors_novel_title: 'NOVEL AUTHORS',
            scenario_writer: 'Scenario:',
            artist: 'Artist:',
            programmer: 'Programmer:',
            music_author: 'Music:'
        }
    };
    function updateLangUI(lang) {
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        // Кнопки языка
        langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        // Главная подпись
        if (languageValue) {
            languageValue.textContent =
                lang === 'uk' ? 'Українська' :
                lang === 'ru' ? 'Російська' :
                lang === 'en' ? 'Англійська' : '';
        }
        updateScaleLabel(localStorage.getItem('novel_scale') || 'normal');
    }
    function setLang(lang) {
        localStorage.setItem('novel_lang', lang);
        updateLangUI(lang);
    }
    let savedLang = localStorage.getItem('novel_lang') || 'uk';
    setLang(savedLang);
    langButtons.forEach(btn => {
        btn.onclick = () => setLang(btn.dataset.lang);
    });

    // --- Озвучка (аналогично языку, если нужно) ---
    // Можно добавить аналогичный блок для voiceoverValue

    // --- Музыка ---
    const musicToggle = document.getElementById('musicToggle');
    const musicSlider = document.getElementById('musicSlider');
    const musicVolumeValue = document.getElementById('musicVolumeValue');
    const musicTitle = document.getElementById('musicTitle');
    const musicPrev = document.getElementById('musicPrev');
    const musicNext = document.getElementById('musicNext');
    // Пример мелодий
    const melodies = ['МЕЛОДІЯ 1', 'МЕЛОДІЯ 2', 'МЕЛОДІЯ 3'];
    let melodyIndex = Number(localStorage.getItem('novel_melody') || 0);
    let musicOn = localStorage.getItem('novel_music_on') === 'true';
    let musicVolume = Number(localStorage.getItem('novel_music_volume') || 50);

    // --- Музыка: подключение к аудио --- 
    let audio = document.getElementById('bgMusic');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'bgMusic';
        audio.loop = true;
        document.body.appendChild(audio);
    }
    // Пути к мелодиям (замените на свои файлы)
    const melodyFiles = [
        '/audio/bg.mp3',
        '/audio/bg2.mp3',
        '/audio/bg3.mp3'
    ];
    // --- Музыка: не выключается при смене мелодии ---
    function playMusic(forceChange = false) {
        if (musicOn) {
            let newSrc = melodyFiles[melodyIndex].startsWith('http') ? melodyFiles[melodyIndex] : window.location.origin + melodyFiles[melodyIndex];
            // Меняем src только если другая мелодия или явно требуется сменить
            if (forceChange || !audio.src.endsWith(melodyFiles[melodyIndex])) {
                audio.src = melodyFiles[melodyIndex];
                audio.load();
                audio.volume = musicVolume / 100;
                audio.play();
            } else {
                audio.volume = musicVolume / 100;
                if (audio.paused) audio.play();
            }
        } else {
            audio.pause();
        }
    }

    // --- Две кнопки: Включити/Вимкнути ---
    const musicOnBtn = document.getElementById('musicOnBtn');
    const musicOffBtn = document.getElementById('musicOffBtn');
    function updateMusicButtons() {
        if (musicOnBtn && musicOffBtn) {
            if (musicOn) {
                musicOnBtn.style.display = 'none';
                musicOffBtn.style.display = '';
            } else {
                musicOnBtn.style.display = '';
                musicOffBtn.style.display = 'none';
            }
        }
    }

    function updateMusicUI() {
        updateMusicButtons();
        musicSlider.value = musicVolume;
        musicVolumeValue.textContent = musicVolume;
        musicTitle.textContent = melodies[melodyIndex];
        playMusic();
        localStorage.setItem('novel_music_on', musicOn);
        localStorage.setItem('novel_music_volume', musicVolume);
        localStorage.setItem('novel_melody', melodyIndex);
    }

    if (musicOnBtn) {
        musicOnBtn.onclick = () => {
            musicOn = true;
            updateMusicUI();
        };
    }
    if (musicOffBtn) {
        musicOffBtn.onclick = () => {
            musicOn = false;
            updateMusicUI();
        };
    }
    if (musicPrev) {
        musicPrev.onclick = () => {
            melodyIndex = (melodyIndex - 1 + melodies.length) % melodies.length;
            localStorage.setItem('novel_melody', melodyIndex);
            if (musicOn) {
                playMusic(true);
            }
            updateMusicUI();
        };
    }
    if (musicNext) {
        musicNext.onclick = () => {
            melodyIndex = (melodyIndex + 1) % melodies.length;
            localStorage.setItem('novel_melody', melodyIndex);
            if (musicOn) {
                playMusic(true);
            }
            updateMusicUI();
        };
    }
    if (musicSlider) {
        musicSlider.oninput = (e) => {
            musicVolume = Number(e.target.value);
            audio.volume = musicVolume / 100;
            musicVolumeValue.textContent = musicVolume;
            localStorage.setItem('novel_music_volume', musicVolume);
        };
    }
    updateMusicUI();
    if (musicOn) playMusic();

    // --- ВЫХОД ---
    const exitLabel = document.getElementById('exitLabel');
    if (exitLabel) {
        exitLabel.onclick = () => {
            window.open('', '_self');
            window.close();
            setTimeout(() => { window.location.href = 'about:blank'; }, 200);
        };
        exitLabel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') exitLabel.click();
        });
    }

    // Dream.EXE меню: отображение/скрытие окон
    (function () {
        // Кнопки
        var settingsLink = document.getElementById('settingsLink');
        var authorsLink = document.getElementById('authorsLink');
        var closeSettingsMenu = document.getElementById('closeSettingsMenu');
        var closeAuthorsMenu = document.getElementById('closeAuthorsMenu');
        var settingsMenu = document.getElementById('settingsMenu');
        var authorsMenu = document.getElementById('authorsMenu');

        // Открыть настройки
        if (settingsLink && settingsMenu) {
            settingsLink.addEventListener('click', function (e) {
                e.preventDefault();
                settingsMenu.classList.add('active');
                settingsMenu.classList.remove('hidden');
                if (authorsMenu) authorsMenu.classList.remove('active', 'hidden');
            });
        }
        // Открыть авторов
        if (authorsLink && authorsMenu) {
            authorsLink.addEventListener('click', function (e) {
                e.preventDefault();
                authorsMenu.classList.add('active');
                authorsMenu.classList.remove('hidden');
                if (settingsMenu) settingsMenu.classList.remove('active', 'hidden');
            });
        }
        // Закрыть настройки
        if (closeSettingsMenu && settingsMenu) {
            closeSettingsMenu.addEventListener('click', function () {
                settingsMenu.classList.remove('active');
                setTimeout(function () { settingsMenu.classList.add('hidden'); }, 300);
            });
        }
        // Закрыть авторов
        if (closeAuthorsMenu && authorsMenu) {
            closeAuthorsMenu.addEventListener('click', function () {
                authorsMenu.classList.remove('active');
                setTimeout(function () { authorsMenu.classList.add('hidden'); }, 300);
            });
        }
        // ESC закрывает окна
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (settingsMenu) settingsMenu.classList.remove('active');
                if (authorsMenu) authorsMenu.classList.remove('active');
                setTimeout(function () {
                    if (settingsMenu) settingsMenu.classList.add('hidden');
                    if (authorsMenu) authorsMenu.classList.add('hidden');
                }, 300);
            }
        });

        // Масштаб интерфейса
        var scaleBtns = document.querySelectorAll('.scale-button');
        Array.prototype.forEach.call(scaleBtns, function(btn) {
            btn.addEventListener('click', function () {
                document.body.classList.remove('scale-small', 'scale-normal', 'scale-large');
                if (btn.dataset.scale === 'small') document.body.classList.add('scale-small');
                if (btn.dataset.scale === 'normal') document.body.classList.add('scale-normal');
                if (btn.dataset.scale === 'large') document.body.classList.add('scale-large');
                Array.prototype.forEach.call(scaleBtns, function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        });

        // Темы интерфейса
        var themeLight = document.getElementById('themeLight');
        var themeDark = document.getElementById('themeDark');
        if (themeLight) themeLight.addEventListener('click', function () {
            document.body.classList.remove('theme-dark');
            themeLight.classList.add('active');
            if (themeDark) themeDark.classList.remove('active');
        });
        if (themeDark) themeDark.addEventListener('click', function () {
            document.body.classList.add('theme-dark');
            themeDark.classList.add('active');
            if (themeLight) themeLight.classList.remove('active');
        });

        // Язык интерфейса (пример, можно доработать)
        var langBtns = document.querySelectorAll('.lang-button');
        Array.prototype.forEach.call(langBtns, function(btn) {
            btn.addEventListener('click', function () {
                Array.prototype.forEach.call(langBtns, function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        });

        // Музыка (пример)
        var musicToggle = document.getElementById('musicToggle');
        var musicSlider = document.getElementById('musicSlider');
        var musicVolumeValue = document.getElementById('musicVolumeValue');
        var bgMusic = document.getElementById('bgMusic');
        if (musicToggle && musicSlider && bgMusic) {
            musicToggle.addEventListener('click', function () {
                if (bgMusic.paused) {
                    bgMusic.volume = musicSlider.value / 100;
                    bgMusic.play();
                    musicToggle.textContent = 'УВІМКНЕНО';
                    musicToggle.classList.add('active');
                } else {
                    bgMusic.pause();
                    musicToggle.textContent = 'ВИМКНУТО';
                    musicToggle.classList.remove('active');
                }
            });
            musicSlider.addEventListener('input', function () {
                bgMusic.volume = musicSlider.value / 100;
                musicVolumeValue.textContent = musicSlider.value;
            });
        }
    })();

    // --- Адаптация меню для разных экранов ---
    function adaptMenus() {
        // Главный контейнер меню
        const menuContainer = document.querySelector('.menu-container');
        const settingsMenu = document.getElementById('settingsMenu');
        const authorsMenu = document.getElementById('authorsMenu');
        // Получаем ширину экрана
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        // Главный блок
        if (menuContainer) {
            if (vw < 600) {
                menuContainer.style.width = '95vw';
                menuContainer.style.left = '2.5vw';
                menuContainer.style.top = '10px';
                menuContainer.style.maxWidth = 'none';
                menuContainer.style.borderRadius = '18px';
            } else if (vw < 900) {
                menuContainer.style.width = '340px';
                menuContainer.style.left = '30px';
                menuContainer.style.top = '30px';
                menuContainer.style.maxWidth = '90vw';
                menuContainer.style.borderRadius = '20px';
            } else {
                menuContainer.style.width = '320px';
                menuContainer.style.left = '40px';
                menuContainer.style.top = '40px';
                menuContainer.style.maxWidth = '360px';
                menuContainer.style.borderRadius = '22px';
            }
        }
        // Настройки/авторы
        [settingsMenu, authorsMenu].forEach(menu => {
            if (menu) {
                if (vw < 600) {
                    menu.style.position = 'fixed';
                    menu.style.left = '2.5vw';
                    menu.style.top = '60px';
                    menu.style.right = '2.5vw';
                    menu.style.maxWidth = '95vw';
                    menu.style.borderRadius = '18px';
                } else if (vw < 900) {
                    menu.style.position = 'fixed';
                    menu.style.left = 'calc(50vw - 160px)';
                    menu.style.top = '60px';
                    menu.style.right = '30px';
                    menu.style.maxWidth = '420px';
                    menu.style.borderRadius = '20px';
                } else {
                    menu.style.position = 'fixed';
                    menu.style.left = 'calc(50vw + 60px)';
                    menu.style.top = '60px';
                    menu.style.right = '40px';
                    menu.style.maxWidth = '420px';
                    menu.style.borderRadius = '22px';
                }
            }
        });
    }
    window.addEventListener('resize', adaptMenus);
    adaptMenus();

    // Всё управление адаптацией и плавностью реализовано через CSS transitions и keyframes.
    // JS только добавляет/убирает класс .hidden для плавного появления/скрытия меню и подменю.
});