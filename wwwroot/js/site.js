// Game menu functions
function showGameMenu() {
    document.getElementById('gameMenuOverlay').style.display = 'block';
    document.getElementById('gameMenu').style.display = 'block';
}

function hideGameMenu() {
    document.getElementById('gameMenuOverlay').style.display = 'none';
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('saveSlots').style.display = 'none';
    document.getElementById('saveNameInput').style.display = 'none';
}

function showSaveSlots() {
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('saveSlots').style.display = 'block';
}

function showSaveNameInput(slot) {
    document.getElementById('selectedSlot').value = slot;
    document.getElementById('saveSlots').style.display = 'none';
    document.getElementById('saveNameInput').style.display = 'block';
}

function saveGame() {
    const slot = document.getElementById('selectedSlot').value;
    const name = document.getElementById('saveName').value;
    // TODO: Implement save functionality
    hideGameMenu();
}

function loadGame() {
    // Basic placeholder implementation for load functionality
    alert('Load game functionality is not yet implemented.');
    hideGameMenu();
}

function openSettings() {
    // Basic placeholder implementation for settings functionality
    alert('Settings functionality is not yet implemented.');
    hideGameMenu();
}

function goToMainMenu() {
    window.location.href = '/';
}

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

    // Масштабирование всех меню
    function applyMenuScale(scale) {
        const scaleValue = scale === 'small' ? 0.85 : scale === 'large' ? 1.18 : 1;
        document.querySelectorAll('.menu-container, .settings-menu-container, .authors-menu-container').forEach(el => {
            el.style.transform = `scale(${scaleValue})`;
            el.style.transformOrigin = 'top left';
        });
    }

    function setScale(scale) {
        // Удаляем все классы масштаба
        body.classList.remove('scale-small', 'scale-normal', 'scale-large');
        body.classList.add('scale-' + scale);
        localStorage.setItem('novel_scale', scale);
        scaleButtons.forEach(btn => {
            btn.classList.toggle('active', btn.id === 'scale' + scale.charAt(0).toUpperCase() + scale.slice(1));
        });
        applyMenuScale(scale);
        updateScaleLabel(scale);
    }
    // При загрузке страницы применяем масштаб
    let savedScale = localStorage.getItem('novel_scale');
    if (!savedScale) savedScale = 'normal';
    setScale(savedScale);
    if (scaleSmallBtn) scaleSmallBtn.onclick = () => setScale('small');
    if (scaleNormalBtn) scaleNormalBtn.onclick = () => setScale('normal');
    if (scaleLargeBtn) scaleLargeBtn.onclick = () => setScale('large');

    // --- Плавное открытие/закрытие меню и подменю как всплывающее окно ---
    function showMenu(menu) {
        // Если меню уже активно — скрыть его
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
            setTimeout(() => menu.classList.add('hidden'), 300);
            return;
        }
        // Скрыть все меню
        document.querySelectorAll('.settings-menu-container, .authors-menu-container').forEach(el => {
            el.classList.remove('active');
            setTimeout(() => el.classList.add('hidden'), 300);
        });
        // Показать выбранное меню
        menu.classList.remove('hidden');
        setTimeout(() => menu.classList.add('active'), 10);
        // Позиционируем справа от экрана (а не от главного меню)
        menu.style.position = 'fixed';
        menu.style.left = 'calc(50vw + 60px)';
        menu.style.top = '60px';
        menu.style.right = '40px';
        menu.style.zIndex = 100;
        menu.style.maxWidth = '420px';
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

    if (settingsLink && settingsMenu) {
        settingsLink.onclick = e => {
            e.preventDefault();
            // Снять активность со всех .menu-item
            document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
            // Если меню уже открыто, закрыть и убрать активность
            if (settingsMenu.classList.contains('active')) {
                settingsMenu.classList.remove('active');
                setTimeout(() => settingsMenu.classList.add('hidden'), 300);
            } else {
                settingsLink.classList.add('active');
                showMenu(settingsMenu);
            }
        };
    }
    if (authorsLink && authorsMenu) {
        authorsLink.onclick = e => {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
            if (authorsMenu.classList.contains('active')) {
                authorsMenu.classList.remove('active');
                setTimeout(() => authorsMenu.classList.add('hidden'), 300);
            } else {
                authorsLink.classList.add('active');
                showMenu(authorsMenu);
            }
        };
    }
    if (closeSettingsMenu) closeSettingsMenu.onclick = function() {
        hideMenus();
        // Снять активность с кнопки меню "Настройки"
        if (settingsLink) settingsLink.classList.remove('active');
        // Снять активность со всех .menu-item (убрать наведение)
        document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    };
    if (closeAuthorsMenu) closeAuthorsMenu.onclick = function() {
        hideMenus();
        // Снять активность с кнопки меню "Авторы"
        if (authorsLink) authorsLink.classList.remove('active');
        document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    };
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideMenus();
            // Снять активность с кнопок меню
            if (settingsLink) settingsLink.classList.remove('active');
            if (authorsLink) authorsLink.classList.remove('active');
            document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
        }
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
            music_author: 'Музика:',
            // Кнопки музыки
            music_on: 'Включити',
            music_off: 'Вимкнути',
            // Кнопки мелодий
            prev: 'Назад',
            next: 'Вперед',
            // Кнопки масштаба
            scale_small: 'ДРІБНИЙ',
            scale_normal: 'ЗВИЧАЙНИЙ',
            scale_large: 'ВЕЛИКИЙ',
            // Кнопки темы
            theme_light_btn: 'СВІТЛА',
            theme_dark_btn: 'ТЕМНА'
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
            music_author: 'Музыка:',
            // Кнопки музыки
            music_on: 'Включить',
            music_off: 'Выключить',
            // Кнопки мелодий
            prev: 'Назад',
            next: 'Вперёд',
            // Кнопки масштаба
            scale_small: 'МЕЛКИЙ',
            scale_normal: 'ОБЫЧНЫЙ',
            scale_large: 'КРУПНЫЙ',
            // Кнопки темы
            theme_light_btn: 'СВЕТЛАЯ',
            theme_dark_btn: 'ТЁМНАЯ'
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
            music_author: 'Music:',
            // Кнопки музыки
            music_on: 'Turn On',
            music_off: 'Turn Off',
            // Кнопки мелодий
            prev: 'Prev',
            next: 'Next',
            // Кнопки масштаба
            scale_small: 'SMALL',
            scale_normal: 'NORMAL',
            scale_large: 'LARGE',
            // Кнопки темы
            theme_light_btn: 'LIGHT',
            theme_dark_btn: 'DARK'
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
        // Кнопки музыки
        const musicOnBtn = document.getElementById('musicOnBtn');
        const musicOffBtn = document.getElementById('musicOffBtn');
        if (musicOnBtn) musicOnBtn.textContent = translations[lang].music_on;
        if (musicOffBtn) musicOffBtn.textContent = translations[lang].music_off;
        // Кнопки масштабов
        const scaleSmallBtn = document.getElementById('scaleSmall');
        const scaleNormalBtn = document.getElementById('scaleNormal');
        const scaleLargeBtn = document.getElementById('scaleLarge');
        if (scaleSmallBtn) scaleSmallBtn.textContent = translations[lang].scale_small;
        if (scaleNormalBtn) scaleNormalBtn.textContent = translations[lang].scale_normal;
        if (scaleLargeBtn) scaleLargeBtn.textContent = translations[lang].scale_large;
        // Кнопки тем
        const themeLightBtn = document.getElementById('themeLight');
        const themeDarkBtn = document.getElementById('themeDark');
        if (themeLightBtn) themeLightBtn.textContent = translations[lang].theme_light_btn;
        if (themeDarkBtn) themeDarkBtn.textContent = translations[lang].theme_dark_btn;
        // Кнопки мелодий (если хотите перевести)
        const musicPrev = document.getElementById('musicPrev');
        const musicNext = document.getElementById('musicNext');
        if (musicPrev) musicPrev.textContent = translations[lang].prev || '<';
        if (musicNext) musicNext.textContent = translations[lang].next || '>';
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
    const melodies = ['Мелодія-1', 'Мелодія-2', 'Мелодія-3'];
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

    // --- ИГРОВЫЕ КНОПКИ ---
    // Обработчики для кнопок игры
    const gameButtons = document.querySelectorAll('[data-lang-key="peaceful_mode"], [data-lang-key="new_game"]');
    gameButtons.forEach(button => {
        if (button.tagName === 'A' && button.href && button.href.includes('PlayGame')) {
            // Кнопка уже имеет правильную ссылку, ничего не делаем
            return;
        }
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Перенаправляем на игру
            window.location.href = '/PlayGame/Index';
        });
    });
});
