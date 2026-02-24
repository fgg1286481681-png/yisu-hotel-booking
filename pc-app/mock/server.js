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

// ---------- Hotel information APIs ----------
// Data shape (示例):
// {
//   id: 1,
//   name: 'XX 酒店',
//   city: '上海',
//   address: '浦东新区 XX 路 100 号',
//   phone: '021-00000000',
//   merchantId: 2, // 归属商户
//   status: 'pending' | 'approved' | 'rejected' | 'offline',
//   rejectReason: '',
//   updatedAt: 1710000000000
// }

function sanitizeHotel(hotel) {
    // 目前不需要隐藏字段，这里只是为了以后扩展
    return hotel;
}

// 获取当前登录用户
function getUserFromToken(req) {
    const authHeader = req.headers['authorization'] || '';
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    const token = parts[1];
    const userId = tokenStore.get(token);
    if (!userId) return null;

    const db = readDb();
    const user = db.users.find((u) => u.id === userId);
    return user || null;
}

// GET /api/hotels 列表
app.get('/api/hotels', (req, res) => {
    const currentUser = getUserFromToken(req);
    if (!currentUser) {
        return res.status(401).json({ message: '未授权' });
    }

    const db = readDb();
    let hotels = db.hotels || [];

    // 商户只看自己的酒店，管理员可查看全部
    if (currentUser.role === 'merchant') {
        hotels = hotels.filter((h) => h.merchantId === currentUser.id);
    }

    // 按更新时间倒序
    hotels = hotels
        .slice()
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .map(sanitizeHotel);

    return res.json({ success: true, hotels });
});

// POST /api/hotels 创建或编辑酒店信息
app.post('/api/hotels', (req, res) => {
    const currentUser = getUserFromToken(req);
    if (!currentUser) {
        return res.status(401).json({ message: '未授权' });
    }

    const payload = req.body || {};
    const { id, name, city, address, phone } = payload;

    if (!name || !city || !address) {
        return res.status(400).json({ message: '请填写完整的酒店名称、城市和详细地址' });
    }

    const db = readDb();
    db.hotels = db.hotels || [];

    const now = Date.now();

    if (id) {
        // 编辑
        const index = db.hotels.findIndex((h) => h.id === id);
        if (index === -1) {
            return res.status(404).json({ message: '酒店不存在' });
        }
        const existing = db.hotels[index];

        // 商户只能编辑自己的酒店
        if (currentUser.role === 'merchant' && existing.merchantId !== currentUser.id) {
            return res.status(403).json({ message: '无权编辑该酒店' });
        }

        db.hotels[index] = {
            ...existing,
            name,
            city,
            address,
            phone: phone || existing.phone || '',
            // 每次编辑后状态回到待审核
            status: 'pending',
            rejectReason: '',
            updatedAt: now
        };
    } else {
        // 新建
        const newId = db.hotels.length ? Math.max(...db.hotels.map((h) => h.id || 0)) + 1 : 1;
        const hotel = {
            id: newId,
            name,
            city,
            address,
            phone: phone || '',
            merchantId: currentUser.id,
            status: 'pending',
            rejectReason: '',
            updatedAt: now
        };
        db.hotels.push(hotel);
    }

    writeDb(db);

    return res.json({ success: true });
});

// PATCH /api/hotels/:id/status 审核/发布/下线
app.patch('/api/hotels/:id/status', (req, res) => {
    const currentUser = getUserFromToken(req);
    if (!currentUser) {
        return res.status(401).json({ message: '未授权' });
    }

    // 仅管理员可审核/发布/下线
    if (currentUser.role !== 'admin') {
        return res.status(403).json({ message: '只有管理员可以执行该操作' });
    }

    const id = Number(req.params.id);
    const { status, rejectReason } = req.body || {};

    if (!['approved', 'rejected', 'offline'].includes(status)) {
        return res.status(400).json({ message: '非法状态' });
    }

    const db = readDb();
    db.hotels = db.hotels || [];

    const index = db.hotels.findIndex((h) => h.id === id);
    if (index === -1) {
        return res.status(404).json({ message: '酒店不存在' });
    }

    const existing = db.hotels[index];

    db.hotels[index] = {
        ...existing,
        status,
        rejectReason: status === 'rejected' ? rejectReason || '' : existing.rejectReason || '',
        updatedAt: Date.now()
    };

    writeDb(db);

    return res.json({ success: true, hotel: sanitizeHotel(db.hotels[index]) });
});

app.listen(PORT, () => {
    console.log(`Mock auth server is running at http://localhost:${PORT}`);
    console.log('DB file:', DB_PATH);
});

