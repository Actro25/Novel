document.addEventListener('DOMContentLoaded', function() {
    // -------------------- DOM Елементи (знаходимо за ID) --------------------
    const authorsLink = document.getElementById('authorsLink');
    const authorsMenu = document.getElementById('authorsMenu');
    const closeAuthorsMenuButton = document.getElementById('closeAuthorsMenu');

    const settingsLink = document.getElementById('settingsLink');
    const settingsMenu = document.getElementById('settingsMenu');
    const closeSettingsMenuButton = document.getElementById('closeSettingsMenu');

    const menuLabel = document.getElementById('menuLabel'); // Напис "МЕНЮ", який викликає меню (тільки для in-game-menu)
    const mainMenuContainer = document.getElementById('mainMenuContainer'); // Головний контейнер меню

    const body = document.body; // Основний елемент body для зміни класів

    // Кнопки для налаштувань теми
    const themeLightButton = document.getElementById('themeLight');
    const themeDarkButton = document.getElementById('themeDark');
    const themeBlueButton = document.getElementById('themeBlue');

    // Кнопки для налаштувань масштабу
    const scaleSmallButton = document.getElementById('scaleSmall');
    const scaleNormalButton = document.getElementById('scaleNormal');
    const scaleLargeButton = document.getElementById('scaleLarge');

    // Елементи для відображення поточної мови та озвучки
    const languageValueSpan = document.getElementById('languageValue');
    const voiceoverValueSpan = document.getElementById('voiceoverValue');

    // Кнопки для налаштувань мови
    const langUkrainianButton = document.getElementById('langUkrainian');
    const langRussianButton = document.getElementById('langRussian');
    const langEnglishButton = document.getElementById('langEnglish');

    // -------------------- Поточні налаштування та переклади --------------------
    let currentSettings = {
        theme: 'light',      // 'light', 'dark', 'blue'
        scale: 'normal',     // 'small', 'normal', 'large'
        language: 'ukrainian'// 'ukrainian', 'russian', 'english'
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
            "current_voiceover": "Українська"
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
            "current_voiceover": "Русский"
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
            "current_voiceover": "English"
        }
    };

    // -------------------- Функції взаємодії з БД (без змін) --------------------
    async function loadSettingsFromDb() {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                const settings = await response.json();
                console.log('Loaded settings from DB:', settings);
                currentSettings = settings;
                applySettings(settings);
                updateLanguageText(currentSettings.language);
            } else {
                console.error('Failed to load settings from DB:', response.status, response.statusText);
                // Застосовуємо дефолтні або поточні налаштування, якщо завантаження не вдалося
                applySettings(currentSettings);
                updateLanguageText(currentSettings.language);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            // Застосовуємо дефолтні або поточні налаштування у випадку помилки мережі
            applySettings(currentSettings);
            updateLanguageText(currentSettings.language);
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

    /**
     * Застосовує всі налаштування (тема, масштаб, мова) до DOM.
     * @param {object} settings - Об'єкт з поточними налаштуваннями.
     */
    function applySettings(settings) {
        // Застосування теми
        body.classList.remove('dark-theme', 'blue-theme');
        if (settings.theme === 'dark') {
            body.classList.add('dark-theme');
        } else if (settings.theme === 'blue') {
            body.classList.add('blue-theme');
        }

        // Застосування масштабу (оновлено для використання класів CSS)
        body.classList.remove('scale-75-percent', 'scale-85-percent', 'scale-100-percent', 'scale-115-percent', 'scale-130-percent');
        switch (settings.scale) {
            case 'small':
                body.classList.add('scale-75-percent');
                break;
            case 'normal':
                body.classList.add('scale-100-percent');
                break;
            case 'large':
                body.classList.add('scale-130-percent');
                break;
            default:
                body.classList.add('scale-100-percent'); // Дефолтне значення
                break;
        }

        // Оновлення активних кнопок налаштувань
        updateActiveButton('theme-button', settings.theme); // У вас може бути клас theme-button для всіх кнопок тем
        updateActiveButton('scale-button', settings.scale); // У вас може бути клас scale-button для всіх кнопок масштабу
        updateActiveButton('lang-button', settings.language); // У вас може бути клас lang-button для всіх кнопок мови

        // Оновлюємо текст інтерфейсу згідно з вибраною мовою
        updateLanguageText(settings.language);
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
            if (currentLangPack[key] !== undefined) { // Перевіряємо, чи є ключ у пакунку
                if (element.classList.contains('menu-item') && element.querySelector('.achievement-count')) {
                    // Спеціальна обробка для Achievement
                    const countSpan = element.querySelector('.achievement-count').outerHTML;
                    element.innerHTML = currentLangPack[key] + ' ' + countSpan;
                } else if (element.id === "mainMenuSubtitle") { // Перевірка за ID для підзаголовка
                    element.innerHTML = '<span class="icon">♥</span> ' + currentLangPack[key];
                } else if (element.classList.contains('author-info')) { // Для авторів, якщо вони мають клас author-info
                    const authorNameSpan = element.querySelector('.author-name');
                    if (authorNameSpan) {
                        // Якщо елемент - це <li> який містить текст і <span> з ім'ям автора
                        // Ми оновлюємо текстовий вузол перед authorNameSpan
                        const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if (textNode) {
                            textNode.textContent = currentLangPack[key] + ' ';
                        } else { // Якщо текстового вузла немає, додаємо його
                            element.prepend(document.createTextNode(currentLangPack[key] + ' '));
                        }
                    } else {
                        element.textContent = currentLangPack[key];
                    }
                }
                else {
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
        if (menuLabel) {
            menuLabel.textContent = currentLangPack.main_menu_label || "МЕНЮ";
        }
        if (document.title) { // Оновлення заголовка сторінки
            document.title = currentLangPack.menu_title || "Dream";
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

    /**
     * Перемикає видимість головного меню (використовується для in-game-menu).
     * Якщо меню приховується, зберігає налаштування.
     */
    function toggleMainMenu() {
        hideAllSubMenus(); // Приховуємо будь-які відкриті підменю
        if (mainMenuContainer) {
            mainMenuContainer.classList.toggle('hidden');
            if (mainMenuContainer.classList.contains('hidden')) {
                saveSettingsToDb(currentSettings); // Зберігаємо налаштування при закритті головного меню
            }
        }
    }

    // -------------------- Обробники подій --------------------

    // Обробник для напису "МЕНЮ" (актуально для in-game-menu)
    if (menuLabel) {
        menuLabel.addEventListener('click', toggleMainMenu);
    } else {
        // Якщо menuLabel відсутній, це, ймовірно, статичне головне меню.
        // Перевіряємо, чи має головне меню бути видимим за замовчуванням.
        if (mainMenuContainer && mainMenuContainer.classList.contains('hidden')) {
             mainMenuContainer.classList.remove('hidden');
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

    // Обробники для кнопок вибору теми
    if (themeLightButton) themeLightButton.addEventListener('click', function() {
        currentSettings.theme = 'light';
        applySettings(currentSettings);
    });
    if (themeDarkButton) themeDarkButton.addEventListener('click', function() {
        currentSettings.theme = 'dark';
        applySettings(currentSettings);
    });
    if (themeBlueButton) themeBlueButton.addEventListener('click', function() {
        currentSettings.theme = 'blue';
        applySettings(currentSettings);
    });

    // Обробники для кнопок вибору масштабу
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
    const exitButton = document.getElementById('exitButton'); // Припустимо, у вас є кнопка з id="exitButton"
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            alert('Вихід з гри (функціонал залежить від реалізації гри або браузера)');
            // У реальній грі тут може бути:
            // window.location.href = '/home'; // Перехід на головну сторінку
            // window.close(); // Спроба закрити вікно (часто блокується браузерами)
        });
    }


    // -------------------- Ініціалізація налаштувань при завантаженні --------------------
    loadSettingsFromDb(); // Завантажуємо та застосовуємо налаштування з БД при старті
});