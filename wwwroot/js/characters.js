// --- Character Data ---
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

function createCharacterModal() {
    let modal = document.getElementById('characterModal');
    if (modal) return;
    modal = document.createElement('div');
    modal.id = 'characterModal';
    modal.className = 'character-modal';
    document.body.appendChild(modal);
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

// --- Export for global use ---
window.Characters = {
    characters,
    openCharacterModal,
    showCharacterListModal,
    syncCharacterModalTheme
};
