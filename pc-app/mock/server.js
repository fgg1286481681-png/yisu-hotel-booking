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
// Data shape (示例，尽量和原型文档中的“必选 / 可选维度”对齐):
// {
//   id: 1,
//   // 酒店基础信息（必选）
//   name: '易宿国际酒店（上海虹桥店）', // 中文名称
//   city: '上海',
//   address: '浦东新区 XX 路 100 号',
//   starLevel: '五星/豪华型',          // 酒店星级
//   roomType: '大床房, 双床房, 家庭房', // 主要房型描述
//   price: 520,                        // 基础价格（整数即可）
//   openingDate: '2020-05-01',         // 开业时间（YYYY-MM-DD）
//   phone: '021-00000000',
//   // 可选维度
//   nearbyHighlights: '距离虹桥火车站 800 米，周边商务区及购物中心丰富',
//   promotionInfo: '国庆连住 3 晚 8 折；机酒套餐立减 200 元',
//   // 归属与审核信息
//   merchantId: 2,
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
// 可选 query 参数：status=offline 用于“回收站”列表
app.get('/api/hotels', (req, res) => {
    const currentUser = getUserFromToken(req);
    if (!currentUser) {
        return res.status(401).json({ message: '未授权' });
    }

    const db = readDb();
    let hotels = db.hotels || [];

    const { status } = req.query || {};

    // 商户只看自己的酒店，管理员可查看全部
    if (currentUser.role === 'merchant') {
        hotels = hotels.filter((h) => h.merchantId === currentUser.id);
    }

    // 如果有明确的状态过滤（目前主要用于回收站：offline）
    if (status) {
        hotels = hotels.filter((h) => h.status === status);
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
    const {
        id,
        name,
        city,
        address,
        phone,
        starLevel,
        roomType,
        price,
        openingDate,
        nearbyHighlights,
        promotionInfo
    } = payload;

    // 和原型中的“必选维度”保持一致：名称、地址、星级、房型、价格、开业时间
    if (!name || !city || !address || !starLevel || !roomType || (price === undefined || price === null) || !openingDate) {
        return res.status(400).json({ message: '请填写完整的酒店名称、城市、地址、星级、房型、价格及开业时间' });
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
            starLevel: starLevel || existing.starLevel || '',
            roomType: roomType || existing.roomType || '',
            price: price !== undefined && price !== null ? Number(price) : existing.price || 0,
            openingDate: openingDate || existing.openingDate || '',
            nearbyHighlights: nearbyHighlights || existing.nearbyHighlights || '',
            promotionInfo: promotionInfo || existing.promotionInfo || '',
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
            starLevel: starLevel || '',
            roomType: roomType || '',
            price: price !== undefined && price !== null ? Number(price) : 0,
            openingDate: openingDate || '',
            nearbyHighlights: nearbyHighlights || '',
            promotionInfo: promotionInfo || '',
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

// PATCH /api/hotels/:id/status 审核/发布/下线/恢复
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

    // 支持的状态包括：审核通过（approved）、不通过（rejected）、下线（offline）、从下线恢复为已发布（restore）
    if (!['approved', 'rejected', 'offline', 'restore'].includes(status)) {
        return res.status(400).json({ message: '非法状态' });
    }

    const db = readDb();
    db.hotels = db.hotels || [];

    const index = db.hotels.findIndex((h) => h.id === id);
    if (index === -1) {
        return res.status(404).json({ message: '酒店不存在' });
    }

    const existing = db.hotels[index];

    let nextStatus = status;
    // “恢复”语义：仅在当前是 offline 时允许，将状态重新设回 approved
    if (status === 'restore') {
        if (existing.status !== 'offline') {
            return res.status(400).json({ message: '仅已下线酒店可以恢复' });
        }
        nextStatus = 'approved';
    }

    db.hotels[index] = {
        ...existing,
        status: nextStatus,
        rejectReason: nextStatus === 'rejected' ? rejectReason || '' : existing.rejectReason || '',
        updatedAt: Date.now()
    };

    writeDb(db);

    return res.json({ success: true, hotel: sanitizeHotel(db.hotels[index]) });
});

app.listen(PORT, () => {
    console.log(`Mock auth server is running at http://localhost:${PORT}`);
    console.log('DB file:', DB_PATH);
});

