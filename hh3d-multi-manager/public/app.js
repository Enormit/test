// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let accounts = [];
const eventSources = {};

// API Base URL (Relative because it's served by backend)
const API_URL = '';

document.addEventListener('DOMContentLoaded', () => {
    loadAccounts();
    setupEventListeners();
});

// ==========================================================================
// EVENT LISTENERS & INITIALIZATION
// ==========================================================================
function setupEventListeners() {
    // Open add account modal
    document.getElementById('btn-open-add-modal').addEventListener('click', () => {
        openModal('add-account-modal');
    });

    // Form submissions
    document.getElementById('add-account-form').addEventListener('submit', handleAddAccount);
    document.getElementById('config-form').addEventListener('submit', handleSaveConfig);
}

// ==========================================================================
// CORE CRUD OPERATIONS
// ==========================================================================

// Load accounts from Backend
async function loadAccounts() {
    try {
        const res = await fetch(`${API_URL}/api/accounts`);
        const result = await res.json();
        
        if (result.success) {
            accounts = result.data;
            renderAccountsGrid();
            updateGlobalStats();
        } else {
            showToast('Không thể tải danh sách tài khoản: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối máy chủ backend.', 'error');
    }
}

// Add Account
async function handleAddAccount(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('acc-name').value.trim();
    const cookiesInput = document.getElementById('acc-cookies').value.trim();
    const submitBtn = document.getElementById('btn-submit-add');
    
    if (!cookiesInput) {
        showToast('Vui lòng cung cấp chuỗi Cookie đăng nhập!', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang xác thực...';

    try {
        const res = await fetch(`${API_URL}/api/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cookies: cookiesInput, name: nameInput })
        });
        
        const result = await res.json();
        
        if (result.success) {
            showToast(result.message, 'success');
            closeModal('add-account-modal');
            document.getElementById('add-account-form').reset();
            loadAccounts();
        } else {
            showToast('Lỗi: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối máy chủ.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Xác nhận thêm';
    }
}

// Save Configuration
async function handleSaveConfig(e) {
    e.preventDefault();
    
    const id = document.getElementById('config-acc-id').value;
    
    const configData = {
        tasks: {
            checkin: document.getElementById('task-checkin').checked,
            chest: document.getElementById('task-chest').checked,
            boss: document.getElementById('task-boss').checked,
            trial: document.getElementById('task-trial').checked,
            qa: document.getElementById('task-qa').checked,
            mining: document.getElementById('task-mining').checked,
            refine: document.getElementById('task-refine').checked,
            gamble: document.getElementById('task-gamble').checked,
            spin: document.getElementById('task-spin').checked
        },
        mining: {
            mineType: document.getElementById('mine-type').value,
            mineId: document.getElementById('mine-id').value ? parseInt(document.getElementById('mine-id').value) : null
        },
        refine: {
            autoAcceptInvite: document.getElementById('refine-accept-invite').checked,
            autoLeave: document.getElementById('refine-auto-leave').checked
        },
        gamble: {
            choice: document.getElementById('gamble-choice').value
        }
    };

    try {
        const res = await fetch(`${API_URL}/api/accounts/${id}/config`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configData)
        });
        
        const result = await res.json();
        if (result.success) {
            showToast(result.message, 'success');
            closeModal('config-modal');
            loadAccounts();
        } else {
            showToast('Lỗi lưu cấu hình: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối máy chủ.', 'error');
    }
}

// Start Worker
async function startWorker(id) {
    try {
        const res = await fetch(`${API_URL}/api/accounts/${id}/start`, { method: 'POST' });
        const result = await res.json();
        if (result.success) {
            showToast('Bật chạy ngầm thành công!', 'success');
            loadAccounts();
        } else {
            showToast('Thất bại: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối.', 'error');
    }
}

// Stop Worker
async function stopWorker(id) {
    try {
        const res = await fetch(`${API_URL}/api/accounts/${id}/stop`, { method: 'POST' });
        const result = await res.json();
        if (result.success) {
            showToast('Đã dừng chạy ngầm.', 'info');
            loadAccounts();
        } else {
            showToast('Thất bại: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối.', 'error');
    }
}

// Delete Account
async function deleteAccount(id, name) {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản ${name} khỏi hệ thống?`)) return;
    
    try {
        const res = await fetch(`${API_URL}/api/accounts/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            showToast('Đã xóa tài khoản.', 'info');
            loadAccounts();
        } else {
            showToast('Thất bại: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('Lỗi kết nối.', 'error');
    }
}

// ==========================================
// RENDER & UI UPDATES
// ==========================================
function renderAccountsGrid() {
    const grid = document.getElementById('accounts-grid');
    grid.innerHTML = '';
    
    // Close existing event sources
    Object.keys(eventSources).forEach(id => {
        eventSources[id].close();
        delete eventSources[id];
    });

    if (accounts.length === 0) {
        grid.innerHTML = `
            <div class="grid-loading" style="padding: 6rem 1rem;">
                <p style="font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem;">Chưa có tài khoản nào được thêm</p>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Vui lòng bấm nút <strong>Thêm tài khoản</strong> ở góc phải để bắt đầu auto.</p>
            </div>
        `;
        return;
    }

    accounts.forEach(acc => {
        const card = document.createElement('div');
        card.className = 'account-card';
        card.id = `card-${acc.id}`;
        
        // Dynamic status badge details
        let statusClass = 'offline';
        let statusText = 'Đang Tắt';
        if (acc.isRunning) {
            statusClass = 'online';
            statusText = 'Đang chạy';
        }

        // Determine active task badges
        const taskLabels = {
            checkin: '📅 Checkin',
            chest: '🎁 Rương PL',
            boss: '🛡️ Boss',
            trial: '💎 Thí Luyện',
            qa: '❓ Vấn Đáp',
            mining: '⛏️ Mỏ',
            refine: '🧪 Luyện Đan',
            gamble: '🪙 Đổ Thạch',
            spin: '🎡 Vòng Quay'
        };
        
        let taskBadgesHtml = '';
        Object.entries(acc.config.tasks).forEach(([taskKey, isEnabled]) => {
            if (taskLabels[taskKey]) {
                taskBadgesHtml += `<span class="task-badge ${isEnabled ? 'active' : ''}">${taskLabels[taskKey]}</span>`;
            }
        });

        // Format stats numbers with commas
        const formatNumber = (num) => num ? num.toLocaleString() : '0';

        card.innerHTML = `
            <div class="card-header">
                <div class="acc-info">
                    <h2>${acc.name}</h2>
                    <p>ID: ${acc.id}</p>
                </div>
                <div class="acc-status">
                    <span class="status-dot ${statusClass}"></span>
                    <span>${statusText}</span>
                </div>
            </div>

            <div class="char-stats">
                <div class="stat-item">
                    <span class="label">Cấp bậc</span>
                    <span class="val" title="${acc.stats?.level || 'Chưa cập nhật'}">${acc.stats?.level || 'Chưa rõ'}</span>
                </div>
                <div class="stat-item">
                    <span class="label">Linh Thạch</span>
                    <span class="val text-primary" title="${formatNumber(acc.stats?.lingThach)}">${formatNumber(acc.stats?.lingThach)}</span>
                </div>
                <div class="stat-item">
                    <span class="label">Tông môn</span>
                    <span class="val" title="${acc.stats?.sect || 'Không có'}">${acc.stats?.sect || 'Không có'}</span>
                </div>
            </div>

            <div class="task-badge-container">
                ${taskBadgesHtml}
            </div>

            <!-- Terminal logs window -->
            <div class="log-terminal" id="logs-${acc.id}">
                <div class="log-line"><span class="log-time">[Hệ Thống]</span> <span class="log-content info">Đang kết nối luồng log...</span></div>
            </div>

            <div class="card-actions">
                ${acc.isRunning ? 
                    `<button class="btn btn-ctrl-stop" onclick="stopWorker('${acc.id}')">Dừng Chạy</button>` :
                    `<button class="btn btn-ctrl-start" onclick="startWorker('${acc.id}')">Bắt Đầu</button>`
                }
                <button class="btn btn-secondary btn-ctrl-setting" onclick="openConfigModal('${acc.id}')" title="Cấu hình tác vụ">
                    <span class="gear-icon">⚙️</span>
                </button>
                <button class="btn btn-danger" style="flex: 0 0 42px; padding: 0;" onclick="deleteAccount('${acc.id}', '${acc.name}')" title="Xóa tài khoản">
                    🗑️
                </button>
            </div>
        `;
        
        grid.appendChild(card);

        // Open SSE connection for this account's logs
        setupLogSSE(acc.id);
    });
}

// Establish Log Stream SSE
function setupLogSSE(id) {
    const term = document.getElementById(`logs-${id}`);
    
    // Clear initial state
    term.innerHTML = '';

    const source = new EventSource(`${API_URL}/api/accounts/${id}/logs`);
    eventSources[id] = source;

    source.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            appendLogLine(term, data);
        } catch (e) {
            console.error('Lỗi parse log SSE:', e);
        }
    };

    source.onerror = (e) => {
        // Safe to ignore re-connections
        // appendLogLine(term, { time: '--:--', message: 'Lỗi đồng bộ log (Đang kết nối lại...)', level: 'warning' });
    };
}

function appendLogLine(container, log) {
    if (!container) return;
    
    const line = document.createElement('div');
    line.className = 'log-line';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    timeSpan.textContent = `[${log.time || '00:00:00'}]`;
    
    const contentSpan = document.createElement('span');
    contentSpan.className = `log-content ${log.level || 'info'}`;
    contentSpan.innerHTML = log.message;

    line.appendChild(timeSpan);
    line.appendChild(contentSpan);
    container.appendChild(line);

    // Auto scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// Update Dashboard Header stats
function updateGlobalStats() {
    document.getElementById('global-total-accounts').textContent = accounts.length;
    
    const running = accounts.filter(a => a.isRunning).length;
    document.getElementById('global-active-workers').textContent = running;
    
    const totalLingThach = accounts.reduce((acc, current) => acc + (current.stats?.lingThach || 0), 0);
    document.getElementById('global-total-lingthach').textContent = totalLingThach.toLocaleString();
}

// ==========================================
// MODAL CONTROLLERS
// ==========================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Open settings config modal
function openConfigModal(id) {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    document.getElementById('config-acc-id').value = acc.id;
    document.getElementById('config-title').textContent = `Cấu Hình: ${acc.name}`;

    // Config form setup values
    document.getElementById('task-checkin').checked = acc.config.tasks.checkin;
    document.getElementById('task-chest').checked = acc.config.tasks.chest;
    document.getElementById('task-boss').checked = acc.config.tasks.boss;
    document.getElementById('task-trial').checked = acc.config.tasks.trial;
    document.getElementById('task-qa').checked = acc.config.tasks.qa;
    document.getElementById('task-mining').checked = acc.config.tasks.mining;
    document.getElementById('task-refine').checked = acc.config.tasks.refine;
    document.getElementById('task-gamble').checked = acc.config.tasks.gamble;
    document.getElementById('task-spin').checked = acc.config.tasks.spin;

    document.getElementById('mine-type').value = acc.config.mining.mineType || 'silver';
    document.getElementById('mine-id').value = acc.config.mining.mineId || '';

    document.getElementById('refine-accept-invite').checked = acc.config.refine.autoAcceptInvite;
    document.getElementById('refine-auto-leave').checked = acc.config.refine.autoLeave;

    document.getElementById('gamble-choice').value = acc.config.gamble.choice || 'tai';

    openModal('config-modal');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon base on type
    const icons = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌' };
    const icon = icons[type] || 'ℹ️';

    toast.innerHTML = `
        <span style="font-size:1.1rem">${icon}</span>
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Fadeout after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function copyToClipboard(element) {
    const text = element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép lệnh vào bộ nhớ tạm!', 'success');
    }).catch(err => {
        showToast('Không thể tự sao chép, vui lòng bôi đen chọn tay.', 'warning');
    });
}
