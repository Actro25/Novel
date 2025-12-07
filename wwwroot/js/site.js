document.addEventListener('DOMContentLoaded', function () {

    // --- 1. ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ И КОНСТАНТ ---

    // Меню и оверлеи
    const gameMenuOverlay = document.getElementById('gameMenuOverlay');
    const gameMenu = document.getElementById('gameMenu');
    const saveSlots = document.getElementById('saveSlots');
    const saveNameInput = document.getElementById('saveNameInput');

    const settingsMenu = document.getElementById('settingsMenu');
    const authorsMenu = document.getElementById('authorsMenu');
    const loadMenu = document.getElementById('loadMenu');
    const achivmentsMenu = document.getElementById('achivmentsMenu');

    // Кнопки открытия/закрытия меню
    const settingsLink = document.getElementById('settingsLink');
    const authorsLink = document.getElementById('authorsLink');
    const loadGameLink = document.getElementById('loadGameLink');
    const loadAchivmentLink = document.getElementById('loadAchivmentLink');
    const continueGameLink = document.getElementById('continueGameLink');

    const closeSettingsBtn = document.getElementById('closeSettingsMenu');
    const closeAuthorsBtn = document.getElementById('closeAuthorsMenu');
    // Предполагаем, что у других меню тоже есть кнопки закрытия
    // const closeLoadBtn = document.getElementById('closeLoadMenu');
    // const closeAchivmentsBtn = document.getElementById('closeAchivmentsMenu');

    // Элементы управления музыкой (Настройки)
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const bgMusic = document.getElementById('bgMusic');
    const musicNextBtn = document.getElementById('musicNext');
    const musicPrevBtn = document.getElementById('musicPrev');
    const musicTitle = document.getElementById('musicTitle');
    const musicSlider = document.getElementById('musicSlider');
    const musicVolumeValue = document.getElementById('musicVolumeValue');

    // Элементы управления музыкой (Виджет)
    const widgetTrackTitle = document.getElementById('widgetTrackTitle');
    const widgetPrevBtn = document.getElementById('widgetPrevBtn');
    const widgetPlayPauseBtn = document.getElementById('widgetPlayPauseBtn');
    const widgetNextBtn = document.getElementById('widgetNextBtn');

    // Состояние плеера
    let isMusicOn = false;
    let currentTrackIndex = 0;
    const playlist = [
        { title: 'Відпочинок', src: '~/audio/bg.mp3' },
        { title: '8 Кольором', src: '~/audio/bg2.mp3' },
        { title: 'Не дзвонила', src: '~/audio/bg3.mp3' }
    ];


    // --- 2. ВСЕ ФУНКЦИИ ---

    /**
     * Показывает указанное меню, скрывая все остальные.
     * @param {string} menuIdToShow - ID элемента меню, которое нужно показать.
     */
    function showMenu(menuIdToShow) {
        const allMenus = ['loadMenu', 'settingsMenu', 'authorsMenu', 'achivmentsMenu'];
        allMenus.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            if (id === menuIdToShow) {
                el.classList.remove('hidden');
                setTimeout(() => el.classList.add('active'), 10); // для анимации
            } else {
                el.classList.remove('active');
                setTimeout(() => el.classList.add('hidden'), 10);
            }
        });
    }

    /**
     * Закрывает указанное меню.
     * @param {string} menuIdToHide - ID элемента меню, которое нужно скрыть.
     */
    function hideMenu(menuIdToHide) {
        const el = document.getElementById(menuIdToHide);
        if (el) {
            el.classList.remove('active');
            setTimeout(() => el.classList.add('hidden'), 10); // соответствует логике showMenu
        }
    }

    /**
     * Применяет выбранную тему (light, dark, contrast) и сохраняет выбор.
     * @param {string} theme - Название темы.
     */
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme', 'contrast-theme');
        if (theme) {
            document.body.classList.add(`${theme}-theme`);
            localStorage.setItem('selectedTheme', theme);
        }
    }

    /**
     * Настраивает логику для группы кнопок (например, темы, масштаб).
     * @param {string} selector - CSS-селектор для группы кнопок.
     */
    function setupButtonGroup(selector) {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Специальная логика для кнопок темы
                if (this.classList.contains('theme-button')) {
                    const themeKey = this.dataset.langKey; // e.g., "theme_light"
                    if (themeKey) {
                        const theme = themeKey.split('_')[1]; // "light"
                        applyTheme(theme);
                    }
                }
            });
        });
    }
    
    /**
     * Загружает трек в плеер по индексу.
     * @param {number} trackIndex - Индекс трека в плейлисте.
     * @param {boolean} shouldPlay - Нужно ли запускать воспроизведение сразу.
     */
    function loadTrack(trackIndex, shouldPlay = true) {
        if (!bgMusic || !playlist[trackIndex]) return;
        bgMusic.src = playlist[trackIndex].src.replace('~', '');
        const trackTitleText = playlist[trackIndex].title;
        if (musicTitle) musicTitle.textContent = trackTitleText;
        if (widgetTrackTitle) widgetTrackTitle.textContent = trackTitleText;

        if (isMusicOn && shouldPlay) {
            bgMusic.play().catch(e => console.error("Ошибка воспроизведения:", e));
        }
    }

    /**
     * Обновляет иконки и состояние кнопок управления музыкой.
     */
    function updateMusicButtonUI() {
        if (musicToggleBtn) {
            musicToggleBtn.classList.toggle('active', isMusicOn);
            musicToggleBtn.setAttribute('data-lang-key', isMusicOn ? 'music_on' : 'music_off');
        }
        if (widgetPlayPauseBtn) {
            widgetPlayPauseBtn.classList.toggle('playing', isMusicOn);
        }
    }

    /**
     * Переключает воспроизведение/паузу.
     */
    function togglePlayPause() {
        isMusicOn = !isMusicOn;
        if (isMusicOn) {
            if (bgMusic.src) {
                bgMusic.play().catch(e => console.error("Ошибка воспроизведения:", e));
            } else {
                loadTrack(currentTrackIndex); // Загружаем первый трек, если еще ничего не играло
            }
        } else {
            bgMusic.pause();
        }
        updateMusicButtonUI();
    }

    /**
     * Включает следующий трек.
     */
    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
    }

    /**
     * Включает предыдущий трек.
     */
    function playPrevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
    }

    /**
     * Устанавливает громкость музыки.
     */
    function setVolume() {
        if (!bgMusic || !musicSlider || !musicVolumeValue) return;
        bgMusic.volume = musicSlider.value / 100;
        musicVolumeValue.textContent = musicSlider.value;
    }

    /**
     * Восстанавливает состояние плеера из localStorage.
     */
    function restorePlayerState() {
        const savedStateJSON = localStorage.getItem('musicPlayerState');
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState.isPlaying) {
                isMusicOn = true;
                currentTrackIndex = savedState.trackIndex;
                
                loadTrack(currentTrackIndex, false); // Загружаем трек без авто-проигрывания
                
                bgMusic.volume = savedState.volume;
                if (musicSlider) musicSlider.value = savedState.volume * 100;
                if (musicVolumeValue) musicVolumeValue.textContent = musicSlider.value;
                
                bgMusic.addEventListener('canplay', function onCanPlay() {
                    bgMusic.currentTime = savedState.currentTime;
                    bgMusic.play().catch(e => console.error("Ошибка воспроизведения:", e));
                    bgMusic.removeEventListener('canplay', onCanPlay); // Удаляем, чтобы не сработал снова
                });

                updateMusicButtonUI();
            }
        }
    }

    /**
     * Главная функция инициализации при загрузке страницы.
     */
    function initializeState() {
        // 1. Настройка тем
        const savedTheme = localStorage.getItem('selectedTheme') || 'light';
        applyTheme(savedTheme);

        // 2. Настройка групп кнопок
        setupButtonGroup('.theme-button');
        setupButtonGroup('.scale-button');
        setupButtonGroup('.lang-button');

        // 3. Активация кнопок по умолчанию или из сохраненных данных
        document.querySelectorAll('.theme-button').forEach(btn => btn.classList.remove('active'));
        const themeBtn = document.querySelector(`.theme-button[data-lang-key="theme_${savedTheme}"]`) || document.querySelector('.theme-button[data-lang-key="theme_light"]');
        if (themeBtn) themeBtn.classList.add('active');

        const scaleBtn = document.querySelector('.scale-button[data-scale="normal"]');
        if (scaleBtn) scaleBtn.classList.add('active');

        const langBtn = document.querySelector('.lang-button[data-lang="uk"]');
        if (langBtn) langBtn.classList.add('active');
        
        // 4. Настройка плеера
        if (!localStorage.getItem('musicPlayerState')) {
            // Если нет сохраненного состояния, ставим значения по умолчанию
            loadTrack(currentTrackIndex, false); // Просто загружаем, не играем
            updateMusicButtonUI();
            if (musicSlider) musicSlider.value = 10;
            setVolume();
        } else {
            // Иначе восстанавливаем
            restorePlayerState();
        }
    }


    // --- 3. НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ ---

    // Кнопки открытия меню
    if (settingsLink) settingsLink.addEventListener('click', (e) => { e.preventDefault(); showMenu('settingsMenu'); });
    if (authorsLink) authorsLink.addEventListener('click', (e) => { e.preventDefault(); showMenu('authorsMenu'); });
    if (loadGameLink) loadGameLink.addEventListener('click', (e) => { e.preventDefault(); showMenu('loadMenu'); });
    if (loadAchivmentLink) loadAchivmentLink.addEventListener('click', (e) => { e.preventDefault(); showMenu('achivmentsMenu'); });
    
    // Кнопка "Продолжить"
    if (continueGameLink) continueGameLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Загрузка последнего сохранения...');
        // window.location.href = '@Url.Action("Index", "PlayGame")'; // Раскомментируйте, когда будет серверная часть
    });

    // Кнопки закрытия меню
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => hideMenu('settingsMenu'));
    if (closeAuthorsBtn) closeAuthorsBtn.addEventListener('click', () => hideMenu('authorsMenu'));
    // if (closeLoadBtn) closeLoadBtn.addEventListener('click', () => hideMenu('loadMenu'));
    // if (closeAchivmentsBtn) closeAchivmentsBtn.addEventListener('click', () => hideMenu('achivmentsMenu'));
    
    // Музыка (Настройки)
    if (musicToggleBtn) musicToggleBtn.addEventListener('click', togglePlayPause);
    if (musicNextBtn) musicNextBtn.addEventListener('click', playNextTrack);
    if (musicPrevBtn) musicPrevBtn.addEventListener('click', playPrevTrack);
    if (musicSlider) musicSlider.addEventListener('input', setVolume);

    // Музыка (Виджет)
    if (widgetPlayPauseBtn) widgetPlayPauseBtn.addEventListener('click', togglePlayPause);
    if (widgetNextBtn) widgetNextBtn.addEventListener('click', playNextTrack);
    if (widgetPrevBtn) widgetPrevBtn.addEventListener('click', playPrevTrack);
    
    // Событие окончания трека
    if (bgMusic) bgMusic.addEventListener('ended', playNextTrack);

    // Сохранение состояния плеера перед закрытием страницы
    window.addEventListener('beforeunload', () => {
        if (isMusicOn) {
            const playerState = {
                trackIndex: currentTrackIndex,
                currentTime: bgMusic.currentTime,
                volume: bgMusic.volume,
                isPlaying: true
            };
            localStorage.setItem('musicPlayerState', JSON.stringify(playerState));
        } else {
            localStorage.removeItem('musicPlayerState');
        }
    });


    // --- 4. ЗАПУСК ИНИЦИАЛИЗАЦИИ ---
    initializeState();

    function applyScale(scale) {
        const body = document.body;
        body.classList.remove('scale-small', 'scale-normal', 'scale-large');
        body.classList.add(`scale-${scale}`);
        localStorage.setItem('uiScale', scale);
    }

    // Завантаження масштабу при старті
    document.addEventListener('DOMContentLoaded', () => {
        const savedScale = localStorage.getItem('uiScale') || 'normal';
        applyScale(savedScale);
    });

    // Призначення обробників кнопкам
    document.getElementById('scaleSmall')?.addEventListener('click', () => applyScale('small'));
    document.getElementById('scaleNormal')?.addEventListener('click', () => applyScale('normal'));
    document.getElementById('scaleLarge')?.addEventListener('click', () => applyScale('large'));

        // --- 5. ПРЕЛОАДЕР ТА ПАРАЛАКС ---

    // Заборона скролу на час завантаження
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add('lock-scroll');

    const imgs = document.querySelectorAll('img, video');
    let i = 0;

    const intprochentChet = document.getElementById("intprochent_chet");
    const perchenload = document.getElementById("perchenload");

    const updateProgress = () => {
        i++;
        let percent = ((i * 100) / imgs.length).toFixed(0);
        if (intprochentChet) intprochentChet.innerHTML = `${percent}%`;
        if (perchenload) perchenload.style.width = `${percent}%`;

        if (i === imgs.length) {
            setTimeout(() => {
                document.body.classList.remove('lock-scroll');
                document.documentElement.style.overflow = "visible";
                hidePreloader();
            }, 1500);
        }
    };

    imgs.forEach((img) => {
        if (img.complete) {
            updateProgress();
        } else {
            img.onload = updateProgress;
            img.onerror = updateProgress;
        }
    });

    function hidePreloader() {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            preloader.style.transition = "opacity 0.5s ease";
            preloader.style.opacity = "0";

            setTimeout(() => {
                preloader.style.display = "none";
            }, 500);
        }
    }

    // --- 6. ПАРАЛАКС І РУХ ХОТБАРУ ---
    const layers = document.querySelector('.layers');
    const hotBar = document.querySelector('.hot-bar-inner');
    let isHovering = false;
    let isHoveringHotBar = false;

    document.addEventListener('mousemove', e => {
        if (!isHoveringHotBar) {
            isHovering = true;
            document.documentElement.style.setProperty('--move-x', `${(e.clientX - window.innerWidth / 2) * -.005}deg`);
            document.documentElement.style.setProperty('--move-y', `${(e.clientY - window.innerHeight / 2) * -.01}deg`);
        }
    });

    if (hotBar) {
        hotBar.addEventListener('mouseenter', () => {
            isHoveringHotBar = true;
            document.documentElement.style.transition = 'transform 0.5s ease-out';
            document.documentElement.style.setProperty('--move-x', `0deg`);
            document.documentElement.style.setProperty('--move-y', `0deg`);
        });

        hotBar.addEventListener('mouseleave', () => {
            isHoveringHotBar = false;
        });
    }

    if (layers) {
        layers.addEventListener('mouseleave', () => {
            if (!isHoveringHotBar) {
                isHovering = false;
                document.documentElement.style.transition = 'transform var(--transition)';
                document.documentElement.style.setProperty('--move-x', `0deg`);
                document.documentElement.style.setProperty('--move-y', `0deg`);

                setTimeout(() => {
                    if (!isHovering && !isHoveringHotBar) {
                        document.documentElement.style.transition = '';
                    }
                }, 1500);
            }
        });
    }

    // Додаткова утиліта (якщо потрібно)
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }


});