const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const puppeteer = require('puppeteer-core');
const AdmZip = require('adm-zip');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;
const PROFILES_FILE = path.join(__dirname, 'profiles.json');
const EXTENSION_PATH = path.resolve(__dirname, '../../auto-hh3d/extention');
const PROFILES_DIR = path.join(__dirname, '../profiles');

// Ensure profiles user-data directory exists
if (!fs.existsSync(PROFILES_DIR)) {
    fs.mkdirSync(PROFILES_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// In-memory active browser instances
const activeBrowsers = {};

// Auto-detect Firefox path on Windows
function getFirefoxPath() {
    const paths = [
        'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
        'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
        path.join(process.env.LOCALAPPDATA || '', 'Mozilla Firefox\\firefox.exe')
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

// Read profiles from JSON
function readProfiles() {
    try {
        if (!fs.existsSync(PROFILES_FILE)) {
            fs.writeFileSync(PROFILES_FILE, JSON.stringify([]));
        }
        const data = fs.readFileSync(PROFILES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading profiles:', e);
        return [];
    }
}

// Write profiles to JSON
function writeProfiles(profiles) {
    try {
        fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
    } catch (e) {
        console.error('Error writing profiles:', e);
    }
}

// Broadcast message to all WebSocket clients
function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Send a log message to the front-end console
function sendLog(profileId, level, text) {
    const timestamp = new Date().toLocaleTimeString();
    const logObj = { profileId, level, text, timestamp };
    console.log(`[Log][${profileId}][${level}] ${text}`);
    broadcast({ type: 'LOG', data: logObj });
}

// --- Express APIs ---

// Get all profiles
app.get('/api/profiles', (req, res) => {
    const profiles = readProfiles();
    // Update running status based on active processes
    const updated = profiles.map(p => ({
        ...p,
        status: activeBrowsers[p.id] ? 'Running' : 'Stopped'
    }));
    res.json(updated);
});

// Create a new profile
app.post('/api/profiles', (req, res) => {
    const { name, proxyType, proxyHost, proxyPort, proxyUsername, proxyPassword } = req.body;
    if (!name) return res.status(400).json({ error: 'Profile name is required' });

    const profiles = readProfiles();
    const newProfile = {
        id: 'profile_' + Date.now(),
        name,
        proxyType: proxyType || 'None',
        proxyHost: proxyHost || '',
        proxyPort: proxyPort || '',
        proxyUsername: proxyUsername || '',
        proxyPassword: proxyPassword || '',
        status: 'Stopped',
        headless: false,
        settings: {
            generalVipMode: false,
            autoDiemDanh: true,
            autoThiLuyen: true,
            autoPhucLoi: true,
            autoClaimDailyTurns: true,
            autoHoangVuc: true,
            autoMeCung: true,
            autoKhoangMach: true,
            autoDoThach: true,
            autoBiCanh: true,
            autoTienDuyen: true,
            autoHoatDongNgay: true,
            autoLuyenDan: true,
            luyenDanAutoStart: true,
            luyenDanMinStars: '4',
            luyenDanAutoDecompose: true,
            luyenDanAutoTune: true,
            luyenDanAutoUse: true,
            luyenDanAutoInvite: false,
            luyenDanWaitInviteSeconds: '60',
            luyenDanAutoAcceptInvite: false,
            luyenDanAcceptAllInvites: true,
            luyenDanAutoLeave: false,
            khoangmach_auto_takeover: false,
            khoangmach_auto_takeover_rotation: false,
            khoangmach_reward_mode: 'any',
            khoangmach_use_buff: false,
            khoangmach_fast_attack: false,
            khoangmach_check_interval: '5',
            'dice-roll-choice': 'tai',
            'tienduyen-choice': '5',
            hoangvucMaximizeDamage: false,
            selfSchedule_h: '0',
            selfSchedule_m: '30'
        }
    };

    profiles.push(newProfile);
    writeProfiles(profiles);
    res.json(newProfile);
});

// Update a profile
app.put('/api/profiles/:id', (req, res) => {
    const { id } = req.params;
    const { name, proxyType, proxyHost, proxyPort, proxyUsername, proxyPassword, headless } = req.body;

    const profiles = readProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Profile not found' });

    profiles[index] = {
        ...profiles[index],
        name: name !== undefined ? name : profiles[index].name,
        proxyType: proxyType !== undefined ? proxyType : profiles[index].proxyType,
        proxyHost: proxyHost !== undefined ? proxyHost : profiles[index].proxyHost,
        proxyPort: proxyPort !== undefined ? proxyPort : profiles[index].proxyPort,
        proxyUsername: proxyUsername !== undefined ? proxyUsername : profiles[index].proxyUsername,
        proxyPassword: proxyPassword !== undefined ? proxyPassword : profiles[index].proxyPassword,
        headless: headless !== undefined ? headless : profiles[index].headless
    };

    writeProfiles(profiles);
    res.json(profiles[index]);
});

// Delete a profile
app.delete('/api/profiles/:id', async (req, res) => {
    const { id } = req.params;
    // Stop browser if running
    if (activeBrowsers[id]) {
        try {
            await activeBrowsers[id].close();
            delete activeBrowsers[id];
        } catch (e) {}
    }

    const profiles = readProfiles();
    const filtered = profiles.filter(p => p.id !== id);
    writeProfiles(filtered);

    // Clean up user data folder optionally (comment out if you want to keep session data)
    const profileFolder = path.join(PROFILES_DIR, id);
    if (fs.existsSync(profileFolder)) {
        try {
            fs.rmSync(profileFolder, { recursive: true, force: true });
        } catch (e) {
            console.error(`Failed to delete profile folder: ${profileFolder}`, e);
        }
    }

    res.json({ success: true });
});

// Get profile settings
app.get('/api/profiles/:id/settings', (req, res) => {
    const { id } = req.params;
    const profiles = readProfiles();
    const profile = profiles.find(p => p.id === id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile.settings || {});
});

// Update profile settings
app.put('/api/profiles/:id/settings', (req, res) => {
    const { id } = req.params;
    const settings = req.body;
    const profiles = readProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Profile not found' });

    profiles[index].settings = {
        ...profiles[index].settings,
        ...settings
    };
    writeProfiles(profiles);
    res.json(profiles[index].settings);
});

// Start a profile
app.post('/api/profiles/:id/start', async (req, res) => {
    const { id } = req.params;
    const { headless } = req.body; // allow overriding headless mode

    if (activeBrowsers[id]) {
        return res.status(400).json({ error: 'Profile is already running' });
    }

    const profiles = readProfiles();
    const profile = profiles.find(p => p.id === id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const firefoxPath = getFirefoxPath();
    if (!firefoxPath) {
        return res.status(500).json({ error: 'Mozilla Firefox installation not found on this system.' });
    }

    const profileDataDir = path.join(PROFILES_DIR, id);
    if (!fs.existsSync(profileDataDir)) {
        fs.mkdirSync(profileDataDir, { recursive: true });
    }

    // Set up the extensions folder and copy Violentmonkey XPI there
    const extensionsDir = path.join(profileDataDir, 'extensions');
    if (!fs.existsSync(extensionsDir)) {
        fs.mkdirSync(extensionsDir, { recursive: true });
    }
    const sourceXpi = path.join(__dirname, 'violentmonkey.xpi');
    const destXpi = path.join(extensionsDir, '{aecec67f-0d10-4fa7-b7c7-609a2db280cf}.xpi');
    if (fs.existsSync(sourceXpi)) {
        try {
            fs.copyFileSync(sourceXpi, destXpi);
            sendLog(id, 'info', 'Đã sao chép Violentmonkey vào thư mục profile.');
        } catch (e) {
            sendLog(id, 'warning', `Lỗi sao chép Violentmonkey: ${e.message}`);
        }
    }

    const isHeadless = headless !== undefined ? headless : profile.headless;

    // Build extra preferences for Firefox
    const extraPrefsFirefox = {
        'extensions.autoDisableScopes': 0,
        'extensions.enabledScopes': 15,
        'extensions.databaseSchema': 1,
        'signon.autologin.proxy': true,
        'dom.webdriver.enabled': false,
        'usePrivacyResistFingerprinting': false
    };

    // Add proxy configurations to extraPrefsFirefox
    if (profile.proxyType && profile.proxyType !== 'None' && profile.proxyHost && profile.proxyPort) {
        const port = parseInt(profile.proxyPort, 10);
        if (profile.proxyType === 'HTTP') {
            extraPrefsFirefox['network.proxy.type'] = 1;
            extraPrefsFirefox['network.proxy.http'] = profile.proxyHost;
            extraPrefsFirefox['network.proxy.http_port'] = port;
            extraPrefsFirefox['network.proxy.ssl'] = profile.proxyHost;
            extraPrefsFirefox['network.proxy.ssl_port'] = port;
        } else if (profile.proxyType === 'SOCKS5' || profile.proxyType === 'SOCKS4') {
            extraPrefsFirefox['network.proxy.type'] = 1;
            extraPrefsFirefox['network.proxy.socks'] = profile.proxyHost;
            extraPrefsFirefox['network.proxy.socks_port'] = port;
            extraPrefsFirefox['network.proxy.socks_version'] = profile.proxyType === 'SOCKS5' ? 5 : 4;
            extraPrefsFirefox['network.proxy.socks_remote_dns'] = true;
        }
    }

    sendLog(id, 'info', `Khởi chạy trình duyệt Firefox... (Chế độ: ${isHeadless ? 'Ẩn' : 'Hiện'})`);

    try {
        const browser = await puppeteer.launch({
            product: 'firefox',
            protocol: 'webDriverBiDi',
            executablePath: firefoxPath,
            headless: isHeadless,
            userDataDir: profileDataDir,
            defaultViewport: null,
            extraPrefsFirefox
        });

        activeBrowsers[id] = browser;
        sendLog(id, 'info', 'Đã nạp thành công Violentmonkey vào Firefox.');

        // Apply proxy authentication if needed
        if (profile.proxyUsername && profile.proxyPassword) {
            sendLog(id, 'info', 'Ủy thác tài khoản proxy. Đang cấu hình xác thực...');
            const pages = await browser.pages();
            for (let page of pages) {
                try {
                    await page.authenticate({
                        username: profile.proxyUsername,
                        password: profile.proxyPassword
                    });
                } catch (e) {
                    sendLog(id, 'warning', `Yêu cầu xác thực Proxy thủ công: Vui lòng nhập và lưu tài khoản/mật khẩu proxy ở chế độ Hiện (Headful).`);
                }
            }
            // Authenticate on any new target/page
            browser.on('targetcreated', async (target) => {
                if (target.type() === 'page') {
                    const page = await target.page();
                    if (page) {
                        await page.authenticate({
                            username: profile.proxyUsername,
                            password: profile.proxyPassword
                        }).catch(() => {});
                    }
                }
            });
        }

        // Open game URL automatically
        const pages = await browser.pages();
        const mainPage = pages.length > 0 ? pages[0] : await browser.newPage();
        await mainPage.goto(`https://hoathinh3d.co/?profileId=${id}`, { waitUntil: 'domcontentloaded' }).catch(() => {});

        // Open install page in new tab if headful mode (for Violentmonkey userscript install)




        // Listen for browser close/crash
        browser.on('disconnected', () => {
            delete activeBrowsers[id];
            sendLog(id, 'info', 'Trình duyệt đã đóng.');
            broadcast({ type: 'STATUS', data: { id, status: 'Stopped' } });
        });

        broadcast({ type: 'STATUS', data: { id, status: 'Running' } });
        res.json({ success: true });
    } catch (err) {
        delete activeBrowsers[id];
        sendLog(id, 'error', `Khởi chạy thất bại: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// Start a profile cleanly (bypass Cloudflare)
app.post('/api/profiles/:id/start-clean', async (req, res) => {
    const { id } = req.params;
    if (activeBrowsers[id]) {
        return res.status(400).json({ error: 'Profile is already running' });
    }

    const profiles = readProfiles();
    const profile = profiles.find(p => p.id === id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const firefoxPath = getFirefoxPath();
    if (!firefoxPath) {
        return res.status(500).json({ error: 'Mozilla Firefox installation not found on this system.' });
    }

    const profileDataDir = path.join(PROFILES_DIR, id);
    if (!fs.existsSync(profileDataDir)) {
        fs.mkdirSync(profileDataDir, { recursive: true });
    }

    // Set up the extensions folder and copy Violentmonkey XPI there
    const extensionsDir = path.join(profileDataDir, 'extensions');
    if (!fs.existsSync(extensionsDir)) {
        fs.mkdirSync(extensionsDir, { recursive: true });
    }
    const sourceXpi = path.join(__dirname, 'violentmonkey.xpi');
    const destXpi = path.join(extensionsDir, '{aecec67f-0d10-4fa7-b7c7-609a2db280cf}.xpi');
    if (fs.existsSync(sourceXpi)) {
        try {
            fs.copyFileSync(sourceXpi, destXpi);
        } catch (e) {}
    }

    // Write user.js config to bypass extensions scope disable
    const userJsPath = path.join(profileDataDir, 'user.js');
    const userJsContent = `user_pref("extensions.autoDisableScopes", 0);\nuser_pref("extensions.enabledScopes", 15);\nuser_pref("extensions.databaseSchema", 1);\nuser_pref("signon.autologin.proxy", true);\n`;
    fs.writeFileSync(userJsPath, userJsContent);

    sendLog(id, 'info', 'Khởi chạy trình duyệt gốc (không điều khiển tự động) để đăng nhập...');

    const { spawn } = require('child_process');
    // Launch natively without marionette/remote-debugging
    const child = spawn(firefoxPath, [
        '-profile', profileDataDir,
        'https://hoathinh3d.co',
        'http://localhost:3000/hh3d.user.js'
    ], {
        detached: true,
        stdio: 'ignore'
    });
    child.unref();

    activeBrowsers[id] = {
        close: async () => {
            try {
                child.kill();
            } catch (e) {}
        }
    };

    broadcast({ type: 'STATUS', data: { id, status: 'Running' } });

    child.on('exit', () => {
        delete activeBrowsers[id];
        sendLog(id, 'info', 'Trình duyệt gốc đã đóng.');
        broadcast({ type: 'STATUS', data: { id, status: 'Stopped' } });
    });

    res.json({ success: true });
});

// Stop a profile
app.post('/api/profiles/:id/stop', async (req, res) => {
    const { id } = req.params;
    const browser = activeBrowsers[id];

    if (!browser) {
        return res.status(400).json({ error: 'Profile is not running' });
    }

    sendLog(id, 'info', 'Đang dừng trình duyệt...');
    try {
        await browser.close();
        delete activeBrowsers[id];
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Endpoint for extension to report logs back to server
app.post('/api/logs', (req, res) => {
    const { profileId, level, text } = req.body;
    if (!profileId || !text) {
        return res.status(400).json({ error: 'profileId and text are required' });
    }
    sendLog(profileId, level || 'info', text);
    res.json({ success: true });
});

// WebSocket Server Handler
wss.on('connection', ws => {
    console.log('Front-end dashboard connected via WebSocket.');
    ws.send(JSON.stringify({ type: 'INIT', data: 'Connected to HH3D Console Server' }));
});

// Graceful cleanup on server exit
const cleanUp = async () => {
    console.log('\n[Exit] Đang đóng toàn bộ các trình duyệt đang chạy ngầm...');
    for (const id in activeBrowsers) {
        try {
            await activeBrowsers[id].close();
            console.log(`- Đã đóng profile: ${id}`);
        } catch (e) {}
    }
    process.exit();
};

process.on('SIGINT', cleanUp);
process.on('SIGTERM', cleanUp);

// Endpoint to serve the userscript for Tampermonkey install
app.get('/hh3d.user.js', (req, res) => {
    const scriptPath = path.resolve(__dirname, '../../hh3d.user.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(scriptPath);
});

server.listen(PORT, () => {
    console.log(`HH3D Console Server is running on http://localhost:${PORT}`);
});
