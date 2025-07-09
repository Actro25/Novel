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

function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        const newText = translations[lang][key];
        if (!newText) return;

        // Специальный случай: если внутри есть <span class="author-name"> — сохраняем его
        const authorSpan = el.querySelector('.author-name');
        if (authorSpan) {
            el.childNodes[0].textContent = newText + ' '; // заменяем только текст до <span>
            return;
        }

        // Стандартные заголовки, кнопки и простые span/p
        if (['SPAN', 'P', 'BUTTON', 'H3', 'H4'].includes(el.tagName)) {
            el.innerText = newText;
        } else {
            const span = el.querySelector('span');
            if (span) {
                span.innerText = newText;
            }
        }
    });

    document.querySelectorAll('.lang-voice-value').forEach(el => {
        el.innerText = lang === 'en' ? 'English' : 'Українська';
    });
}



document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.dataset.lang;
            setLanguage(selectedLang);
        });
    });

    setLanguage(currentLang); // начальная установка
});
