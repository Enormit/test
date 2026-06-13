const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { HH3DWorker, logBroadcaster } = require('./worker');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Store active workers in memory
const activeWorkers = {};

// Start worker for an account
function startWorker(account) {
    if (activeWorkers[account.id]) {
        activeWorkers[account.id].stop();
    }
    const worker = new HH3DWorker(account);
    activeWorkers[account.id] = worker;
    worker.start();
    return worker;
}

// Stop worker for an account
function stopWorker(id) {
    if (activeWorkers[id]) {
        activeWorkers[id].stop();
        delete activeWorkers[id];
        return true;
    }
    return false;
}

// Auto-start workers for all registered accounts on server startup
function autoStartAll() {
    const accounts = db.getAccounts();
    console.log(`🤖 Phát hiện ${accounts.length} tài khoản trong CSDL. Tiến hành khởi động chạy ngầm...`);
    accounts.forEach(acc => {
        try {
            startWorker(acc);
        } catch (error) {
            console.error(`Không thể khởi chạy worker cho tài khoản ${acc.name}:`, error);
        }
    });
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Get all accounts list
app.get('/api/accounts', (req, res) => {
    const accounts = db.getAccounts();
    const result = accounts.map(acc => {
        const worker = activeWorkers[acc.id];
        return {
            id: acc.id,
            name: acc.name,
            config: acc.config,
            stats: acc.stats,
            isRunning: worker ? worker.isRunning : false,
            logsCount: worker ? worker.logs.length : 0
        };
    });
    res.json({ success: true, data: result });
});

// 2. Add/Verify account via Cookies
app.post('/api/accounts', async (req, res) => {
    const { cookies, name } = req.body;
    if (!cookies) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ chuỗi Cookies!' });
    }

    let tempWorker = null;
    try {
        // Create a temporary worker to verify and extract character information
        tempWorker = new HH3DWorker({ cookies });
        await tempWorker.initBrowser();
        const verify = await tempWorker.ensureSession();
        
        if (!verify || !tempWorker.userid) {
            await tempWorker.closeBrowser();
            return res.status(400).json({ 
                success: false, 
                message: 'Không thể xác thực cookie hoặc tải thông tin nhân vật. Vui lòng kiểm tra lại chuỗi cookie hoặc đảm bảo cookie chưa hết hạn.' 
            });
        }

        const accountId = tempWorker.userid;
        await tempWorker.closeBrowser();

        const saved = db.saveAccount({
            id: accountId,
            name: name || `Tài khoản ${accountId}`,
            cookies: cookies
        });

        // Launch real worker
        startWorker(saved);

        res.json({ 
            success: true, 
            message: `Thêm tài khoản ${saved.name} (ID: ${accountId}) thành công!`, 
            data: saved 
        });
    } catch (error) {
        if (tempWorker) {
            await tempWorker.closeBrowser().catch(() => {});
        }
        console.error('Lỗi khi thêm tài khoản:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xác thực tài khoản: ' + error.message });
    }
});

// 3. Edit account configuration
app.post('/api/accounts/:id/config', (req, res) => {
    const { id } = req.params;
    const config = req.body;

    const updated = db.updateConfig(id, config);
    if (!updated) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản!' });
    }

    // Hot-update config to running worker in memory
    if (activeWorkers[id]) {
        activeWorkers[id].config = updated.config;
        activeWorkers[id].log('⚙️ Đã cập nhật cấu hình tác vụ mới.', 'info');
    }

    res.json({ success: true, message: 'Đã lưu cấu hình mới thành công!', data: updated });
});

// 4. Manual Start Worker
app.post('/api/accounts/:id/start', (req, res) => {
    const { id } = req.params;
    const accounts = db.getAccounts();
    const acc = accounts.find(a => a.id === id);
    
    if (!acc) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản!' });
    }

    startWorker(acc);
    res.json({ success: true, message: 'Đã bật chạy ngầm cho tài khoản!' });
});

// 5. Manual Stop Worker
app.post('/api/accounts/:id/stop', (req, res) => {
    const { id } = req.params;
    const stopped = stopWorker(id);
    if (stopped) {
        res.json({ success: true, message: 'Đã dừng chạy ngầm!' });
    } else {
        res.status(400).json({ success: false, message: 'Worker đang không chạy hoặc không tồn tại.' });
    }
});

// 6. Delete account
app.delete('/api/accounts/:id', (req, res) => {
    const { id } = req.params;
    stopWorker(id);
    const deleted = db.deleteAccount(id);
    if (deleted) {
        res.json({ success: true, message: 'Xóa tài khoản thành công!' });
    } else {
        res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản trong CSDL.' });
    }
});

// 7. SSE Log streaming for a specific account
app.get('/api/accounts/:id/logs', (req, res) => {
    const { id } = req.params;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Stream currently cached logs first
    const worker = activeWorkers[id];
    if (worker) {
        worker.logs.forEach(logEntry => {
            res.write(`data: ${JSON.stringify(logEntry)}\n\n`);
        });
    } else {
        res.write(`data: ${JSON.stringify({ time: new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), message: 'Tài khoản này hiện tại đang Tắt.', level: 'warning' })}\n\n`);
    }

    // Listen to incoming real-time logs
    const onLog = (data) => {
        if (data.accountId === id) {
            res.write(`data: ${JSON.stringify(data.log)}\n\n`);
        }
    };

    logBroadcaster.on('log', onLog);

    // Clean up listener when client disconnects
    req.on('close', () => {
        logBroadcaster.removeListener('log', onLog);
        res.end();
    });
});

// Fallback to serve index.html for single page router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 HH3D Multi-Account Manager running on http://localhost:${PORT}`);
    console.log(`=======================================================`);
    autoStartAll();
});
