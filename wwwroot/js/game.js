document.addEventListener('DOMContentLoaded', () => {
    // --- Shared Menu Logic ---
    const menuButton = document.getElementById('game-menu-button');
    const overlay = document.getElementById('gameMenuOverlay');
    const gameMenu = document.getElementById('gameMenu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    const hideAllMenus = () => {
        if (overlay) overlay.classList.add('hidden');
        if (gameMenu) gameMenu.classList.add('hidden');
        
        // Также скрываем игровые меню, если они существуют
        const saveSlots = document.getElementById('saveSlots');
        const saveNameInput = document.getElementById('saveNameInput');
        if (saveSlots) saveSlots.classList.add('hidden');
        if (saveNameInput) saveNameInput.classList.add('hidden');

        // ДОБАВЛЕНО: Сбрасываем иконку обратно в "гамбургер" при закрытии любого меню
        if (menuButton) menuButton.classList.remove('open');
    };

    const showGameMenu = () => {
        hideAllMenus(); // Сначала все скрываем на случай, если открыто другое меню
        if (overlay) overlay.classList.remove('hidden');
        if (gameMenu) gameMenu.classList.remove('hidden');

        // ДОБАВЛЕНО: Превращаем иконку в "крестик" при открытии
        if (menuButton) menuButton.classList.add('open');
    };

    // ИЗМЕНЕНО: Логика клика по кнопке теперь может и открывать, и закрывать меню
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            // Проверяем, открыто ли меню, по наличию класса 'open' у кнопки
            const isMenuOpen = menuButton.classList.contains('open');
            if (isMenuOpen) {
                hideAllMenus(); // Если открыто - закрываем
            } else {
                showGameMenu(); // Если закрыто - открываем
            }
        });
    }

    if (overlay) overlay.addEventListener('click', hideAllMenus);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', hideAllMenus);


    // --- Logic for Transition Screens (CheckAct/CheckPart) ---
    const transitionWrapper = document.getElementById('transition-wrapper');
    if (transitionWrapper) {
        // The redirect URL is passed from the view via a global variable
        if (typeof actionUrl !== 'undefined') {
            transitionWrapper.addEventListener('click', () => {
                window.location.href = actionUrl;
            });
        }
    }


    // --- Logic for Main Game Scene (PlayGameSceneChange) ---
    const navigationContainer = document.getElementById('navigation-container');
    if (navigationContainer) {
        // This block will only run on the main game page
        
        // --- Game-specific DOM Elements ---
        const elements = {
            showSavesBtn: document.getElementById('show-saves-btn'),
            saveSlots: document.getElementById('saveSlots'),
            backToMenuBtn: document.getElementById('back-to-menu-btn'),
            saveSlotsContainer: document.querySelector('#saveSlots'),
            saveNameInput: document.getElementById('saveNameInput'),
            cancelSaveBtn: document.getElementById('cancel-save-btn'),
            selectedSlotInput: document.getElementById('selectedSlot'),
            achievementPopup: document.getElementById('achievement-popup'),
            gameDataElement: document.getElementById('game-data')
        };
        
        // --- Game-specific Menu/Save Functions ---
        const showSaveSlots = () => {
            if(gameMenu) gameMenu.classList.add('hidden');
            if(elements.saveSlots) elements.saveSlots.classList.remove('hidden');
            // Убеждаемся, что иконка-крестик остается, т.к. мы все еще в меню
            if (menuButton) menuButton.classList.add('open');
        };

        const showSaveNameInput = (slot) => {
            if(elements.saveSlots) elements.saveSlots.classList.add('hidden');
            if(elements.saveNameInput) elements.saveNameInput.classList.remove('hidden');
            if(elements.selectedSlotInput) elements.selectedSlotInput.value = slot;
        };
        
        // --- Game-specific Event Listeners ---
        if (elements.showSavesBtn) elements.showSavesBtn.addEventListener('click', showSaveSlots);
        if (elements.backToMenuBtn) elements.backToMenuBtn.addEventListener('click', showGameMenu);
        if (elements.cancelSaveBtn) elements.cancelSaveBtn.addEventListener('click', hideAllMenus);

        if (elements.saveSlotsContainer) {
            elements.saveSlotsContainer.addEventListener('click', (e) => {
                if (e.target && e.target.matches('button.save-slot')) {
                    const slot = e.target.dataset.slot;
                    if(slot) showSaveNameInput(slot);
                }
            });
        }
        
        navigationContainer.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.answer-button');
            if (targetButton && targetButton.dataset.url) {
                window.location.href = targetButton.dataset.url;
            }
        });

        // --- Achievement Logic ---
        const handleAchievements = async () => {
            if (!elements.gameDataElement) return;
            const gameData = JSON.parse(elements.gameDataElement.innerHTML);

            if (!gameData.achievements || gameData.achievements.length === 0) return;

            if (elements.achievementPopup) {
                elements.achievementPopup.classList.add('visible');
                setTimeout(() => elements.achievementPopup.classList.remove('visible'), 5000);
            }
            try {
                await fetch('/PlayGame/UpdateAchivments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(gameData.achievements)
                });
            } catch (error) {
                console.error("Failed to update achievements:", error);
            }
        };

        handleAchievements();
    }
    
});