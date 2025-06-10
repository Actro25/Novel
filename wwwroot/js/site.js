document.addEventListener('DOMContentLoaded', function() {
    const authorsLink = document.getElementById('authorsLink');
    const authorsMenu = document.getElementById('authorsMenu');
    const closeAuthorsMenuButton = document.getElementById('closeAuthorsMenu');

    const settingsLink = document.getElementById('settingsLink'); // Новий елемент
    const settingsMenu = document.getElementById('settingsMenu'); // Новий елемент
    const closeSettingsMenuButton = document.getElementById('closeSettingsMenu'); // Новий елемент

    const mainMenuContainer = document.querySelector('.menu-container');

    // Елементи для налаштувань
    const body = document.body;
    const themeLightButton = document.getElementById('themeLight');
    const themeDarkButton = document.getElementById('themeDark');
    const themeBlueButton = document.getElementById('themeBlue');

    const scaleSmallButton = document.getElementById('scaleSmall');
    const scaleNormalButton = document.getElementById('scaleNormal');
    const scaleLargeButton = document.getElementById('scaleLarge');

    // Функція для показу певного меню та приховування головного
    function showMenu(menuToShow) {
        if (authorsMenu) authorsMenu.classList.add('hidden');
        if (settingsMenu) settingsMenu.classList.add('hidden'); // Приховуємо всі допоміжні меню
        if (mainMenuContainer) mainMenuContainer.classList.add('hidden');

        if (menuToShow) menuToShow.classList.remove('hidden');
    }

    // Функція для повернення до головного меню
    function showMainMenu() {
        if (authorsMenu) authorsMenu.classList.add('hidden');
        if (settingsMenu) settingsMenu.classList.add('hidden');
        if (mainMenuContainer) mainMenuContainer.classList.remove('hidden');
    }

    // Логіка для меню "Автори"
    if (authorsLink && authorsMenu && closeAuthorsMenuButton && mainMenuContainer) {
        authorsLink.addEventListener('click', function(event) {
            event.preventDefault();
            showMenu(authorsMenu);
        });

        closeAuthorsMenuButton.addEventListener('click', function() {
            showMainMenu();
        });
    } else {
        console.error("Не знайдено один або кілька елементів для функціоналу меню авторів. Перевірте HTML-ідентифікатори.");
    }

    // Логіка для меню "Налаштування"
    if (settingsLink && settingsMenu && closeSettingsMenuButton && mainMenuContainer) {
        settingsLink.addEventListener('click', function(event) {
            event.preventDefault();
            showMenu(settingsMenu);
        });

        closeSettingsMenuButton.addEventListener('click', function() {
            showMainMenu();
        });

        // Логіка зміни теми
        if (themeLightButton) {
            themeLightButton.addEventListener('click', function() {
                body.classList.remove('dark-theme', 'blue-theme'); // Видаляємо всі теми, залишаючи базову (світлу)
                localStorage.setItem('theme', 'light'); // Зберігаємо вибір користувача
            });
        }
        if (themeDarkButton) {
            themeDarkButton.addEventListener('click', function() {
                body.classList.remove('blue-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            });
        }
        if (themeBlueButton) {
            themeBlueButton.addEventListener('click', function() {
                body.classList.remove('dark-theme');
                body.classList.add('blue-theme');
                localStorage.setItem('theme', 'blue');
            });
        }

        // Логіка зміни масштабу
        // Встановлюємо розмір шрифту на кореневому елементі (body або :root)
        // main-menu в CSS використовує font-size: var(--base-font-size, 1em);
        if (scaleSmallButton) {
            scaleSmallButton.addEventListener('click', function() {
                document.documentElement.style.setProperty('--base-font-size', '0.8em'); // Зменшуємо
                localStorage.setItem('scale', 'small');
            });
        }
        if (scaleNormalButton) {
            scaleNormalButton.addEventListener('click', function() {
                document.documentElement.style.setProperty('--base-font-size', '1em'); // Нормальний
                localStorage.setItem('scale', 'normal');
            });
        }
        if (scaleLargeButton) {
            scaleLargeButton.addEventListener('click', function() {
                document.documentElement.style.setProperty('--base-font-size', '1.2em'); // Збільшуємо
                localStorage.setItem('scale', 'large');
            });
        }

        // Завантаження збережених налаштувань при завантаженні сторінки
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            if (savedTheme === 'dark') {
                body.classList.add('dark-theme');
            } else if (savedTheme === 'blue') {
                body.classList.add('blue-theme');
            }
            // Для light-теми класів не додаємо, оскільки це базовий стан
        }

        const savedScale = localStorage.getItem('scale');
        if (savedScale) {
            if (savedScale === 'small') {
                document.documentElement.style.setProperty('--base-font-size', '0.8em');
            } else if (savedScale === 'normal') {
                document.documentElement.style.setProperty('--base-font-size', '1em');
            } else if (savedScale === 'large') {
                document.documentElement.style.setProperty('--base-font-size', '1.2em');
            }
        }

    } else {
        console.error("Не знайдено один або кілька елементів для функціоналу меню налаштувань. Перевірте HTML-ідентифікатори.");
    }
});