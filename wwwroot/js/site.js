document.addEventListener('DOMContentLoaded', function() {
    // -------------------- DOM Елементи (знаходимо за ID) --------------------
    const authorsLink = document.getElementById('authorsLink');
    const authorsMenu = document.getElementById('authorsMenu');
    const closeAuthorsMenuButton = document.getElementById('closeAuthorsMenu');

    const settingsLink = document.getElementById('settingsLink');
    const settingsMenu = document.getElementById('settingsMenu');
    const closeSettingsMenuButton = document.getElementById('closeSettingsMenu');

    const loadGameLink = document.getElementById('loadGameLink');
    const loadGameMenu = document.getElementById('loadGameMenu');
    const closeLoadGameMenu = document.getElementById('closeLoadGameMenu');
    const saveNameInput = document.getElementById('saveName');
    const saveNewBtn = document.getElementById('saveNewBtn');
    const savegameList = document.getElementById('savegameList');
    const savegameEmpty = document.getElementById('savegameEmpty');

    // const menuLabel = document.getElementById('menuLabel'); // Цей елемент більше не використовується для статичного меню
    const mainMenuContainer = document.getElementById('mainMenuContainer'); // Головний контейнер меню

    const body = document.body; // Основний елемент body для зміни класів

    // Кнопки для налаштувань теми
    const themeLightButton = document.getElementById('themeLight');
    const themeDarkButton = document.getElementById('themeDark');
    const themeWineButton = document.getElementById('themeWine');
    const themeNeonButton = document.getElementById('themeNeon');

    // Кнопки для налаштувань масштабу
    const scaleTinyButton = document.getElementById('scaleTiny');
    const scaleSmallButton = document.getElementById('scaleSmall');
    const scaleNormalButton = document.getElementById('scaleNormal');
    const scaleLargeButton = document.getElementById('scaleLarge');
    const scaleHugeButton = document.getElementById('scaleHuge');

    // Елементи для відображення поточної мови та озвучки
    const languageValueSpan = document.getElementById('languageValue');
    const voiceoverValueSpan = document.getElementById('voiceoverValue');

    // Кнопки для налаштувань мови
    const langUkrainianButton = document.getElementById('langUkrainian');
    const langRussianButton = document.getElementById('langRussian');
    const langEnglishButton = document.getElementById('langEnglish');

    // Елементи для управління музикою
    const bgMusic = document.getElementById('bgMusic');
    const musicVolumeSlider = document.getElementById('musicVolumeSlider');
    const musicVolumeValue = document.getElementById('musicVolumeValue');
    const musicToggle = document.getElementById('musicToggle');
    const exitLabel = document.getElementById('exitLabel');

    const musicPrev = document.getElementById('musicPrev');
    const musicNext = document.getElementById('musicNext');
    const musicTitle = document.getElementById('musicTitle');

    // Список треков с переводами названий
    const musicTracks = [
        {
            src: "audio/bg.mp3",
            title: "Мелодія 1",
            title_ukrainian: "Мелодія 1",
            title_russian: "Мелодия 1",
            title_english: "Melody 1"
        },
        {
            src: "audio/bg2.mp3",
            title: "Мелодія 2",
            title_ukrainian: "Мелодія 2",
            title_russian: "Мелодия 2",
            title_english: "Melody 2"
        },
        {
            src: "audio/bg3.mp3",
            title: "Мелодія 3",
            title_ukrainian: "Мелодія 3",
            title_russian: "Мелодия 3",
            title_english: "Melody 3"
        }
    ];
    let currentTrack = 0;

    // -------------------- Поточні налаштування та переклади --------------------
    let currentSettings = {
        theme: 'light',      // 'light', 'dark', 'blue'
        scale: 'normal',     // 'small', 'normal', 'large'
        language: 'ukrainian',
        musicVolume: 100,
        musicEnabled: true
    };

    const translations = {
        ukrainian: {
            "menu_title": "Dream",
            "main_menu_subtitle": "ГОЛОВНЕ МЕНЮ",
            "main_menu_label": "МЕНЮ",
            "peaceful_mode": "МИРНИЙ РЕЖИМ",
            "continue_game": "ПРОДОВЖИТИ",
            "new_game": "НОВА ГРА",
            "load_game": "ЗАВАНТАЖИТИ",
            "characters": "ПЕРСОНАЖІ",
            "clothes": "ОДЯГ",
            "settings": "НАЛАШТУВАННЯ",
            "achievements": "ДОСЯГНЕННЯ",
            "authors": "АВТОРИ",
            "language": "МОВА",
            "voiceover": "ОЗВУЧКА",
            "exit": "ВИХІД",
            "authors_novel_title": "АВТОРИ НОВЕЛИ",
            "scenario_writer": "Сценарист:",
            "artist": "Художник:",
            "programmer": "Програміст:",
            "music": "Музика:",
            "close": "ЗАКРИТИ",
            "settings_title": "НАЛАШТУВАННЯ",
            "interface_themes": "Теми інтерфейсу:",
            "theme_light": "Світла",
            "theme_dark": "Темна",
            "theme_wine": "Бордо",
            "theme_neon": "Неонова",
            "theme_blue": "Блакитна",
            "interface_scale": "Масштаб інтерфейсу:",
            "scale_small": "Дрібний",
            "scale_normal": "Звичайний",
            "scale_large": "Великий",
            "language_settings": "Мова:",
            "lang_ukrainian": "Українська",
            "lang_russian": "Російська",
            "lang_english": "Англійська",
            "current_language": "Українська",
            "current_voiceover": "Українська",
            "music_on": "Увімкнено",
            "music_off": "Вимкнено"
        },
        russian: {
            "menu_title": "Dream",
            "main_menu_subtitle": "ГЛАВНОЕ МЕНЮ",
            "main_menu_label": "МЕНЮ",
            "peaceful_mode": "МИРНЫЙ РЕЖИМ",
            "continue_game": "ПРОДОЛЖИТЬ",
            "new_game": "НОВАЯ ИГРА",
            "load_game": "ЗАГРУЗИТЬ",
            "characters": "ПЕРСОНАЖИ",
            "clothes": "ОДЕЖДА",
            "settings": "НАСТРОЙКИ",
            "achievements": "ДОСТИЖЕНИЯ",
            "authors": "АВТОРЫ",
            "language": "ЯЗЫК",
            "voiceover": "ОЗВУЧКА",
            "exit": "ВЫХОД",
            "authors_novel_title": "АВТОРЫ НОВЕЛЛЫ",
            "scenario_writer": "Сценарист:",
            "artist": "Художник:",
            "programmer": "Программист:",
            "music": "Музыка:",
            "close": "ЗАКРЫТЬ",
            "settings_title": "НАСТРОЙКИ",
            "interface_themes": "Темы интерфейса:",
            "theme_light": "Светлая",
            "theme_dark": "Темная",
            "theme_wine": "Бордо",
            "theme_neon": "Неоновая",
            "theme_blue": "Голубая",
            "interface_scale": "Масштаб интерфейса:",
            "scale_small": "Мелкий",
            "scale_normal": "Обычный",
            "scale_large": "Крупный",
            "language_settings": "Язык:",
            "lang_ukrainian": "Украинский",
            "lang_russian": "Русский",
            "lang_english": "Английский",
            "current_language": "Русский",
            "current_voiceover": "Русский",
            "music_on": "Включено",
            "music_off": "Выключено"
        },
        english: {
            "menu_title": "Dream",
            "main_menu_subtitle": "MAIN MENU",
            "main_menu_label": "MENU",
            "peaceful_mode": "PEACEFUL MODE",
            "continue_game": "CONTINUE",
            "new_game": "NEW GAME",
            "load_game": "LOAD GAME",
            "characters": "CHARACTERS",
            "clothes": "OUTFITS",
            "settings": "SETTINGS",
            "achievements": "ACHIEVEMENTS",
            "authors": "AUTHORS",
            "language": "LANGUAGE",
            "voiceover": "VOICEOVER",
            "exit": "EXIT",
            "authors_novel_title": "NOVEL AUTHORS",
            "scenario_writer": "Scenario Writer:",
            "artist": "Artist:",
            "programmer": "Programmer:",
            "music": "Music:",
            "close": "CLOSE",
            "settings_title": "SETTINGS",
            "interface_themes": "Interface Themes:",
            "theme_light": "Light",
            "theme_dark": "Dark",
            "theme_wine": "Wine",
            "theme_neon": "Neon",
            "theme_blue": "Blue",
            "interface_scale": "Interface Scale:",
            "scale_small": "Small",
            "scale_normal": "Normal",
            "scale_large": "Large",
            "language_settings": "Language:",
            "lang_ukrainian": "Ukrainian",
            "lang_russian": "Russian",
            "lang_english": "English",
            "current_language": "English",
            "current_voiceover": "English",
            "music_on": "On",
            "music_off": "Off"
        }
    };

    // -------------------- Функції взаємодії з БД (без змін) --------------------
    async function loadSettingsFromDb() {
        try {
            // Використовуємо 'POST' для надсилання дефолтних налаштувань, якщо їх немає
            const response = await fetch('/api/settings', {
                method: 'GET', // Спочатку спробуємо отримати налаштування
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const settings = await response.json();
                if (Object.keys(settings).length === 0) { // Якщо відповідь порожня (наприклад, БД ще не містить налаштувань)
                    console.log('No settings found in DB. Applying default settings and saving.');
                    currentSettings = { // Застосовуємо дефолтні налаштування
                        theme: 'light',
                        scale: 'normal',
                        language: 'ukrainian' // Дефолтна мова "російська"
                    };
                    await saveSettingsToDb(currentSettings); // Зберігаємо дефолтні налаштування
                } else {
                    console.log('Loaded settings from DB:', settings);
                    currentSettings = settings;
                }
            } else {
                console.warn('Failed to load settings from DB. Status:', response.status, response.statusText, 'Applying default settings.');
                currentSettings = { // Застосовуємо дефолтні налаштування у випадку помилки
                    theme: 'light',
                    scale: 'normal',
                    language: 'ukrainian'
                };
                await saveSettingsToDb(currentSettings); // Спробуємо зберегти дефолтні
            }
        } catch (error) {
            console.error('Error loading settings:', error, 'Applying default settings.');
            currentSettings = { // Застосовуємо дефолтні налаштування у випадку помилки мережі
                theme: 'light',
                scale: 'normal',
                language: 'ukrainian'
            };
            await saveSettingsToDb(currentSettings); // Спробуємо зберегти дефолтні
        } finally {
            applySettings(currentSettings);
        }
    }

    async function saveSettingsToDb(settings) {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                console.error('Failed to save settings to DB:', response.status, response.statusText);
            } else {
                console.log('Settings saved to DB successfully!');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // -------------------- Основні функції застосування налаштувань --------------------

    function applySettings(settings) {
        // Исправлено: корректно переключаем все темы!
        body.classList.remove('dark-theme', 'blue-theme', 'cyan-theme', 'orange-theme', 'neon-theme', 'wine-theme', 'purple-theme', 'green-theme');
        if (settings.theme === 'dark') {
            body.classList.add('dark-theme');
        } else if (settings.theme === 'blue') {
            body.classList.add('blue-theme');
        } else if (settings.theme === 'wine') {
            body.classList.add('wine-theme');
        } else if (settings.theme === 'neon') {
            body.classList.add('neon-theme');
        } else if (settings.theme === 'orange') {
            body.classList.add('orange-theme');
        } else if (settings.theme === 'purple') {
            body.classList.add('purple-theme');
        } else if (settings.theme === 'green') {
            body.classList.add('green-theme');
        }

        // Застосування масштабу (оновлено для використання класів CSS)
        body.classList.remove('scale-tiny', 'scale-small', 'scale-normal', 'scale-large', 'scale-huge');
        switch (settings.scale) {
            case 'tiny':
                body.classList.add('scale-tiny');
                break;
            case 'small':
                body.classList.add('scale-small');
                break;
            case 'normal':
                body.classList.add('scale-normal');
                break;
            case 'large':
                body.classList.add('scale-large');
                break;
            case 'huge':
                body.classList.add('scale-huge');
                break;
            default:
                body.classList.add('scale-normal'); // Дефолтне значення
                break;
        }

        // Музыка: включение/выключение и громкость (без перезапуска трека)
        if (musicToggle) {
            musicToggle.textContent = settings.musicEnabled ? 'Увімкнено' : 'Вимкнено';
            musicToggle.classList.toggle('active', settings.musicEnabled);
        }
        if (bgMusic) {
            // Сохраняем текущий трек и позицию
            const prevSrc = bgMusic.src;
            const prevTime = bgMusic.currentTime;
            const wasPlaying = !bgMusic.paused && !bgMusic.muted && settings.musicEnabled;

            bgMusic.muted = !settings.musicEnabled;
            bgMusic.volume = (settings.musicVolume ?? 100) / 100;

            // Не сбрасываем трек и позицию при смене настроек!
            if (settings.musicEnabled && bgMusic.paused) {
                bgMusic.play().catch(()=>{});
            }
            if (!settings.musicEnabled && !bgMusic.paused) {
                bgMusic.pause();
            }
            // Если трек не сменился, возвращаем позицию
            if (bgMusic.src === prevSrc && Math.abs(bgMusic.currentTime - prevTime) > 0.1) {
                bgMusic.currentTime = prevTime;
            }
        }
        if (musicVolumeSlider) musicVolumeSlider.value = settings.musicVolume ?? 100;
        if (musicVolumeValue) musicVolumeValue.textContent = settings.musicVolume ?? 100;

        // Оновлення активних кнопок налаштувань
        // Для тем
        updateActiveButton('theme-button', settings.theme);
        // Для масштабу
        updateActiveButton('scale-button', settings.scale);
        // Для мови
        updateActiveButton('lang-button', settings.language);

        // Оновлюємо текст інтерфейсу згідно з вибраною мовою
        updateLanguageText(settings.language);

        setMusicTrack(currentTrack, true); // true = зберегти позицію
    }

    /**
     * Оновлює текстовий контент елементів на сторінці згідно з вибраною мовою.
     * @param {string} lang - Код мови (наприклад, 'ukrainian', 'russian', 'english').
     */
    function updateLanguageText(lang) {
        const currentLangPack = translations[lang];
        if (!currentLangPack) {
            console.error('Translation pack not found for language:', lang);
            return;
        }

        // Оновлення елементів з data-lang-key
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.dataset.langKey;
            if (currentLangPack[key] !== undefined) {
                if (element.classList.contains('menu-item') && element.querySelector('.achievement-count')) {
                    // Achievement
                    const countSpan = element.querySelector('.achievement-count').outerHTML;
                    element.innerHTML = currentLangPack[key] + ' ' + countSpan;
                } else if (element.classList.contains('menu-subtitle')) {
                    // Для подзаголовка: сохранить иконку!
                    const icon = element.querySelector('.icon');
                    element.innerHTML = '';
                    if (icon) element.appendChild(icon);
                    element.append(document.createTextNode(' ' + currentLangPack[key]));
                } else if (element.classList.contains('menu-title')) {
                    element.textContent = currentLangPack[key];
                } else if (element.classList.contains('author-info')) {
                    const authorNameSpan = element.querySelector('.author-name');
                    if (authorNameSpan) {
                        const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) {
                            textNode.textContent = currentLangPack[key] + ' ';
                        } else {
                            element.prepend(document.createTextNode(currentLangPack[key] + ' '));
                        }
                    } else {
                        element.textContent = currentLangPack[key];
                    }
                } else {
                    element.textContent = currentLangPack[key];
                }
            } else {
                console.warn(`Translation key "${key}" not found for language "${lang}".`);
            }
        });

        // Оновлення окремих елементів за ID, якщо вони існують
        if (languageValueSpan) {
            languageValueSpan.textContent = currentLangPack.current_language;
        }
        if (voiceoverValueSpan) {
            voiceoverValueSpan.textContent = currentLangPack.current_voiceover;
        }
        // if (menuLabel) { // Цей елемент більше не використовується
        //     menuLabel.textContent = currentLangPack.main_menu_label || "МЕНЮ";
        // }
        if (document.title) { // Оновлення заголовка сторінки
            document.title = currentLangPack.menu_title || "Dream";
        }

        // --- Обновление текста кнопки музыки ---
        if (musicToggle) {
            musicToggle.textContent = currentSettings.musicEnabled
                ? (currentLangPack.music_on || "Включено")
                : (currentLangPack.music_off || "Выключено");
        }

        // --- Обновление названия текущей мелодии ---
        if (musicTitle && musicTracks && musicTracks.length > 0) {
            let track = musicTracks[currentTrack];
            let localizedTitle = track["title_" + lang] || track.title;
            musicTitle.textContent = localizedTitle;
        }
    }

    /**
     * Оновлює клас 'active' для кнопок в групі.
     * @param {string} groupClass - Клас, який ідентифікує групу кнопок (наприклад, 'theme-button').
     * @param {string} activeValue - Значення, яке повинно бути активним (наприклад, 'dark', 'small', 'ukrainian').
     */
    function updateActiveButton(groupClass, activeValue) {
        document.querySelectorAll(`.${groupClass}`).forEach(button => {
            let buttonValue;
            if (button.dataset.theme) {
                buttonValue = button.dataset.theme;
            } else if (button.dataset.scale) {
                buttonValue = button.dataset.scale;
            } else if (button.dataset.langValue) {
                buttonValue = button.dataset.langValue;
            } else {
                // Запасний варіант, якщо data-атрибути не використовуються
                // (але рекомендовано використовувати data-атрибути)
                buttonValue = button.id.replace(/theme|scale|lang/i, '').toLowerCase();
            }

            if (buttonValue === activeValue) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // -------------------- Функції управління видимістю меню --------------------

    /**
     * Приховує всі додаткові меню (авторів, налаштувань).
     */
    function hideAllSubMenus() {
        if (authorsMenu) authorsMenu.classList.add('hidden');
        if (settingsMenu) settingsMenu.classList.add('hidden');
    }

    /**
     * Показує певне підменю і приховує головне меню.
     * @param {HTMLElement|null} menuToShow - DOM-елемент підменю для показу, або null для приховування всіх.
     */
    function showSubMenu(menuToShow) {
        hideAllSubMenus(); // Приховуємо всі підменю
        if (menuToShow) {
            menuToShow.classList.remove('hidden'); // Показуємо вибране підменю
        }
        if (mainMenuContainer) {
            mainMenuContainer.classList.add('hidden'); // Приховуємо головне меню
        }
    }


    // Обробники для кнопок закриття додаткових меню
    if (closeAuthorsMenuButton) {
        closeAuthorsMenuButton.addEventListener('click', function() {
            showSubMenu(null); // Приховуємо авторів
            if (mainMenuContainer) mainMenuContainer.classList.remove('hidden'); // Показуємо головне
            saveSettingsToDb(currentSettings);
        });
    }
    if (closeSettingsMenuButton) {
        closeSettingsMenuButton.addEventListener('click', function() {
            showSubMenu(null); // Приховуємо налаштування
            if (mainMenuContainer) mainMenuContainer.classList.remove('hidden'); // Показуємо головне
            saveSettingsToDb(currentSettings);
        });
    }
    if (closeLoadGameMenu) {
        closeLoadGameMenu.addEventListener('click', function() {
            // Скрываем только loadGameMenu, не трогаем mainMenuContainer (пусть showSubMenu(null) сам покажет главное меню)
            loadGameMenu.classList.add('hidden');
            if (mainMenuContainer) mainMenuContainer.classList.remove('hidden');
        });
    }

    // Обробники для посилань у головному меню
    if (authorsLink && authorsMenu) {
        authorsLink.addEventListener('click', function(event) {
            event.preventDefault();
            showSubMenu(authorsMenu);
        });
    }
    if (settingsLink && settingsMenu) {
        settingsLink.addEventListener('click', function(event) {
            event.preventDefault();
            showSubMenu(settingsMenu);
        });
    }
    if (loadGameLink && loadGameMenu) {
        loadGameLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSubMenu(loadGameMenu);
            renderSaves();
        });
    }

    // Обробники для кнопок вибору теми
    if (themeLightButton) themeLightButton.addEventListener('click', function() {
        currentSettings.theme = 'light';
        applySettings(currentSettings);
    });
    if (themeDarkButton) themeDarkButton.addEventListener('click', function() {
        currentSettings.theme = 'dark';
        applySettings(currentSettings);
    });
    if (themeWineButton) themeWineButton.addEventListener('click', function() {
        currentSettings.theme = 'wine';
        applySettings(currentSettings);
    });
    if (themeNeonButton) themeNeonButton.addEventListener('click', function() {
        currentSettings.theme = 'neon';
        applySettings(currentSettings);
    });

    // Обробники для кнопок вибору масштабу
    if (scaleTinyButton) scaleTinyButton.addEventListener('click', function() {
        currentSettings.scale = 'tiny';
        applySettings(currentSettings);
    });
    if (scaleSmallButton) scaleSmallButton.addEventListener('click', function() {
        currentSettings.scale = 'small';
        applySettings(currentSettings);
    });
    if (scaleNormalButton) scaleNormalButton.addEventListener('click', function() {
        currentSettings.scale = 'normal';
        applySettings(currentSettings);
    });
    if (scaleLargeButton) scaleLargeButton.addEventListener('click', function() {
        currentSettings.scale = 'large';
        applySettings(currentSettings);
    });
    if (scaleHugeButton) scaleHugeButton.addEventListener('click', function() {
        currentSettings.scale = 'huge';
        applySettings(currentSettings);
    });

    // Обробники для кнопок вибору мови
    if (langUkrainianButton) langUkrainianButton.addEventListener('click', function() {
        currentSettings.language = 'ukrainian';
        applySettings(currentSettings);
    });
    if (langRussianButton) langRussianButton.addEventListener('click', function() {
        currentSettings.language = 'russian';
        applySettings(currentSettings);
    });
    if (langEnglishButton) langEnglishButton.addEventListener('click', function() {
        currentSettings.language = 'english';
        applySettings(currentSettings);
    });

    // Обробник для кнопки "ВИХІД" (якщо є)
    const exitButton = document.getElementById('exitButton');
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            // Попытка закрити вкладку/окно (работает только если окно открыто скриптом)
            window.open('', '_self');
            window.close();
            // Если не сработало — перенаправить на about:blank
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 200);
        });
    }

    // Обработчик для включения/выключения музыки
    if (musicToggle) {
        musicToggle.addEventListener('click', function() {
            currentSettings.musicEnabled = !currentSettings.musicEnabled;
            applySettings(currentSettings);
        });
    }

    // Обработчик для изменения громкости музыки
    if (musicVolumeSlider) {
        musicVolumeSlider.addEventListener('input', function() {
            currentSettings.musicVolume = parseInt(musicVolumeSlider.value, 10);
            if (musicVolumeValue) musicVolumeValue.textContent = currentSettings.musicVolume;
            if (bgMusic) bgMusic.volume = currentSettings.musicVolume / 100;
        });
    }

    // Обработчик для надписи "ВИХІД"
    if (exitLabel) {
        exitLabel.addEventListener('click', () => {
            window.open('', '_self');
            window.close();
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 200);
        });
        exitLabel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                exitLabel.click();
            }
        });
    }

    // Мини-плеер: кнопки переключения треков
    function setMusicTrack(idx, keepTime = false) {
        currentTrack = ((idx % musicTracks.length) + musicTracks.length) % musicTracks.length;
        if (bgMusic) {
            let prevTime = keepTime ? bgMusic.currentTime : 0;
            let wasPlaying = !bgMusic.paused && !bgMusic.muted && currentSettings.musicEnabled;
            const prevSrc = bgMusic.src;
            const newSrc = musicTracks[currentTrack].src;
            if (bgMusic.src !== location.origin + '/' + newSrc && bgMusic.src !== newSrc) {
                bgMusic.pause();
                bgMusic.src = newSrc;
                bgMusic.load();
            }
            bgMusic.oncanplay = function() {
                if (keepTime && prevTime > 0 && bgMusic.duration > prevTime) {
                    bgMusic.currentTime = prevTime;
                }
                if (wasPlaying) {
                    bgMusic.muted = false;
                    bgMusic.play().catch(()=>{});
                }
                bgMusic.oncanplay = null;
            };
        }
        // --- обновить название мелодии с учетом языка ---
        if (musicTitle && musicTracks && musicTracks.length > 0) {
            let lang = currentSettings.language || "ukrainian";
            let track = musicTracks[currentTrack];
            let localizedTitle = track["title_" + lang] || track.title;
            musicTitle.textContent = localizedTitle;
        }
    }

    if (musicPrev) {
        musicPrev.addEventListener('click', function() {
            setMusicTrack(currentTrack - 1, false);
        });
    }
    if (musicNext) {
        musicNext.addEventListener('click', function() {
            setMusicTrack(currentTrack + 1, false);
        });
    }

    // --- Save/Load logic ---
    // Только загрузка (без создания/удаления/копирования)
    function getSaves() {
        return JSON.parse(localStorage.getItem('novel_saves') || '[]');
    }
    function renderSaves() {
        if (!savegameList || !savegameEmpty) return;
        const saves = getSaves();
        savegameList.innerHTML = '';
        if (!saves.length) {
            savegameEmpty.style.display = '';
            savegameList.appendChild(savegameEmpty);
            return;
        }
        savegameEmpty.style.display = 'none';
        saves.forEach((save, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${save.name} <small style="color:#aaa;">(${save.date})</small></span>
                <span class="savegame-actions">
                    <button class="setting-button" data-idx="${idx}" data-action="load">Завантажити</button>
                </span>`;
            savegameList.appendChild(li);
        });
    }
    function handleSaveAction(e) {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const saves = getSaves();
        if (btn.getAttribute('data-action') === 'load') {
            alert('Завантажено: ' + saves[idx].name + '\n(Тут має бути логіка завантаження гри)');
        }
    }

    // --- Show/hide load game menu ---
    if (loadGameLink && loadGameMenu) {
        loadGameLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSubMenu(loadGameMenu);
            renderSaves();
        });
    }
    if (closeLoadGameMenu) {
        closeLoadGameMenu.addEventListener('click', function() {
            // Скрываем только loadGameMenu, не трогаем mainMenuContainer (пусть showSubMenu(null) сам покажет главное меню)
            loadGameMenu.classList.add('hidden');
            if (mainMenuContainer) mainMenuContainer.classList.remove('hidden');
        });
    }
    if (savegameList) savegameList.onclick = handleSaveAction;

    // -------------------- Ініціалізація налаштувань при завантаженні --------------------
    loadSettingsFromDb(); // Завантажуємо та застосовуємо налаштування з БД при старті
    // Оскільки меню завжди видиме, прибираємо логіку, яка його приховувала при DOMContentLoaded
    if (mainMenuContainer) {
        mainMenuContainer.classList.remove('hidden');
    }

    // Автоматично включити музику при першому взаємодії користувача
    if (bgMusic) {
        const enableMusic = () => {
            if (currentSettings.musicEnabled) {
                bgMusic.muted = false;
                bgMusic.play().catch(()=>{});
            }
            window.removeEventListener('click', enableMusic);
            window.removeEventListener('keydown', enableMusic);
        };
        window.addEventListener('click', enableMusic);
        window.addEventListener('keydown', enableMusic);
    }

    // При іниціалізації
    setMusicTrack(0, false);

    // -------------------- События для динамических элементов --------------------
    // Делегирование событий для динамических кнопок в savegameList
    if (savegameList) {
        savegameList.addEventListener('click', handleSaveAction);
    }

    // --- Character Data ---
    // (Оставьте только это определение, если используете characters.js, иначе удалите)
    const characters = [
        {
            id: 'char1',
            name: 'Аліса',
            image: 'img/NovelaGirl.jpg',
            description: 'Аліса — головна героїня, добра, рішуча та мрійлива. Вона завжди допомагає друзям і не боїться труднощів. Її мрія — знайти справжнє щастя.',
            stats: [
                { label: 'Вік', value: 18 },
                { label: 'Сила', value: 7 },
                { label: 'Інтелект', value: 9 },
                { label: 'Харизма', value: 8 }
            ]
        },
        {
            id: 'char2',
            name: 'Максим',
            image: 'img/char_max.png',
            description: 'Максим — веселий друг, завжди підтримує у складних ситуаціях. Любить пригоди та має гостре почуття гумору.',
            stats: [
                { label: 'Вік', value: 19 },
                { label: 'Сила', value: 8 },
                { label: 'Інтелект', value: 7 },
                { label: 'Харизма', value: 7 }
            ]
        }
        // ...додайте інших персонажів тут...
    ];

    // --- Character Modal Logic ---
    // Локальні функції для модального окна персонажей (если нет characters.js)
    function createCharacterModal() {
        let modal = document.getElementById('characterModal');
        if (modal) return;
        modal = document.createElement('div');
        modal.id = 'characterModal';
        modal.className = 'character-modal';
        document.body.appendChild(modal);
    }

    function syncCharacterModalTheme() {
        const modal = document.getElementById('characterModal');
        if (!modal) return;
        modal.className = 'character-modal';
        const card = modal.querySelector('.character-modal-card');
        if (card) card.className = 'character-modal-card';
        const body = document.body;
        [
            'dark-theme', 'blue-theme', 'wine-theme', 'neon-theme',
            'orange-theme', 'purple-theme', 'green-theme'
        ].forEach(theme => {
            if (body.classList.contains(theme)) {
                modal.classList.add(theme);
                if (card) card.classList.add(theme);
            }
        });
    }

    function openCharacterModal(character) {
        createCharacterModal();
        const modal = document.getElementById('characterModal');
        modal.innerHTML = `
            <div class="character-modal-bg"></div>
            <div class="character-modal-card">
                <button class="character-modal-close" aria-label="Закрити">&times;</button>
                <div class="character-modal-main">
                    <div class="character-modal-img-parallax">
                        <img src="${character.image}" alt="${character.name}" class="character-modal-img" draggable="false">
                    </div>
                    <div class="character-modal-info">
                        <h2 class="character-modal-name">${character.name}</h2>
                        <p class="character-modal-desc">${character.description}</p>
                        <ul class="character-modal-stats">
                            ${character.stats.map(stat =>
                                `<li><span class="stat-label">${stat.label}:</span> <span class="stat-value">${stat.value}</span></li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        syncCharacterModalTheme();
        modal.querySelector('.character-modal-close').onclick = closeCharacterModal;
        modal.querySelector('.character-modal-bg').onclick = closeCharacterModal;
        const imgContainer = modal.querySelector('.character-modal-img-parallax');
        const img = imgContainer.querySelector('img');
        imgContainer.onmousemove = function(e) {
            const rect = imgContainer.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `scale(1.08) translate(${x*32}px, ${y*32}px)`;
        };
        imgContainer.onmouseleave = function() {
            img.style.transform = '';
        };
    }

    function closeCharacterModal() {
        const modal = document.getElementById('characterModal');
        if (modal) modal.remove();
    }

    function showCharacterListModal() {
        createCharacterModal();
        const modal = document.getElementById('characterModal');
        modal.innerHTML = `
            <div class="character-modal-bg"></div>
            <div class="character-modal-card character-modal-list">
                <button class="character-modal-close" aria-label="Закрити">&times;</button>
                <h2 class="character-modal-list-title">Оберіть персонажа</h2>
                <div class="character-modal-list-grid">
                    ${characters.map(char => `
                        <button class="character-btn" data-char-id="${char.id}">
                            <img src="${char.image}" alt="${char.name}" class="character-btn-img"><span>${char.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        syncCharacterModalTheme();
        modal.querySelector('.character-modal-close').onclick = closeCharacterModal;
        modal.querySelector('.character-modal-bg').onclick = closeCharacterModal;
        modal.querySelectorAll('.character-btn').forEach(btn => {
            btn.onclick = () => {
                const char = characters.find(c => c.id === btn.getAttribute('data-char-id'));
                openCharacterModal(char);
            };
        });
    }

    // --- Auto theme sync on body class change ---
    const charThemeObserver = new MutationObserver(() => syncCharacterModalTheme());
    charThemeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // --- Обработчик для открытия модального окна персонажей ---
    const charactersLink = document.querySelector('.menu-item[data-lang-key="characters"]');
    if (charactersLink) {
        charactersLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (characters.length > 1) {
                showCharacterListModal();
            } else if (characters.length === 1) {
                openCharacterModal(characters[0]);
            }
        });
    }
});