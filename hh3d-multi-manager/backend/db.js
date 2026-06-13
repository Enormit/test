const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database file if it doesn't exist
function initDb() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const initialData = {
                accounts: []
            };
            fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
        }
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

// Read all data from database
function readDb() {
    initDb();
    try {
        const content = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Failed to read database, returning empty structure:', error);
        return { accounts: [] };
    }
}

// Write data to database
function writeDb(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Failed to write database:', error);
        return false;
    }
}

// Get all accounts
function getAccounts() {
    const db = readDb();
    return db.accounts || [];
}

// Save or update an account
function saveAccount(account) {
    const db = readDb();
    if (!db.accounts) {
        db.accounts = [];
    }
    const index = db.accounts.findIndex(acc => acc.id === account.id);
    
    // Default task config if not specified
    const defaultTasks = {
        checkin: true,
        chest: true,
        boss: true,
        trial: true,
        qa: true,
        mining: true,
        refine: true,
        gamble: false,
        spin: true
    };

    const defaultMining = {
        mineType: 'silver',
        mineId: null
    };

    const defaultRefine = {
        autoAcceptInvite: true,
        autoLeave: true,
        autoInvite: false,
        inviteIds: '',
        waitInviteSeconds: 60
    };

    const defaultGamble = {
        choice: 'tai'
    };

    const defaultProxy = {
        enabled: false,
        type: 'http',
        host: '',
        port: null,
        username: '',
        password: ''
    };

    const newAccount = {
        id: account.id,
        name: account.name || `Tài khoản ${account.id}`,
        cookies: account.cookies,
        config: {
            tasks: { ...defaultTasks, ...(account.config?.tasks || {}) },
            mining: { ...defaultMining, ...(account.config?.mining || {}) },
            refine: { ...defaultRefine, ...(account.config?.refine || {}) },
            gamble: { ...defaultGamble, ...(account.config?.gamble || {}) },
            proxy: { ...defaultProxy, ...(account.config?.proxy || {}) }
        },
        stats: account.stats || {
            level: 'Chưa cập nhật',
            lingThach: 0,
            sect: 'Chưa cập nhật',
            lastUpdated: null
        }
    };

    if (index !== -1) {
        // Keep existing stats and configurations if updating
        db.accounts[index] = {
            ...db.accounts[index],
            name: account.name || db.accounts[index].name,
            cookies: account.cookies || db.accounts[index].cookies,
            config: {
                tasks: { ...db.accounts[index].config.tasks, ...(account.config?.tasks || {}) },
                mining: { ...db.accounts[index].config.mining, ...(account.config?.mining || {}) },
                refine: { ...db.accounts[index].config.refine, ...(account.config?.refine || {}) },
                gamble: { ...db.accounts[index].config.gamble, ...(account.config?.gamble || {}) },
                proxy: { ...db.accounts[index].config.proxy, ...(account.config?.proxy || {}) }
            },
            stats: { ...db.accounts[index].stats, ...(account.stats || {}) }
        };
    } else {
        db.accounts.push(newAccount);
    }

    writeDb(db);
    return index !== -1 ? db.accounts[index] : newAccount;
}

// Update cookies for an account
function updateCookies(id, cookies) {
    const db = readDb();
    const index = db.accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
        db.accounts[index].cookies = cookies;
        writeDb(db);
        return true;
    }
    return false;
}

// Delete an account
function deleteAccount(id) {
    const db = readDb();
    const index = db.accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
        db.accounts.splice(index, 1);
        writeDb(db);
        return true;
    }
    return false;
}

// Update account statistics
function updateStats(id, stats) {
    const db = readDb();
    const index = db.accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
        db.accounts[index].stats = {
            ...db.accounts[index].stats,
            ...stats,
            lastUpdated: new Date().toISOString()
        };
        writeDb(db);
        return true;
    }
    return false;
}

// Update account task config
function updateConfig(id, config) {
    const db = readDb();
    const index = db.accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
        db.accounts[index].config = {
            tasks: { ...db.accounts[index].config.tasks, ...(config.tasks || {}) },
            mining: { ...db.accounts[index].config.mining, ...(config.mining || {}) },
            refine: { ...db.accounts[index].config.refine, ...(config.refine || {}) },
            gamble: { ...db.accounts[index].config.gamble, ...(config.gamble || {}) },
            proxy: { ...db.accounts[index].config.proxy, ...(config.proxy || {}) }
        };
        writeDb(db);
        return db.accounts[index];
    }
    return null;
}

module.exports = {
    getAccounts,
    saveAccount,
    updateCookies,
    deleteAccount,
    updateStats,
    updateConfig
};
