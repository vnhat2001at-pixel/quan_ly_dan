// State
let players = [];
let selectedPlayerId = null;

// DOM Elements
const playerListEl = document.getElementById('player-list');
const mainContentEl = document.getElementById('main-content');
const searchInput = document.getElementById('search-input');
const addBtn = document.getElementById('add-btn');

// Templates
const emptyStateTemplate = document.getElementById('empty-state-template');
const detailViewTemplate = document.getElementById('detail-view-template');

// Initialize
function init() {
    loadPlayers();
    renderPlayerList();
    renderMainContent();

    addBtn.addEventListener('click', handleAddPlayer);
    searchInput.addEventListener('input', (e) => renderPlayerList(e.target.value));
}

// Data Management
function loadPlayers() {
    const stored = localStorage.getItem('player_showcase_data');
    if (stored) {
        try {
            players = JSON.parse(stored);
        } catch (e) {
            players = [];
        }
    }
}

function savePlayers() {
    try {
        localStorage.setItem('player_showcase_data', JSON.stringify(players));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert('Bộ nhớ đầy! Vui lòng giảm kích thước ảnh.');
        }
    }
}

function createPlayer() {
    const newPlayer = {
        id: crypto.randomUUID(),
        name: 'Cầu thủ mới',
        description: '',
        image: null,
        audio: null
    };
    players.unshift(newPlayer);
    savePlayers();
    selectPlayer(newPlayer.id);
}

function updatePlayer(id, updates) {
    const index = players.findIndex(p => p.id === id);
    if (index > -1) {
        players[index] = { ...players[index], ...updates };
        savePlayers();
        renderPlayerList();
    }
}

function selectPlayer(id) {
    selectedPlayerId = id;
    renderPlayerList();
    renderMainContent();
}

function handleAddPlayer() {
    createPlayer();
}

// Rendering
function renderPlayerList(filterText = '') {
    playerListEl.innerHTML = '';
    const filtered = players.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));

    filtered.forEach(player => {
        const el = document.createElement('div');
        el.className = `player-item ${player.id === selectedPlayerId ? 'active' : ''}`;
        el.onclick = () => selectPlayer(player.id);

        const imgSrc = player.image || 'https://via.placeholder.com/40';
        el.innerHTML = `
            <img src="${imgSrc}" class="player-avatar-small">
            <div class="player-info-mini">
                <span class="player-name-mini">${player.name}</span>
                <span class="player-item-subtitle">ID: ${player.id.slice(0, 8)}</span>
            </div>
        `;
        playerListEl.appendChild(el);
    });
}

function renderMainContent() {
    mainContentEl.innerHTML = '';

    if (!selectedPlayerId) {
        mainContentEl.appendChild(emptyStateTemplate.content.cloneNode(true));
        return;
    }

    const player = players.find(p => p.id === selectedPlayerId);
    if (!player) return;

    const clone = detailViewTemplate.content.cloneNode(true);
    
    // Bind Data
    const nameInput = clone.getElementById('detail-name');
    const descInput = clone.getElementById('detail-description');
    const playerImg = clone.getElementById('detail-image');
    const idDisplay = clone.getElementById('player-id-display');
    const audioPlayer = clone.getElementById('detail-audio');
    
    nameInput.value = player.name;
    descInput.value = player.description || '';
    idDisplay.textContent = `ID: ${player.id}`;
    if (player.image) playerImg.src = player.image;
    if (player.audio) audioPlayer.src = player.audio;

    // Events
    nameInput.onchange = (e) => updatePlayer(player.id, { name: e.target.value });
    descInput.onchange = (e) => updatePlayer(player.id, { description: e.target.value });
    
    clone.getElementById('delete-btn').onclick = () => {
        if(confirm('Xóa cầu thủ này?')) {
            players = players.filter(p => p.id !== player.id);
            selectedPlayerId = null;
            savePlayers();
            renderPlayerList();
            renderMainContent();
        }
    };

    clone.getElementById('image-upload').onchange = (e) => handleFile(e.target.files[0], 'image', player.id);
    clone.getElementById('audio-upload').onchange = (e) => handleFile(e.target.files[0], 'audio', player.id);

    // QUAN TRỌNG: Append vào DOM trước khi tạo QR
    mainContentEl.appendChild(clone);

    // Tạo QR Code ngay lập tức sau khi append
    const qrContainer = document.getElementById('qrcode');
    const qrData = `Cầu thủ: ${player.name}\nThông tin: ${player.description || 'N/A'}`;
    
    if (qrContainer) {
        qrContainer.innerHTML = '';
        const qrcode = new QRCode(qrContainer, {
            text: qrData,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Xử lý nút xuất QR
        document.getElementById('download-qr-btn').onclick = () => {
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL("image/png");
                link.download = `QR-${player.name.replace(/\s+/g, '-')}.png`;
                link.click();
            }
        };
    }
}

function handleFile(file, type, playerId) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        updatePlayer(playerId, { [type]: e.target.result });
        renderMainContent();
    };
    reader.readAsDataURL(file);
}

init();