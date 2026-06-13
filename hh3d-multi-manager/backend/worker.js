const axios = require('axios');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const decryptor = require('./decryptor');

// Setup standard event emitter for streaming logs
class LogBroadcaster extends EventEmitter {}
const logBroadcaster = new LogBroadcaster();

class HH3DWorker {
    constructor(account) {
        this.id = account.id;
        this.name = account.name;
        this.cookies = account.cookies;
        this.config = account.config;
        
        this.isRunning = false;
        this.logs = [];
        this.nextRunTimes = {};
        this.lastRequestTime = 0;
        this.queue = Promise.resolve();
        
        // Cache values retrieved from pages
        this.baseUrl = 'https://hoathinh3d.co'; // Default base URL
        this.restNonce = null;
        this.securityToken = null;
        this.userid = null;
        this.ajaxUrl = '/wp-content/themes/halimmovies-child/hh3d-ajax.php';
        
        // Action tokens mapping decrypted from homepage
        this.act = {};
        this.bossAttackToken = null;
        
        // Luyen dan properties
        this.luyenDanToken = null;
        this.luyenDanTokenExpires = 0;
        this.claimedDailyStages = new Set();
        
        // Create Axios Client
        this.axios = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Cookie': this.cookies || '',
                'Origin': this.baseUrl,
                'Referer': this.baseUrl + '/',
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 15000,
            validateStatus: () => true // Allow handling non-200 responses inside logic
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    log(message, level = 'info') {
        const time = new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const logEntry = { time, message, level };
        this.logs.push(logEntry);
        if (this.logs.length > 150) this.logs.shift();
        
        // Emit log to all SSE listeners
        logBroadcaster.emit('log', { accountId: this.id, log: logEntry });
        console.log(`[Worker ${this.name}][${level.toUpperCase()}] ${message}`);
    }

    // Enqueue a request to ensure sequential execution (minimum 6 seconds gap)
    async enqueueRequest(requestFn) {
        return new Promise((resolve, reject) => {
            this.queue = this.queue.then(async () => {
                const now = Date.now();
                const elapsed = now - this.lastRequestTime;
                const minGap = 6000; // 6s delay between requests
                
                if (elapsed < minGap) {
                    const wait = minGap - elapsed + Math.floor(Math.random() * 1000);
                    await this.sleep(wait);
                }
                
                try {
                    const result = await requestFn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.lastRequestTime = Date.now();
                }
            });
        });
    }

    async request(url, options = {}) {
        return this.enqueueRequest(async () => {
            try {
                const response = await this.axios({
                    url,
                    ...options
                });
                
                if (response.status === 429 || response.status === 503) {
                    this.log(`⚠️ Bị giới hạn request (HTTP ${response.status}). Sẽ tự động thử lại sau 15s...`, 'warning');
                    await this.sleep(15000);
                    return this.request(url, options);
                }

                return response.data;
            } catch (error) {
                this.log(`❌ Lỗi mạng: ${error.message}`, 'error');
                throw error;
            }
        });
    }

    async postForm(endpoint, data = {}) {
        const params = new URLSearchParams();
        for (const key in data) {
            params.append(key, data[key]);
        }
        return this.request(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: params
        });
    }

    async postJson(endpoint, data = {}) {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.restNonce) {
            headers['X-WP-Nonce'] = this.restNonce;
        }
        return this.request(endpoint, {
            method: 'POST',
            headers: headers,
            data: data
        });
    }

    isTaskDoneToday(taskName) {
        const todayStr = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const lastDoneDate = this.nextRunTimes[`${taskName}_done_date`];
        return lastDoneDate === todayStr;
    }

    markTaskDoneToday(taskName) {
        const todayStr = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        this.nextRunTimes[`${taskName}_done_date`] = todayStr;
    }

    // Extract dynamic domain, tokens, nonces and decryptions from homepage HTML
    async ensureSession() {
        try {
            if (!this.cookies) {
                this.log('❌ Chưa cấu hình Cookies cho tài khoản!', 'error');
                return false;
            }

            const homeHtml = await this.enqueueRequest(async () => {
                const res = await this.axios.get('/');
                return res.data;
            });

            if (!homeHtml || homeHtml.includes('wp-login.php') || homeHtml.includes('Đăng nhập') || !homeHtml.includes('userId')) {
                this.log('❌ Cookie đã hết hạn hoặc không hợp lệ. Vui lòng cập nhật Cookie mới từ trình duyệt.', 'error');
                return false;
            }

            // Extract basic fields
            this.securityToken = decryptor.extractFromHtml(homeHtml, /"securityToken"\s*:\s*"([^"]+)"/) ||
                                 decryptor.extractFromHtml(homeHtml, /hh3dData\.securityToken\s*=\s*["']([^"']+)["']/i);
            
            this.restNonce = decryptor.extractFromHtml(homeHtml, /"restNonce"\s*:\s*"([^"]+)"/) ||
                             decryptor.extractFromHtml(homeHtml, /hh3dData\.restNonce\s*=\s*["']([^"']+)["']/i);
            
            this.userid = decryptor.extractFromHtml(homeHtml, /"userId"\s*:\s*"(\d+)"/) ||
                          decryptor.extractFromHtml(homeHtml, /"userId"\s*:\s*(\d+)/) ||
                          decryptor.extractFromHtml(homeHtml, /hh3dData\.userId\s*=\s*["']?(\d+)["']?/i);

            // Decrypt actions map
            const decrypted = decryptor.decryptHh3dActions(homeHtml);
            if (decrypted) {
                this.act = decrypted;
            } else {
                this.log('⚠️ Không thể giải mã danh sách hành động (Action Mapping). Sử dụng mặc định.', 'warning');
            }

            // Extract stats to save into DB
            const levelMatch = homeHtml.match(/Cấp bậc:\s*<span[^>]*>([^<]+)<\/span>/i) || homeHtml.match(/Cấp bậc:\s*<b>([^<]+)<\/b>/i) || homeHtml.match(/cap-bac">([^<]+)</i);
            const ltMatch = homeHtml.match(/Linh Thạch:\s*<span[^>]*>([\d,]+)<\/span>/i) || homeHtml.match(/Linh Thạch:\s*<b>([\d,]+)<\/b>/i) || homeHtml.match(/linh-thach">([\d,]+)</i);
            const sectMatch = homeHtml.match(/Tông Môn:\s*<span[^>]*>([^<]+)<\/span>/i) || homeHtml.match(/Tông Môn:\s*<b>([^<]+)<\/b>/i);

            const db = require('./db');
            db.updateStats(this.id, {
                level: levelMatch ? levelMatch[1].trim() : 'Chưa rõ',
                lingThach: ltMatch ? parseInt(ltMatch[1].replace(/,/g, '')) : 0,
                sect: sectMatch ? sectMatch[1].trim() : 'Không có'
            });

            this.log(`✅ Đồng bộ thông tin nhân vật: Cấp: ${levelMatch ? levelMatch[1].trim() : 'Chưa rõ'} | Linh Thạch: ${ltMatch ? ltMatch[1] : '0'}`, 'success');
            return true;
        } catch (error) {
            this.log(`❌ Lỗi đồng bộ phiên: ${error.message}`, 'error');
            return false;
        }
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.log('🚀 Worker khởi động chạy ngầm...', 'success');
        this.runScheduler();
    }

    async stop() {
        this.isRunning = false;
        this.log('🛑 Worker đã dừng.', 'warning');
    }

    async runScheduler() {
        while (this.isRunning) {
            try {
                const sessionOk = await this.ensureSession();
                if (!sessionOk) {
                    this.log('❌ Phiên hoạt động lỗi (Cần cập nhật Cookie mới). Thử lại sau 2 phút...', 'error');
                    await this.sleep(120000);
                    continue;
                }

                const now = Date.now();
                const taskKeys = Object.keys(this.config.tasks);

                for (const taskName of taskKeys) {
                    if (!this.isRunning) break;
                    if (!this.config.tasks[taskName]) continue;

                    // Skip tasks that are already done for today
                    if (this.isTaskDoneToday(taskName)) {
                        continue;
                    }

                    const nextRun = this.nextRunTimes[taskName] || 0;
                    if (now >= nextRun) {
                        this.nextRunTimes[taskName] = now + 180000; // 3 mins lock
                        
                        try {
                            const delayMs = await this.executeTask(taskName);
                            this.nextRunTimes[taskName] = Date.now() + (delayMs || 30000);
                        } catch (err) {
                            this.log(`💥 Nhiệm vụ "${taskName}" bị lỗi: ${err.message}`, 'error');
                            this.nextRunTimes[taskName] = Date.now() + 60000; // retry in 1 minute
                        }
                    }
                }
            } catch (err) {
                this.log(`💥 Lỗi bộ lập lịch (Scheduler): ${err.message}`, 'error');
            }
            // Sleep 15 seconds before scanning again
            await this.sleep(15000);
        }
    }

    async executeTask(taskName) {
        switch (taskName) {
            case 'checkin':
                return await this.taskCheckin();
            case 'chest':
                return await this.taskChest();
            case 'boss':
                return await this.taskBoss();
            case 'trial':
                return await this.taskTrial();
            case 'qa':
                return await this.taskQA();
            case 'teLe':
                return await this.taskTeLe();
            case 'mining':
                return await this.taskMining();
            case 'refine':
                return await this.taskRefine();
            case 'gamble':
                return await this.taskGamble();
            case 'spin':
                return await this.taskSpin();
            default:
                this.log(`⚠️ Nhiệm vụ "${taskName}" chưa hỗ trợ hoặc bị bỏ qua.`, 'warning');
                return 3600000;
        }
    }

    // ==========================================
    // TASK: DIEM DANH (CHECKIN)
    // ==========================================
    async taskCheckin() {
        this.log('📅 [Điểm Danh] Đang thực hiện...', 'info');
        try {
            // 1. Điểm danh cá nhân
            const result = await this.postJson('/wp-json/hh3d/v1/action', { action: 'daily_check_in' });
            const msg = result?.message || result?.data?.message || '';
            if (result?.success) {
                this.log(`📅 ✅ Điểm danh cá nhân: ${msg || 'Thành công'}`, 'success');
            } else {
                this.log(`📅 ⚠️ Điểm danh cá nhân: ${msg || 'Đã điểm danh hoặc lỗi'}`, 'warning');
            }

            // 2. Điểm danh tông môn
            const tmCheckin = await this.postJson('/wp-json/tong-mon/v1/te-le-tong-mon', { action: 'te_le_tong_mon', type: 'checkin' }).catch(() => null);
            if (tmCheckin?.success) {
                this.log(`📅 ✅ Điểm danh tông môn thành công`, 'success');
            }

            this.markTaskDoneToday('checkin');
            this.log('📅 ✅ Hoàn thành điểm danh hôm nay.', 'success');
            return 24 * 60 * 60 * 1000; // Run tomorrow
        } catch (e) {
            this.log(`📅 ❌ Lỗi điểm danh: ${e.message}`, 'error');
            return 300000; // retry 5m
        }
    }

    // ==========================================
    // TASK: PHUC LOI DUONG (CHEST)
    // ==========================================
    async taskChest() {
        this.log('🎁 [Phúc Lợi Đường] Đang kiểm tra...', 'info');
        const timerAct = this.act.plTimer || 'get_next_time_pl';
        const openAct = this.act.plOpen || 'open_chest_pl';
        
        try {
            const resp = await this.postForm(this.ajaxUrl, {
                action: timerAct,
                security_token: this.securityToken
            });

            if (!resp?.success) {
                const errMsg = resp?.message || resp?.data?.message || '';
                if (errMsg.includes('hoàn thành')) {
                    this.log('🎁 ✅ Đã nhận hết rương Phúc Lợi Đường hôm nay', 'success');
                    this.markTaskDoneToday('chest');
                    return 24 * 60 * 60 * 1000;
                }
                this.log(`🎁 Lỗi lấy thời gian rương: ${errMsg}`, 'warning');
                return 60000;
            }

            const { time, chest_level } = resp.data || {};
            const currentLevel = Number(chest_level);
            const nextChestId = currentLevel + 1;
            const chestNames = { 1: 'Phàm Giới', 2: 'Thiên Cơ', 3: 'Địa Nguyên', 4: 'Chí Tôn' };

            if (currentLevel >= 4) {
                this.log('🎁 ✅ Đã nhận đủ 4 rương Phúc Lợi Đường hôm nay', 'success');
                this.markTaskDoneToday('chest');
                return 24 * 60 * 60 * 1000;
            }

            const parseTimeStr = (str) => {
                if (!str || str === '00:00') return 0;
                const parts = str.split(':').map(Number);
                return (parts[0] * 60 + parts[1]) * 1000;
            };

            const waitMs = parseTimeStr(time);
            if (waitMs === 0) {
                const chestName = chestNames[nextChestId] || `Cấp ${nextChestId}`;
                this.log(`🎁 Đang tiến hành mở Rương ${chestName}...`, 'info');
                
                const openResp = await this.postForm(this.ajaxUrl, {
                    action: openAct,
                    security_token: this.securityToken,
                    chest_id: nextChestId
                });

                if (openResp?.success) {
                    this.log(`🎁 ✅ Mở Rương ${chestName} thành công: ${openResp.data?.message || 'OK'}`, 'success');
                } else {
                    this.log(`🎁 ❌ Mở rương thất bại: ${openResp?.message || 'Lỗi không rõ'}`, 'error');
                }
                return 10000;
            } else {
                this.log(`🎁 Rương tiếp theo [${chestNames[nextChestId] || nextChestId}] cần đợi ${time || '0s'}`, 'info');
                return waitMs + 5000;
            }
        } catch (e) {
            this.log(`🎁 ❌ Lỗi Phúc Lợi Đường: ${e.message}`, 'error');
            return 60000;
        }
    }

    // ==========================================
    // TASK: BOSS (WILDLANDS BOSS)
    // ==========================================
    async fetchBossAttackToken() {
        try {
            const res = await this.axios.get('/hoang-vuc');
            const html = res.data;
            const m = html.match(/boss_attack_token\s*=\s*["']([a-f0-9]{32})["']/i) || html.match(/boss_attack_token\s*=\s*["']([^"']+)["']/i);
            if (m?.[1]) {
                this.bossAttackToken = m[1];
                return m[1];
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async taskBoss() {
        this.log('🛡️ [Boss Hoang Vực] Đang kiểm tra...', 'info');
        const getBossAct = this.act.bossGet || 'get_boss';
        const timerAct = this.act.bossTimer || 'get_next_attack_time';
        const attackAct = this.act.bossAttack || 'attack_boss';

        try {
            const boss = await this.postForm(this.ajaxUrl, { action: getBossAct });
            if (!boss?.success || !boss.data?.id) {
                const errMsg = boss?.message || boss?.data?.message || '';
                if (errMsg.includes('hết lượt') || errMsg.includes('hoàn thành')) {
                    this.log('🛡️ ✅ Đã đánh hết lượt Boss Hoang Vực hôm nay', 'success');
                    this.markTaskDoneToday('boss');
                    return 24 * 60 * 60 * 1000;
                }
                this.log(`🛡️ ⚠️ Lỗi get_boss: ${errMsg}`, 'warning');
                return 60000;
            }

            const bossId = boss.data.id;
            this.log(`🛡️ Boss: ${boss.data.name || '?'} (ID: ${bossId}) | HP: ${boss.data.hp_pct || 100}%`, 'info');

            const timeResp = await this.postForm(this.ajaxUrl, { action: timerAct });
            if (timeResp?.success) {
                const nextTs = Number(timeResp.data);
                if (nextTs > Date.now()) {
                    const wait = nextTs - Date.now() + 1000;
                    this.log(`🛡️ Cooldown tấn công boss – đợi ${Math.ceil(wait / 1000)}s`, 'info');
                    return wait;
                }
            }

            if (!this.bossAttackToken) {
                await this.fetchBossAttackToken();
            }

            if (!this.bossAttackToken) {
                this.log('🛡️ ❌ Không lấy được attack_token cho Boss!', 'error');
                return 60000;
            }

            this.log('🛡️ Đang tấn công Boss...', 'info');
            const result = await this.postForm(this.ajaxUrl, {
                action: attackAct,
                boss_id: String(bossId),
                security_token: this.securityToken,
                attack_token: this.bossAttackToken,
                request_id: `req_${Math.random().toString(16).slice(2)}_${Date.now()}`
            });

            if (result?.success) {
                if (result.data?.attack_token) {
                    this.bossAttackToken = result.data.attack_token;
                }
                this.log(`🛡️ ✅ Tấn công thành công! Sát thương gây ra: ${result.data?.damage || 'OK'}`, 'success');
                return 8000;
            } else {
                const msg = result?.message || result?.data?.error || result?.data?.message || '';
                if (msg.includes('hết lượt') || msg.includes('hết lượt tấn công')) {
                    this.log('🛡️ ✅ Đã đánh hết lượt Boss Hoang Vực hôm nay', 'success');
                    this.markTaskDoneToday('boss');
                    return 24 * 60 * 60 * 1000;
                } else if (msg.includes('nhận thưởng') || msg.includes('boss cũ')) {
                    this.log('🛡️ Nhận quà Boss cũ tích lũy...', 'info');
                    const claim = await this.postForm('/wp-admin/admin-ajax.php', { action: 'claim_chest' });
                    this.log(`🛡️ Kết quả nhận quà Boss: ${claim?.message || JSON.stringify(claim)}`, 'success');
                    return 5000;
                } else if (msg.includes('token')) {
                    this.bossAttackToken = null;
                    this.log('🛡️ Token hết hạn, đang nạp lại...', 'warning');
                    return 5000;
                }
                this.log(`🛡️ Tấn công thất bại: ${msg}`, 'warning');
                return 10000;
            }
        } catch (e) {
            this.log(`🛡️ ❌ Lỗi Boss Hoang Vực: ${e.message}`, 'error');
            return 60000;
        }
    }

    // ==========================================
    // TASK: THI LUYEN TONG MON (TRIAL)
    // ==========================================
    async taskTrial() {
        this.log('💎 [Thí Luyện Tông Môn] Đang kiểm tra...', 'info');
        const timerAct = this.act.tltmTimer || 'get_remaining_time_tltm';
        const openAct = this.act.tltmOpen || 'open_chest_tltm';

        try {
            const check = await this.postForm(this.ajaxUrl, {
                action: timerAct,
                security_token: this.securityToken
            });

            if (check?.success) {
                const { time_remaining } = check.data || {};
                if (time_remaining === undefined) {
                    this.log('💎 time_remaining bị undefined, thử lại...', 'warning');
                    return 10000;
                }

                const parts = time_remaining.split(':').map(Number);
                const waitMs = (parts[0] * 60 + parts[1]) * 1000;

                if (waitMs === 0) {
                    this.log('💎 Đang khiêu chiến và mở rương Thí Luyện...', 'info');
                    const result = await this.postForm(this.ajaxUrl, {
                        action: openAct,
                        security_token: this.securityToken
                    });

                    const resultMsg = result?.data?.message || result?.message || '';
                    if (resultMsg.includes('hoàn thành') || resultMsg.includes('kế tiếp')) {
                        this.log('💎 ✅ Đã hoàn thành Thí Luyện Tông Môn hôm nay', 'success');
                        this.markTaskDoneToday('trial');
                        return 24 * 60 * 60 * 1000;
                    }

                    if (result?.success) {
                        this.log(`💎 ✅ Kết quả Thí Luyện: ${resultMsg || 'Thành công'}`, 'success');
                    } else {
                        this.log(`💎 ⚠️ Thí Luyện thất bại: ${resultMsg || 'Lỗi'}`, 'warning');
                    }
                    return 10000;
                } else {
                    this.log(`💎 Thí Luyện đang hồi chiêu – đợi ${time_remaining}`, 'info');
                    return waitMs + 5000;
                }
            } else {
                const msg = check?.data?.message || check?.message || '';
                if (msg.includes('hoàn thành') || msg.includes('kế tiếp')) {
                    this.log('💎 ✅ Đã hoàn thành Thí Luyện Tông Môn hôm nay', 'success');
                    this.markTaskDoneToday('trial');
                    return 24 * 60 * 60 * 1000;
                }
                this.log(`💎 ⚠️ Lỗi kiểm tra Thí Luyện: ${msg}`, 'warning');
                return 30000;
            }
        } catch (e) {
            this.log(`💎 ❌ Lỗi Thí Luyện Tông Môn: ${e.message}`, 'error');
            return 60000;
        }
    }

    // ==========================================
    // TASK: VAN DAP (Q&A)
    // ==========================================
    normalizeStr(str) {
        if (!str) return '';
        return str.toString()
            .toLowerCase()
            .normalize('NFC')
            .replace(/[.,;?!:"'()]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    findAnswer(question, options, dbAnswers) {
        if (!dbAnswers) return 0;
        let rawAnswer = dbAnswers[question];
        
        if (!rawAnswer) {
            const normQuestion = this.normalizeStr(question);
            const foundKey = Object.keys(dbAnswers).find(k => {
                const normKey = this.normalizeStr(k);
                return normKey === normQuestion || normKey.includes(normQuestion) || normQuestion.includes(normKey);
            });

            if (foundKey) {
                rawAnswer = dbAnswers[foundKey];
                this.log(`❓ Tìm thấy câu hỏi gần khớp: "${foundKey}"`, 'info');
            }
        }

        if (!rawAnswer) {
            this.log(`❓ Không có đáp án cho câu: "${question}". Chọn đáp án đầu tiên (0).`, 'warning');
            return 0;
        }

        const searchKey = this.normalizeStr(rawAnswer);
        const answerIndex = options.findIndex(opt => {
            const optNorm = this.normalizeStr(opt);
            return optNorm === searchKey || optNorm.includes(searchKey) || searchKey.includes(optNorm);
        });

        if (answerIndex === -1) {
            this.log(`❓ Không tìm thấy kết quả "${rawAnswer}" trong các tùy chọn. Chọn 0.`, 'warning');
            return 0;
        }

        return answerIndex;
    }

    async taskQA() {
        this.log('❓ [Vấn Đáp Tông Môn] Bắt đầu...', 'info');
        const vdLoadAct = this.act.vdLoad || 'load_quiz_data';
        const vdSaveAct = this.act.vdSave || 'save_quiz_result';

        try {
            // Load local answers.json
            let answersDb = null;
            const extAnswersPath = path.join(__dirname, '../../auto-hh3d/extention/answers.json');
            
            if (fs.existsSync(extAnswersPath)) {
                answersDb = JSON.parse(fs.readFileSync(extAnswersPath, 'utf8'));
            } else {
                this.log('❓ ❌ Không tìm thấy answers.json ở thư mục extension!', 'error');
                return 3600000;
            }

            const quiz = await this.postForm(this.ajaxUrl, {
                action: vdLoadAct,
                security_token: this.securityToken
            });

            if (!quiz?.success || !quiz?.data?.questions) {
                this.log(`❓ Lỗi tải dữ liệu Vấn Đáp: ${quiz?.message || 'Không có câu hỏi'}`, 'warning');
                return 180000;
            }

            const { questions, correct_answers, completed } = quiz.data;
            if (completed) {
                this.log(`❓ ✅ Đã trả lời xong Vấn Đáp hôm nay! Số câu đúng: ${correct_answers || 0}`, 'success');
                this.markTaskDoneToday('qa');
                return 24 * 60 * 60 * 1000;
            }

            this.log(`❓ Đang trả lời ${questions.length} câu hỏi vấn đáp...`, 'info');
            for (const q of questions) {
                if (!this.isRunning) break;
                const { id, question, options } = q;
                this.log(`❓ Câu hỏi: ${question}`, 'info');
                
                const ansIdx = this.findAnswer(question, options, answersDb);
                this.log(`❓ Đáp án chọn: ${options[ansIdx]} (Index: ${ansIdx})`, 'info');

                const submit = await this.postForm(this.ajaxUrl, {
                    action: vdSaveAct,
                    question_id: id,
                    answer: ansIdx,
                    security_token: this.securityToken
                });

                if (submit?.success && submit.data?.is_correct === 1) {
                    this.log(`❓ ✅ Trả lời ĐÚNG: ${submit.data?.message || 'Chính xác!'}`, 'success');
                } else {
                    this.log(`❓ ✗ Trả lời SAI hoặc gặp lỗi: ${submit?.message || submit?.data?.message || 'Lỗi'}`, 'warning');
                }
                await this.sleep(2000);
            }

            this.log('❓ ✅ Trả lời xong các câu hỏi Vấn Đáp.', 'success');
            this.markTaskDoneToday('qa');
            return 24 * 60 * 60 * 1000;
        } catch (e) {
            this.log(`❓ ❌ Lỗi Vấn Đáp: ${e.message}`, 'error');
            return 30000;
        }
    }

    // ==========================================
    // TASK: TE LE TONG MON (SACRIFICE)
    // ==========================================
    async taskTeLe() {
        this.log('🙏 [Tế Lễ Tông Môn] Đang kiểm tra...', 'info');
        try {
            const check = await this.postJson('/wp-json/tong-mon/v1/check-te-le-status');
            
            if (check?.success === false && check?.message?.includes('chưa tế lễ')) {
                this.log('🙏 Chưa Tế Lễ – Tiến hành tế lễ tông môn...', 'info');
                const result = await this.postJson('/wp-json/tong-mon/v1/te-le-tong-mon', {
                    action: 'te_le_tong_mon',
                    security_token: this.securityToken
                });

                if (result?.success) {
                    this.log(`🙏 ✅ Tế lễ tông môn thành công: ${result.message || 'OK'}`, 'success');
                } else {
                    this.log(`🙏 Tế lễ tông môn thất bại: ${result?.message || 'Lỗi'}`, 'warning');
                }
            } else {
                this.log('🙏 ✅ Hôm nay bạn đã tế lễ tông môn rồi!', 'success');
            }

            this.markTaskDoneToday('teLe');
            return 24 * 60 * 60 * 1000;
        } catch (e) {
            this.log(`🙏 ❌ Lỗi Tế Lễ Tông Môn: ${e.message}`, 'error');
            return 300000;
        }
    }

    // ==========================================
    // TASK: KHOANG MACH (MINING)
    // ==========================================
    async fetchMiningNonces() {
        try {
            const res = await this.axios.get('/khoang-mach');
            const html = res.data;
            
            this.kmListAct = decryptor.extractFromHtml(html, /kmList["\s:]+["']([a-f0-9]+)["']/i) || 'load_mines_by_type';
            this.kmEnterAct = decryptor.extractFromHtml(html, /kmEnter["\s:]+["']([a-f0-9]+)["']/i) || 'enter_mine';
            this.kmUsersAct = decryptor.extractFromHtml(html, /kmUsers["\s:]+["']([a-f0-9]+)["']/i) || 'get_users_in_mine';
            this.kmClaimAct = decryptor.extractFromHtml(html, /kmClaim["\s:]+["']([a-f0-9]+)["']/i) || 'claim_mycred_reward';
            
            const miningToken = decryptor.extractFromHtml(html, /"securityToken"\s*:\s*"([^"]+)"/) || this.securityToken;
            const miningSecurity = decryptor.extractFromHtml(html, /nonce["\s:]+["']([a-f0-9]{10})["']/i) ||
                                   decryptor.extractFromHtml(html, /"nonce"\s*:\s*"([a-f0-9]{10})"/i);

            this.miningToken = miningToken;
            this.miningSecurity = miningSecurity;
            return !!(miningToken && miningSecurity);
        } catch (e) {
            return false;
        }
    }

    async taskMining() {
        this.log('⛏️ [Khoáng Mạch] Đang kiểm tra trạng thái mỏ...', 'info');
        try {
            await this.fetchMiningNonces();
            if (!this.miningToken || !this.miningSecurity) {
                this.log('⛏️ ❌ Không thể tải mã bảo mật Mining Nonce!', 'error');
                return 60000;
            }

            let mineId = this.config.mining.mineId;
            const mineType = this.config.mining.mineType || 'silver';

            if (!mineId) {
                this.log(`⛏️ Chưa đặt ID mỏ cụ thể. Đang tìm mỏ trống hệ: ${mineType}...`, 'info');
                const list = await this.postForm(this.ajaxUrl, {
                    action: this.kmListAct || 'load_mines_by_type',
                    mine_type: mineType,
                    security: this.miningSecurity
                });

                if (!list?.success || !list.data?.length) {
                    this.log('⛏️ ❌ Không thể tải danh sách mỏ đào.', 'error');
                    return 120000;
                }

                const freeMine = list.data.find(m => m.user_count < m.max_users);
                if (!freeMine) {
                    this.log(`⛏️ ⚠️ Không tìm thấy mỏ ${mineType} nào còn chỗ trống! Thử lại sau 5 phút.`, 'warning');
                    return 300000;
                }

                mineId = freeMine.id;
                this.log(`⛏️ Đã chọn tự động mỏ: ${freeMine.name} (ID: ${mineId})`, 'info');
            }

            const check = await this.postForm(this.ajaxUrl, {
                action: this.kmUsersAct || 'get_users_in_mine',
                mine_id: mineId,
                security_token: this.miningToken,
                security: this.miningSecurity
            });

            if (!check?.success || !check.data?.users) {
                const checkMsg = check?.message || check?.data?.message || '';
                if (checkMsg.includes('hết hạn') || checkMsg.includes('Phiên')) {
                    this.log('⛏️ Phiên hết hạn, làm mới session...', 'warning');
                    return 5000;
                }
                this.log(`⛏️ Không kiểm tra được mỏ: ${checkMsg || 'Lỗi không rõ'}`, 'warning');
                return 60000;
            }

            const users = check.data.users;
            const isMeMining = users.some(u => String(u.id) === String(this.userid));

            if (isMeMining) {
                this.log('⛏️ Đang đào mỏ. Tiến hành nhận thưởng tích lũy...', 'info');
                const claim = await this.postForm(this.ajaxUrl, {
                    action: this.kmClaimAct || 'claim_mycred_reward',
                    mine_id: mineId,
                    security_token: this.miningToken,
                    security: this.miningSecurity
                });

                if (claim?.success) {
                    this.log(`⛏️ ✅ Nhận thưởng mỏ thành công: ${claim.data?.message || 'OK'}`, 'success');
                    return 30 * 60 * 1000;
                } else {
                    const claimMsg = claim?.message || claim?.data?.message || '';
                    if (claimMsg.includes('đủ thưởng') || claimMsg.includes('không thể vào')) {
                        this.log('⛏️ ✅ Đã đạt giới hạn Linh Thạch đào mỏ hôm nay. Chờ ngày mai.', 'success');
                        this.markTaskDoneToday('mining');
                        return 24 * 60 * 60 * 1000;
                    }
                    this.log(`⛏️ Nhận thưởng mỏ thất bại: ${claimMsg}`, 'warning');
                    return 60000;
                }
            } else {
                this.log(`⛏️ Bạn đang ở ngoài lò đào. Tiến hành vào mỏ ID: ${mineId}...`, 'warning');
                const enter = await this.postForm(this.ajaxUrl, {
                    action: this.kmEnterAct || 'enter_mine',
                    mine_id: mineId,
                    security_token: this.miningToken,
                    security: this.miningSecurity
                });

                if (enter?.success) {
                    this.log('⛏️ ✅ Vào mỏ thành công! Chờ 30 phút bắt đầu claim...', 'success');
                    return 30 * 60 * 1000;
                } else {
                    const enterMsg = enter?.message || enter?.data?.message || '';
                    if (enterMsg.includes('đủ thưởng') || enterMsg.includes('không thể vào')) {
                        this.log('⛏️ ✅ Đã đạt giới hạn Linh Thạch đào mỏ hôm nay. Chờ ngày mai.', 'success');
                        this.markTaskDoneToday('mining');
                        return 24 * 60 * 60 * 1000;
                    }
                    this.log(`⛏️ ❌ Vào mỏ thất bại: ${enterMsg}`, 'error');
                    return 60000;
                }
            }
        } catch (e) {
            this.log(`⛏️ ❌ Lỗi Khoáng Mạch: ${e.message}`, 'error');
            return 60000;
        }
    }

    // ==========================================
    // TASK: LUYEN DAN (REFINE PILLS)
    // ==========================================
    async ensureLuyenDanToken() {
        const now = Math.floor(Date.now() / 1000);
        if (this.luyenDanToken && this.luyenDanTokenExpires > now + 30) {
            return this.luyenDanToken;
        }

        try {
            const response = await this.request('/wp-json/hh3d/v1/luyen-dan/session-token', {
                method: 'GET',
                headers: {
                    'X-WP-Nonce': this.restNonce
                }
            });

            if (response?.data?.security_token) {
                this.luyenDanToken = response.data.security_token;
                this.luyenDanTokenExpires = response.data.expires_at || (now + 1800);
                return this.luyenDanToken;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async callLdApi(path, method = 'GET', body = null) {
        const token = await this.ensureLuyenDanToken();
        if (!token) throw new Error('Không thể khởi tạo LD token');
        
        return this.request(`/wp-json/hh3d/v1/luyen-dan${path}`, {
            method,
            headers: {
                'X-WP-Nonce': this.restNonce,
                'X-LD-Token': token,
                'Content-Type': 'application/json'
            },
            data: body ? JSON.stringify(body) : undefined
        });
    }

    async taskRefine() {
        this.log('🧪 [Luyện Đan] Đang kiểm tra trạng thái lò...', 'info');
        try {
            const state = await this.callLdApi('/state?fresh=1', 'GET');
            if (!state || !state.data) {
                this.log('🧪 Lỗi lấy trạng thái đan thất.', 'warning');
                return 30000;
            }

            const data = state.data;
            const furnace = data.furnace || 'idle';
            const craft = data.craft || null;
            const materials = data.materials || {};
            const recipes = data.recipes || {};

            // A. Auto Accept Invite Đan Đồng
            if (this.config.refine.autoAcceptInvite && data.dong_invites_in?.length > 0) {
                for (const inv of data.dong_invites_in) {
                    this.log(`🧪 Nhận làm Đan Đồng giúp Đan Chủ: ${inv.owner_name || inv.owner_id}`, 'info');
                    await this.callLdApi('/dong/respond', 'POST', { owner_id: inv.owner_id, accept: true }).catch(() => null);
                }
            }

            // B. Auto Leave Đan Đồng (Hết 5 phút điều hỏa)
            if (this.config.refine.autoLeave && data.dong_serving) {
                const canLeave = data.dong_serving.can_leave || false;
                if (canLeave) {
                    this.log(`🧪 Đã hết giai đoạn Điều Hỏa, tự động rời vai Đan Đồng...`, 'info');
                    await this.callLdApi('/dong/leave', 'POST', { owner_id: data.dong_serving.owner_id }).catch(() => null);
                }
            }

            if (furnace === 'exploded') {
                this.log('🧪 💥 Đan lô bị nổ! Đang dọn dẹp lò đan...', 'warning');
                const jobId = craft?.id || data.craftJobId;
                if (jobId) {
                    await this.callLdApi('/ack-explosion', 'POST', { job_id: jobId });
                }
                return 10000;
            }

            if (furnace === 'ready') {
                this.log('🧪 🎉 Thu hoạch đan dược...', 'info');
                const jobId = craft?.id || data.craftJobId;
                if (jobId) {
                    const collect = await this.callLdApi('/collect', 'POST', { job_id: jobId });
                    if (collect?.success) {
                        const pillName = collect.data?.pill_name || 'Đan';
                        this.log(`🧪 ✅ Thu đan thành công: ${pillName} ★${collect.data?.stars || 1}`, 'success');
                        
                        if (collect.data?.pill_id) {
                            await this.callLdApi('/use-pill', 'POST', { pill_id: String(collect.data.pill_id) });
                            this.log(`🧪 ✅ Đã sử dụng đan tăng Tu Vi.`, 'success');
                        }
                    }
                }
                return 10000;
            }

            if (furnace === 'crafting') {
                const stability = craft ? parseFloat(craft.stability_pct) : 100;
                const unstableSec = craft ? (craft.unstable_left_sec | 0) : 0;
                const leftSec = craft ? (craft.timer_left_sec | 0) : 0;
                const tuneCount = craft ? (craft.tune_count | 0) : 0;
                const tuneMin = data.danMaster?.rng?.tuneSurvivalMin || 3;
                const isSafe = tuneCount >= tuneMin;

                this.log(`🧪 Đang luyện đan | HP Lò: ${stability.toFixed(1)}% | Giai đoạn nhạy cảm: ${unstableSec}s | Thời gian còn lại: ${leftSec}s | Nhấp lửa: ${tuneCount}/${tuneMin}`, 'info');

                if (unstableSec > 0 && !isSafe) {
                    if (stability <= 68) {
                        const cooldown = craft ? (craft.tune_cooldown_left_sec | 0) : 0;
                        if (cooldown <= 0) {
                            this.log(`🧪 ⚠️ Độ ổn định lò giảm (${stability.toFixed(1)}%). Tiến hành Điều Hỏa!`, 'warning');
                            const tune = await this.callLdApi('/tune', 'POST', {});
                            if (tune?.success) {
                                this.log(`🧪 🔥 Điều Hỏa thành công! Giữ lửa: ${tune.data?.craft?.tune_count || (tuneCount+1)}/${tuneMin}`, 'success');
                            }
                        } else {
                            return cooldown * 1000 + 500;
                        }
                    }
                    return 5000;
                } else {
                    this.log(`🧪 Lò đan đã an toàn tuyệt đối. Sẽ tự động thu đan sau ${leftSec}s.`, 'success');
                    return leftSec * 1000 + 3000;
                }
            }

            if (furnace === 'idle') {
                const tiers = ['cuc', 'thuong', 'trung', 'ha'];
                let chosenTier = null;

                for (const tier of tiers) {
                    const rec = recipes[tier];
                    if (rec && rec.craft_unlocked) {
                        const vec = rec.vector || {};
                        let enough = true;
                        for (const key of ['kim', 'moc', 'thuy', 'hoa', 'tho']) {
                            if ((materials[key] || 0) < (vec[key] || 0)) {
                                enough = false;
                                break;
                            }
                        }
                        if (enough) {
                            chosenTier = tier;
                            break;
                        }
                    }
                }

                if (chosenTier) {
                    this.log(`🧪 Tiến hành khai lò luyện đan phẩm: ${chosenTier.toUpperCase()}`, 'info');
                    const start = await this.callLdApi('/start', 'POST', { tier: chosenTier });
                    if (start?.success) {
                        this.log(`🧪 🔥 Khai lò Luyện Đan thành công phẩm ${chosenTier.toUpperCase()}`, 'success');
                    }
                    return 10000;
                } else {
                    const bundles = data.mat_bundles || [];
                    if (bundles.length > 0) {
                        const key = bundles[0].bundle_key;
                        this.log(`🧪 📦 Đang mở túi nguyên liệu: ${bundles[0].name || key}...`, 'info');
                        await this.callLdApi('/open-mat-bundle', 'POST', { job_id: String(key), bundle_key: String(key) });
                        return 5000;
                    } else {
                        this.log('🧪 ❌ Hết nguyên liệu ngũ hành và túi quà linh dược. Tạm ngưng Luyện Đan.', 'error');
                        this.markTaskDoneToday('refine');
                        return 24 * 60 * 60 * 1000;
                    }
                }
            }
            return 30000;
        } catch (e) {
            this.log(`🧪 ❌ Lỗi Luyện Đan: ${e.message}`, 'error');
            return 60000;
        }
    }

    // ==========================================
    // TASK: DO THACH (STONE GAMBLE)
    // ==========================================
    async taskGamble() {
        const hour = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour: 'numeric', hour12: false }));
        const isBettingTime = (hour >= 6 && hour < 13) || (hour >= 16 && hour < 21);

        if (!isBettingTime) {
            this.log('🪙 [Đổ Thạch] Ngoài khung giờ cá cược (06h-13h, 16h-21h). Chờ ca tiếp theo.', 'info');
            return 30 * 60 * 1000;
        }

        this.log('🪙 [Đổ Thạch] Đang kiểm tra phiên đổ thạch...', 'info');
        const doThachUrl = '/do-thach-hh3d?t';
        
        try {
            const token = await decryptor.extractFromHtml(await this.axios.get(doThachUrl).then(r=>r.data).catch(()=>''), /"securityToken"\s*:\s*"([^"]+)"/) || this.securityToken;
            
            const sessionData = await this.postForm(this.ajaxUrl, {
                action: 'load_do_thach_data',
                security_token: token
            });

            if (!sessionData?.success || !sessionData.data) {
                this.log('🪙 ⚠️ Lỗi tải dữ liệu phiên Đổ Thạch', 'warning');
                return 120000;
            }

            const data = sessionData.data;
            const userBetStones = data.stones.filter(s => s.bet_placed);

            if (data.winning_stone_id) {
                const claimable = userBetStones.find(s => s.stone_id === data.winning_stone_id && !s.reward_claimed);
                if (claimable) {
                    this.log(`🪙 🎉 Trúng Đổ Thạch kỳ trước! Đang nhận thưởng...`, 'success');
                    const claim = await this.postForm(this.ajaxUrl, {
                        action: 'claim_do_thach_reward',
                        security_token: token
                    });
                    this.log(`🪙 Kết quả nhận thưởng: ${claim?.data?.message || 'Thành công'}`, 'success');
                }
                return 180000;
            }

            const userBetCount = userBetStones.length;
            if (userBetCount >= 2) {
                this.log('🪙 ✅ Đã đặt đủ 2 cược cho phiên hiện tại. Đợi kết quả.', 'success');
                return 300000;
            }

            const sorted = [...data.stones].sort((a, b) => b.reward_multiplier - a.reward_multiplier);
            const available = sorted.filter(s => !s.bet_placed);
            
            if (available.length === 0) return 300000;

            const strategy = this.config.gamble.choice || 'tai';
            const betsRemaining = 2 - userBetCount;
            const stonesToBet = [];

            if (strategy === 'tai') {
                stonesToBet.push(...available.slice(0, betsRemaining));
            } else {
                const xiu = available.slice(2, 4);
                stonesToBet.push(...xiu.slice(0, betsRemaining));
            }

            for (const stone of stonesToBet) {
                this.log(`🪙 Đặt cược 20 Tiên Ngọc vào [${stone.name}] (Chiến thuật: ${strategy.toUpperCase()})...`, 'info');
                const bet = await this.postForm(this.ajaxUrl, {
                    action: 'place_do_thach_bet',
                    security_token: token,
                    stone_id: stone.stone_id,
                    bet_amount: 20
                });

                if (bet?.success) {
                    this.log(`🪙 ✅ Đặt cược thành công vào [${stone.name}]`, 'success');
                } else {
                    const msg = bet?.data || bet?.message || '';
                    if (msg.includes('nhận thưởng kỳ trước')) {
                        await this.postForm(this.ajaxUrl, { action: 'claim_do_thach_reward', security_token: token }).catch(()=>{});
                    }
                    this.log(`🪙 Đặt cược thất bại: ${msg}`, 'warning');
                }
                await this.sleep(2000);
            }
            return 300000;
        } catch (e) {
            this.log(`🪙 ❌ Lỗi Đổ Thạch: ${e.message}`, 'error');
            return 60000;
        }
    }

    // ==========================================
    // TASK: SPIN & DAILY ACTIVITY REWARDS
    // ==========================================
    async taskSpin() {
        this.log('🎡 [Vòng Quay & Quà Năng Động] Đang thực hiện...', 'info');
        try {
            // A. Spin Vòng Quay Phúc Vận
            const spinRoute = this.act.lotterySpin || 'spin';
            const spinUrl = `/wp-json/lottery/v1/${spinRoute}`;
            
            const spin = await this.request(spinUrl, {
                method: 'POST',
                headers: {
                    'X-WP-Nonce': this.restNonce,
                    'X-Security-Token': this.securityToken,
                    'Content-Type': 'application/json'
                }
            });

            if (spin?.success) {
                this.log(`🎡 ✅ Quay thành công: ${spin.message || 'Nhận quà'}`, 'success');
                return 10000;
            } else {
                const msg = spin?.message || spin?.data?.message || '';
                if (msg.includes('hết lượt') || msg.includes('đã hết lượt')) {
                    this.log('🎡 ✅ Hết lượt quay miễn phí hôm nay.', 'success');
                } else {
                    this.log(`🎡 ⚠️ Quay thất bại: ${msg}`, 'warning');
                }
            }

            // B. Quà Năng Động Ngày
            const stages = ['stage1', 'stage2', 'stage3'];
            const rewardAct = this.act.hdnReward || 'daily_activity_reward';

            for (const stage of stages) {
                if (this.claimedDailyStages.has(stage)) continue;

                const claim = await this.postForm(this.ajaxUrl, {
                    action: rewardAct,
                    stage: stage,
                    security_token: this.securityToken
                });

                if (claim?.success) {
                    this.log(`🎁 ✅ Đã nhận rương Quà Ngày mốc [${stage}]: ${claim.data?.message || 'Thành công'}`, 'success');
                    this.claimedDailyStages.add(stage);
                } else {
                    const msg = claim?.data?.message || claim?.message || '';
                    if (msg.includes('đã nhận') || msg.includes('hoàn thành')) {
                        this.claimedDailyStages.add(stage);
                    } else if (msg.includes('chưa đủ điều kiện')) {
                        // Skip quietly
                    } else {
                        this.log(`🎁 Mốc ${stage} lỗi: ${msg}`, 'warning');
                    }
                }
                await this.sleep(2000);
            }

            if (this.claimedDailyStages.size >= stages.length) {
                this.log('🎁 ✅ Đã nhận đủ tất cả rương Quà Năng Động Ngày!', 'success');
                this.markTaskDoneToday('spin');
                this.claimedDailyStages.clear();
                return 24 * 60 * 60 * 1000;
            }

            return 3600000;
        } catch (e) {
            this.log(`🎡 ❌ Lỗi Vòng Quay: ${e.message}`, 'error');
            return 300000;
        }
    }
}

module.exports = {
    HH3DWorker,
    logBroadcaster
};
