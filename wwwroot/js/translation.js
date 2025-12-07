const translations = {
    uk: {
        peaceful_mode: "ГРАТИ",
        continue_game: "ПРОДОВЖИТИ",
        new_game: "НОВА ГРА",
        load_game: "ЗАВАНТАЖИТИ",
        characters: "ПЕРСОНАЖІ",
        settings: "НАЛАШТУВАННЯ",
        achievements: "ДОСЯГНЕННЯ",
        authors: "АВТОРИ",
        exit: "ВИХІД",
        close: "ЗАКРИТИ",
        authors_novel_title: "АВТОРИ НОВЕЛИ",
        scenario_writer: "Сценарист:",
        artist: "Художник:",
        programmer: "Програміст:",
        music: "Музика:",
        settings_title: "НАЛАШТУВАННЯ",
        interface_themes: "ТЕМИ ІНТЕРФЕЙСУ",
        theme_light: "СВІТЛА",
        theme_dark: "ТЕМНА",
        interface_scale: "МАСШТАБ ІНТЕРФЕЙСУ",
        language: "МОВА",
        music_on: "Вимкнути",
        music_off: "Включити",
        scale_small: "ДРІБНИЙ",
        scale_normal: "ЗВИЧАЙНИЙ",
        scale_large: "ВЕЛИКИЙ"
    },
    en: {
        peaceful_mode: "PLAY",
        continue_game: "CONTINUE",
        new_game: "NEW GAME",
        load_game: "LOAD",
        characters: "CHARACTERS",
        settings: "SETTINGS",
        achievements: "ACHIEVEMENTS",
        authors: "AUTHORS",
        exit: "EXIT",
        close: "CLOSE",
        authors_novel_title: "VISUAL NOVEL AUTHORS",
        scenario_writer: "Scenario:",
        artist: "Artist:",
        programmer: "Programmer:",
        music: "Music:",
        settings_title: "SETTINGS",
        interface_themes: "INTERFACE THEMES",
        theme_light: "LIGHT",
        theme_dark: "DARK",
        interface_scale: "INTERFACE SCALE",
        language: "LANGUAGE",
        music_on: "Turn Off",
        music_off: "Turn On",
        scale_small: "SMALL",
        scale_normal: "NORMAL",
        scale_large: "LARGE"
    }
};

let currentLang = 'uk';

/**
 * Обновляет все элементы интерфейса по текущему языку
 */
function updateTranslations(lang) {
    const dictionary = translations[lang];
    if (!dictionary) {
        console.warn(`No translations found for language: ${lang}`);
        return;
    }

    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        const translatedText = dictionary[key];

        if (!translatedText) {
            console.warn(`Missing translation for key: ${key} in language: ${lang}`);
            return;
        }

        const authorSpan = el.querySelector('.author-name');

        if (authorSpan) {
            // Оставляем <span>, меняем текст перед ним
            el.childNodes[0].textContent = translatedText + ' ';
        } else if (['SPAN', 'P', 'BUTTON', 'H3', 'H4'].includes(el.tagName)) {
            el.innerText = translatedText;
        } else {
            const span = el.querySelector('span');
            if (span) {
                span.innerText = translatedText;
            }
        }
    });

    document.querySelectorAll('.lang-voice-value').forEach(el => {
        el.innerText = lang === 'en' ? 'English' : 'Українська';
    });
}

/**
 * Устанавливает язык и обновляет интерфейс
 */
function setLanguage(lang) {
    currentLang = lang;
    updateTranslations(lang);
}

/**
 * Инициализация переключателей языков
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.dataset.lang;
            if (selectedLang !== currentLang) {
                setLanguage(selectedLang);
            }
        });
    });

    setLanguage(currentLang);
});
