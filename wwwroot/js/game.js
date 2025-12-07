document.addEventListener('DOMContentLoaded', () => {
    // --- Основные элементы меню ---
    const menuButton = document.getElementById('game-menu-button');
    const overlay = document.getElementById('gameMenuOverlay');
    const gameMenu = document.getElementById('gameMenu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    // --- Элементы сохранения ---
    const showSavesBtn = document.getElementById('show-saves-btn');
    const saveSlots = document.getElementById('saveSlots');
    const saveNameInput = document.getElementById('saveNameInput');
    const selectedSlotInput = document.getElementById('selectedSlot');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const cancelSaveBtn = document.getElementById('cancel-save-btn');
    const saveSlotsContainer = document.getElementById('saveSlots');

    // --- Скрыть все меню ---
    const hideAllMenus = () => {
        overlay?.classList.add('hidden');
        gameMenu?.classList.add('hidden');
        saveSlots?.classList.add('hidden');
        saveNameInput?.classList.add('hidden');
        menuButton?.classList.remove('open');
    };

    // --- Показать главное меню ---
    const showGameMenu = () => {
        hideAllMenus();
        overlay?.classList.remove('hidden');
        gameMenu?.classList.remove('hidden');
        menuButton?.classList.add('open');
    };

    // --- Показать список слотов ---
    const showSaveSlots = () => {
        gameMenu?.classList.add('hidden');
        saveSlots?.classList.remove('hidden');
        menuButton?.classList.add('open');
    };

    // --- Показать поле ввода имени сохранения ---
    const showSaveNameInput = (slot) => {
        saveSlots?.classList.add('hidden');
        saveNameInput?.classList.remove('hidden');
        if (selectedSlotInput) selectedSlotInput.value = slot;
    };

    // --- Обработчики меню ---
    menuButton?.addEventListener('click', () => {
        const isOpen = menuButton.classList.contains('open');
        if (isOpen) {
            hideAllMenus();
        } else {
            showGameMenu();
        }
    });

    overlay?.addEventListener('click', hideAllMenus);
    closeMenuBtn?.addEventListener('click', hideAllMenus);

    // --- Обработчики сохранения ---
    showSavesBtn?.addEventListener('click', showSaveSlots);
    backToMenuBtn?.addEventListener('click', () => {
        saveSlots?.classList.add('hidden');
        gameMenu?.classList.remove('hidden');
    });
    cancelSaveBtn?.addEventListener('click', hideAllMenus);

    saveSlotsContainer?.addEventListener('click', (e) => {
        const btn = e.target.closest('button.save-slot');
        const slot = btn?.dataset?.slot;
        if (slot) showSaveNameInput(slot);
    });

    // --- Logic for Transition Screens (CheckAct/CheckPart) ---
    const transitionWrapper = document.getElementById('transition-wrapper');
    if (transitionWrapper && typeof actionUrl !== 'undefined') {
        transitionWrapper.addEventListener('click', () => {
            window.location.href = actionUrl;
        });
    }

    // --- Переход по кнопкам с .answer-button (только внутри .answers) ---
    const answersContainer = document.querySelector('.answers');
    if (answersContainer) {
        answersContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.answer-button');
            if (target?.dataset?.url) {
                window.location.href = target.dataset.url;
            }
        });
    }

    // --- Достижения ---
    const achievementPopup = document.getElementById('achievement-popup');
    const gameDataElement = document.getElementById('game-data');

    const handleAchievements = async () => {
        if (!gameDataElement) return;
        let gameData;
        try {
            gameData = JSON.parse(gameDataElement.innerText);
        } catch {
            console.warn("Некорректный JSON для достижений");
            return;
        }

        if (!gameData.achievements || !gameData.achievements.length) return;

        achievementPopup?.classList.add('visible');
        setTimeout(() => achievementPopup?.classList.remove('visible'), 5000);

        try {
            await fetch('/PlayGame/UpdateAchivments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData.achievements)
            });
        } catch (error) {
            console.error("Ошибка обновления достижений:", error);
        }
    };
    

    handleAchievements();


window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const video = document.querySelector("#preloader video");

    const minDuration = 1000;  // минимальное время показа — 1 секунда
    const maxDuration = 5000;  // максимум — 5 секунд


    const startTime = Date.now();
    let videoEnded = false;

    const hidePreloader = () => {
        preloader.classList.add("fade-out");
        setTimeout(() => preloader.remove(), 600);
    };

    // Когда видео закончилось
    video.addEventListener("ended", () => {
        videoEnded = true;
        const elapsed = Date.now() - startTime;
        if (elapsed >= minDuration) {
            hidePreloader();
        } else {
            // ждем, чтобы выдержать minDuration
            setTimeout(hidePreloader, minDuration - elapsed);
        }
    });

    // Страховка — убираем прелоадер через maxDuration, даже если видео не закончилось
    setTimeout(() => {
        if (!videoEnded) hidePreloader();
    }, maxDuration);
});


});