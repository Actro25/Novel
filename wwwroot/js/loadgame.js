
function getSaves() {
    return JSON.parse(localStorage.getItem('novel_saves') || '[]');
}
function setSaves(saves) {
    localStorage.setItem('novel_saves', JSON.stringify(saves));
}
function renderSaves() {
    const list = document.getElementById('savegameList');
    const empty = document.getElementById('savegameEmpty');
    const saves = getSaves();
    list.innerHTML = '';
    if (!saves.length) {
        empty.style.display = '';
        list.appendChild(empty);
        return;
    }
    empty.style.display = 'none';
    saves.forEach((save, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${save.name} <small style="color:#aaa;">(${save.date})</small></span>
            <span class="savegame-actions">
                <button onclick="loadSave(${idx})">Завантажити</button>
                <button onclick="deleteSave(${idx})">Видалити</button>
            </span>`;
        list.appendChild(li);
    });
}
function saveNew() {
    const name = document.getElementById('saveName').value.trim();
    if (!name) return alert('Введіть назву збереження!');
    const saves = getSaves();
    saves.push({ name, date: new Date().toLocaleString(), data: "Дані гри..." });
    setSaves(saves);
    document.getElementById('saveName').value = '';
    renderSaves();
}
function loadSave(idx) {
    const saves = getSaves();
    alert('Завантажено: ' + saves[idx].name + '\n(Тут має бути логіка завантаження гри)');
}
function deleteSave(idx) {
    if (!confirm('Видалити це збереження?')) return;
    const saves = getSaves();
    saves.splice(idx, 1);
    setSaves(saves);
    renderSaves();
}
document.getElementById('saveNewBtn').onclick = saveNew;
renderSaves();
