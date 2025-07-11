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
document.addEventListener('DOMContentLoaded', function () {

    // --- НОВОЕ: Восстанавливаем состояние плеера при загрузке страницы ---
    function restorePlayerState() {
        const savedStateJSON = localStorage.getItem('musicPlayerState');
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            
            // Если в сохраненном состоянии музыка играла
            if (savedState.isPlaying) {
                isMusicOn = true;
                currentTrackIndex = savedState.trackIndex;
                
                // Загружаем нужный трек, но пока не проигрываем
                loadTrack(currentTrackIndex, false); // `false` означает "не запускать play"
                
                // Устанавливаем сохраненную громкость и позицию
                bgMusic.volume = savedState.volume;
                musicSlider.value = savedState.volume * 100;
                musicVolumeValue.textContent = musicSlider.value;
                
                // Устанавливаем время, но с небольшой задержкой, чтобы файл успел подгрузиться
                bgMusic.addEventListener('canplay', function onCanPlay() {
                    bgMusic.currentTime = savedState.currentTime;
                    bgMusic.play();
                    // Удаляем обработчик, чтобы он не срабатывал каждый раз
                    bgMusic.removeEventListener('canplay', onCanPlay);
                });

                updateMusicButtonUI(); // Обновляем иконки кнопок
            }
        }
    }

    // Измените вашу функцию loadTrack, чтобы она могла не запускать музыку сразу
    function loadTrack(trackIndex, shouldPlay = true) { // Добавляем второй аргумент
        bgMusic.src = playlist[trackIndex].src.replace('~', '');
        const trackTitleText = playlist[trackIndex].title;
        musicTitle.textContent = trackTitleText;
        widgetTrackTitle.textContent = trackTitleText;
        
        if (isMusicOn && shouldPlay) { // Проверяем флаг shouldPlay
            bgMusic.play();
        }
    }

    // --- Функция для применения темы и сохранения выбора ---
    function applyTheme(theme) {
        // Очищаем старые классы тем с <body>
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-contrast');
        // Добавляем новый класс
        if (theme) {
            document.body.classList.add(`theme-${theme}`);
            // Сохраняем выбор в localStorage для перезагрузок
            localStorage.setItem('selectedTheme', theme);
        }
    }
    
    // --- 1. МОДИФИЦИРОВАНАЯ логика для групп кнопок (включая темы) ---
    function setupButtonGroup(selector) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Стандартная логика для переключения класса 'active'
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // --- ДОБАВЛЕНО: Логика смены темы ---
                // Проверяем, является ли кнопка кнопкой темы
                if (this.classList.contains('theme-button')) {
                    const themeKey = this.dataset.langKey; // e.g., "theme_light"
                    if (themeKey) {
                        // Извлекаем название темы (light, dark, contrast)
                        const theme = themeKey.split('_')[1];
                        applyTheme(theme);
                    }
                }
            });
        });
    }

    // Вызываем, как и раньше, для всех групп
    setupButtonGroup('.theme-button');
    setupButtonGroup('.scale-button');
    setupButtonGroup('.lang-button');

    // --- 2. Установка активных состояний и темы при ЗАГРУЗКЕ страницы ---
    function initializeState() {
        // Завантажуємо збережену тему або 'light' за замовчуванням
        const savedTheme = localStorage.getItem('selectedTheme') || 'light';
        applyTheme(savedTheme);

        // Знімаємо 'active' з усіх кнопок теми
        document.querySelectorAll('.theme-button').forEach(btn => btn.classList.remove('active'));

        // Активуємо відповідну тему
        const themeButtonToActivate = document.querySelector(`.theme-button[data-lang-key="theme_${savedTheme}"]`);
        if (themeButtonToActivate) {
            themeButtonToActivate.classList.add('active');
        } else {
            const fallbackBtn = document.querySelector('.theme-button[data-lang-key="theme_light"]');
            if (fallbackBtn) {
                fallbackBtn.classList.add('active');
            }
        }

        // Активуємо масштаб (перевірка, якщо елементи існують)
        const scaleBtn = document.querySelector('.scale-button[data-scale="normal"]');
        if (scaleBtn) {
            scaleBtn.classList.add('active');
        }

        // Активуємо мову
        const langBtn = document.querySelector('.lang-button[data-lang="uk"]');
        if (langBtn) {
            langBtn.classList.add('active');
        }
    }


    // Запускаем инициализацию при загрузке страницы
    initializeState();

    // --- 3. Логика для музыки ---

    // Элементы из меню НАСТРОЕК
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const bgMusic = document.getElementById('bgMusic');
    const musicNextBtn = document.getElementById('musicNext');
    const musicPrevBtn = document.getElementById('musicPrev');
    const musicTitle = document.getElementById('musicTitle');
    const musicSlider = document.getElementById('musicSlider');
    const musicVolumeValue = document.getElementById('musicVolumeValue');

    // Элементы музыкального ВИДЖЕТА
    const widgetTrackTitle = document.getElementById('widgetTrackTitle');
    const widgetPrevBtn = document.getElementById('widgetPrevBtn');
    const widgetPlayPauseBtn = document.getElementById('widgetPlayPauseBtn');
    const widgetNextBtn = document.getElementById('widgetNextBtn');

    let isMusicOn = false;
    let currentTrackIndex = 0;
    const playlist = [
        { title: 'Відпочинок', src: '~/audio/bg.mp3' },
        { title: '8 Кольором', src: '~/audio/bg2.mp3' },
        { title: 'Не дзвонила', src: '~/audio/bg3.mp3' }
    ];

// --- ИЗМЕНЕНО: Создаём общие функции для управления плеером ---

    function togglePlayPause() {
        isMusicOn = !isMusicOn;
        updateMusicButtonUI();
        if (isMusicOn) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    }

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
    }

    function playPrevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
    }


// --- Общие функции для обновления интерфейса ---

    function updateMusicButtonUI() {
        const isPlaying = isMusicOn;
        musicToggleBtn.classList.toggle('active', isPlaying);
        widgetPlayPauseBtn.classList.toggle('playing', isPlaying);
        // Обновление текста для локализации, если нужно
        musicToggleBtn.setAttribute('data-lang-key', isPlaying ? 'music_on' : 'music_off');
    }

    function loadTrack(trackIndex) {
        bgMusic.src = playlist[trackIndex].src.replace('~', '');
        const trackTitleText = playlist[trackIndex].title;
        musicTitle.textContent = trackTitleText;
        widgetTrackTitle.textContent = trackTitleText;
        if (isMusicOn) {
            bgMusic.play();
        }
    }

    function setVolume() {
        bgMusic.volume = musicSlider.value / 100;
        musicVolumeValue.textContent = musicSlider.value;
    }

// --- ИЗМЕНЕНО: Назначаем новые общие функции на все кнопки ---

// Кнопки в НАСТРОЙКАХ
musicToggleBtn.addEventListener('click', togglePlayPause);
musicNextBtn.addEventListener('click', playNextTrack);
musicPrevBtn.addEventListener('click', playPrevTrack);

// Кнопки в ВИДЖЕТЕ
widgetPlayPauseBtn.addEventListener('click', togglePlayPause);
widgetNextBtn.addEventListener('click', playNextTrack);
widgetPrevBtn.addEventListener('click', playPrevTrack);


// Остальные обработчики
musicSlider.addEventListener('input', setVolume);
bgMusic.addEventListener('ended', playNextTrack); // Переключаем на следующий трек по окончании


// И добавьте вместо них это:
    if (!localStorage.getItem('musicPlayerState')) {
        // Если сохраненного состояния нет, запускаем всё по умолчанию
        loadTrack(currentTrackIndex);
        updateMusicButtonUI();
        musicSlider.value = 10; 
        setVolume();
    } else {
        restorePlayerState();
    }

    // --- 7. Логіка відкриття/закриття меню (без изменений) ---
    const settingsLink = document.getElementById('settingsLink');
    const authorsLink = document.getElementById('authorsLink');
    const settingsMenu = document.getElementById('settingsMenu');
    const authorsMenu = document.getElementById('authorsMenu');
    const closeSettingsBtn = document.getElementById('closeSettingsMenu');
    const closeAuthorsBtn = document.getElementById('closeAuthorsMenu');

    function showMenu(menuIdToShow) {
        const allMenus = ['loadMenu', 'settingsMenu', 'authorsMenu', 'achivmentsMenu'];
        allMenus.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            if (id === menuIdToShow) {
                el.classList.remove('hidden');
                setTimeout(() => el.classList.add('active'), 10);
            } else {
                el.classList.remove('active');
                setTimeout(() => el.classList.add('hidden'), 10);
            }
        });
    }

    // --- Кнопки відкриття ---
    document.getElementById('settingsLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showMenu('settingsMenu');
    });

    document.getElementById('authorsLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showMenu('authorsMenu');
    });

    document.getElementById('loadGameLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showMenu('loadMenu');
    });

    document.getElementById('loadAchivmentLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showMenu('achivmentsMenu');
    });

    document.getElementById('continueGameLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Загрузка останнього збереження...');
        window.location.href = '@Url.Action("Index", "PlayGame")';
    });

    // --- Кнопки закриття ---
    document.getElementById('closeSettingsMenu')?.addEventListener('click', () => {
        const el = document.getElementById('settingsMenu');
        el.classList.remove('active');
        setTimeout(() => el.classList.add('hidden'), 10);
    });

    document.getElementById('closeAuthorsMenu')?.addEventListener('click', () => {
        const el = document.getElementById('authorsMenu');
        el.classList.remove('active');
        setTimeout(() => el.classList.add('hidden'), 10);
    });
    function applyTheme(theme) {
    // Удаляем все возможные темы
    document.body.classList.remove('light-theme', 'dark-theme', 'contrast-theme');

    // Добавляем соответствующий класс
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'contrast') {
        document.body.classList.add('contrast-theme');
    }

    localStorage.setItem('selectedTheme', theme);
}
    // Инициализация темы при загрузке страницы
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    applyTheme(savedTheme);


    // --- НОВОЕ: Сохраняем состояние плеера перед уходом со страницы ---
window.addEventListener('beforeunload', () => {
    if (isMusicOn) {
        const playerState = {
            trackIndex: currentTrackIndex,
            currentTime: bgMusic.currentTime,
            volume: bgMusic.volume,
            isPlaying: true
        };
        // Сохраняем объект в localStorage в виде текста
        localStorage.setItem('musicPlayerState', JSON.stringify(playerState));
    } else {
        // Если музыка выключена, просто удаляем сохраненное состояние
        localStorage.removeItem('musicPlayerState');
    }
});

});