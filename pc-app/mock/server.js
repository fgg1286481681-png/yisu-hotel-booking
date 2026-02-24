// Mock auth server using Express
// Encoding: UTF-8

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

const DB_PATH = path.join(__dirname, 'db.json');

// In-memory token -> userId mapping
const tokenStore = new Map();

app.use(cors());
app.use(express.json());

// Helper to read DB
function readDb() {
    if (!fs.existsSync(DB_PATH)) {
        return { users: [] };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    try {
        return JSON.parse(raw || '{"users": []}');
    } catch (e) {
        console.error('Failed to parse db.json, falling back to empty', e);
        return { users: [] };
    }
}

// Helper to write DB
function writeDb(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// Simple token generator (not secure; demo only)
function generateToken(userId, email) {
    const raw = `${userId}:${email}:${Date.now()}:${Math.random()}`;
    return Buffer.from(raw).toString('base64');
}

function sanitizeUser(user) {
    const { id, email, role, displayName } = user;
    return { id, email, role, displayName };
}

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    const { email, password, role, displayName, merchantName } = req.body || {};

    if (!email || !password || !role) {
        return res.status(400).json({ message: '缺少必要字段' });
    }

    const db = readDb();
    const existing = db.users.find((u) => u.email === email);
    if (existing) {
        return res.status(400).json({ message: '用户已存在' });
    }

    const newId = db.users.length ? Math.max(...db.users.map((u) => u.id || 0)) + 1 : 1;
    const user = {
        id: newId,
        email,
        password, // 明文存储仅用于演示，生产环境请务必加密
        role,
        displayName: displayName || email,
        merchantName: role === 'merchant' ? merchantName || null : null
    };

    db.users.push(user);
    writeDb(db);

    const token = generateToken(user.id, user.email);
    tokenStore.set(token, user.id);

    return res.json({
        success: true,
        user: sanitizeUser(user),
        token
    });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ message: '邮箱和密码必填' });
    }

    const db = readDb();
    const user = db.users.find((u) => u.email === email);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const token = generateToken(user.id, user.email);
    tokenStore.set(token, user.id);

    return res.json({
        success: true,
        user: sanitizeUser(user),
        token
    });
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: '未授权' });
    }

    const token = parts[1];
    const userId = tokenStore.get(token);
    if (!userId) {
        return res.status(401).json({ message: '无效 token 或会话已过期' });
    }

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
        return res.status(401).json({ message: '用户不存在' });
    }

    return res.json({
        success: true,
        user: sanitizeUser(user)
    });
});

app.listen(PORT, () => {
    console.log(`Mock auth server is running at http://localhost:${PORT}`);
    console.log('DB file:', DB_PATH);
});

