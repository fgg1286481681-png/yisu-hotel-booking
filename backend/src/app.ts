import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import svgCaptcha from 'svg-captcha';
import { Prisma } from '@prisma/client';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import {
  AuthRequest,
  attachUserIfPresent,
  getCurrentUser,
  requireAuth
} from './middleware/auth';
import {
  formatHotel,
  formatOrder,
  formatRoomType,
  placeholderImage,
  sanitizeUser
} from './utils/format';

const app = express();
const captchaStore = new Map<string, { text: string; expiresAt: number }>();
const ACTIVE_ORDER_STATUSES = ['PENDING', 'PAID'];

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const success = <T,>(res: Response, data: T) => res.json(data);

const signToken = (userId: number) =>
  jwt.sign({ userId }, env.jwtSecret, { expiresIn: '7d' });

const verifyCaptcha = (captchaId?: string, captchaText?: string) => {
  if (!captchaId || !captchaText) {
    return { ok: false, message: '璇峰畬鎴愰獙璇佺爜楠岃瘉' };
  }

  const captcha = captchaStore.get(captchaId);
  if (!captcha) {
    return { ok: false, message: '楠岃瘉鐮佸凡杩囨湡锛岃鍒锋柊鍚庨噸璇?' };
  }

  if (Date.now() > captcha.expiresAt) {
    captchaStore.delete(captchaId);
    return { ok: false, message: '楠岃瘉鐮佸凡杩囨湡锛岃鍒锋柊鍚庨噸璇?' };
  }

  if (captcha.text !== captchaText.toLowerCase().trim()) {
    return { ok: false, message: '楠岃瘉鐮侀敊璇?' };
  }

  captchaStore.delete(captchaId);
  return { ok: true as const };
};

const resolveRoomTypeImage = (name: string, count = 1) => ({
  image: placeholderImage(name),
  images: Array.from({ length: Math.max(count, 1) }, (_, index) =>
    placeholderImage(`${name}-${index + 1}`)
  )
});

const isValidDateString = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const getNightCount = (checkInDate: string, checkOutDate: string) => {
  if (!isValidDateString(checkInDate) || !isValidDateString(checkOutDate)) {
    return 0;
  }

  const start = new Date(`${checkInDate}T00:00:00`);
  const end = new Date(`${checkOutDate}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
};

const getRequestedDates = (source: Request['query']) => {
  const checkInDate =
    typeof source.checkInDate === 'string'
      ? source.checkInDate
      : typeof source.checkIn === 'string'
        ? source.checkIn
        : undefined;

  const checkOutDate =
    typeof source.checkOutDate === 'string'
      ? source.checkOutDate
      : typeof source.checkOut === 'string'
        ? source.checkOut
        : undefined;

  return { checkInDate, checkOutDate };
};

const getBookedRoomCount = async (
  roomTypeId: number,
  checkInDate: string,
  checkOutDate: string,
  excludeOrderId?: number
) => {
  const result = await prisma.order.aggregate({
    _sum: { roomCount: true },
    where: {
      roomTypeId,
      status: { in: ACTIVE_ORDER_STATUSES },
      checkInDate: { lt: checkOutDate },
      checkOutDate: { gt: checkInDate },
      ...(excludeOrderId ? { id: { not: excludeOrderId } } : {})
    }
  });

  return result._sum.roomCount ?? 0;
};

const getRemainingRooms = async (
  roomType: { id: number; stock: number },
  checkInDate?: string,
  checkOutDate?: string
) => {
  if (!checkInDate || !checkOutDate) {
    return roomType.stock;
  }

  const booked = await getBookedRoomCount(roomType.id, checkInDate, checkOutDate);
  return Math.max(roomType.stock - booked, 0);
};

const generateOrderNo = () =>
  `YS${Date.now()}${Math.floor(Math.random() * 9000 + 1000)}`;

app.get('/api/auth/captcha', (_req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 2,
    color: true,
    background: '#f4f4f4'
  });

  const captchaId = `captcha_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  captchaStore.set(captchaId, {
    text: captcha.text.toLowerCase(),
    expiresAt: Date.now() + env.captchaTtlMs
  });

  return success(res, {
    success: true,
    captchaId,
    captchaSvg: captcha.data
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, role, displayName, merchantName, captchaId, captchaText } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: '缂哄皯蹇呰瀛楁' });
  }

  const captchaCheck = verifyCaptcha(captchaId, captchaText);
  if (!captchaCheck.ok) {
    return res.status(400).json({ message: captchaCheck.message });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ message: '瀵嗙爜闀垮害鑷冲皯 8 浣?' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: '鐢ㄦ埛宸插瓨鍦?' });
  }

  const normalizedRole = String(role || 'merchant').toUpperCase();
  const nextRole = ['ADMIN', 'MERCHANT', 'USER'].includes(normalizedRole)
    ? normalizedRole
    : 'MERCHANT';

  const hashedPassword = await bcrypt.hash(String(password), 10);
  const user = await prisma.user.create({
    data: {
      email: String(email),
      password: hashedPassword,
      role: nextRole,
      displayName: displayName ? String(displayName) : String(email),
      merchantName: nextRole === 'MERCHANT' ? (merchantName ? String(merchantName) : null) : null
    }
  });

  const token = signToken(user.id);
  return success(res, {
    success: true,
    user: sanitizeUser(user),
    token
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, captchaId, captchaText } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: '閭鍜屽瘑鐮佸繀濉?' });
  }

  const captchaCheck = verifyCaptcha(captchaId, captchaText);
  if (!captchaCheck.ok) {
    return res.status(400).json({ message: captchaCheck.message });
  }

  const user = await prisma.user.findUnique({ where: { email: String(email) } });
  if (!user) {
    return res.status(401).json({ message: '閭鎴栧瘑鐮侀敊璇?' });
  }

  const passwordHash = user.password;
  const passwordValid = passwordHash.startsWith('$2')
    ? await bcrypt.compare(String(password), passwordHash)
    : String(password) === passwordHash;

  if (!passwordValid) {
    return res.status(401).json({ message: '閭鎴栧瘑鐮侀敊璇?' });
  }

  const token = signToken(user.id);
  return success(res, {
    success: true,
    user: sanitizeUser(user),
    token
  });
});

app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: '鏈巿鏉?' });
  }

  return success(res, {
    success: true,
    user: currentUser
  });
});

app.get('/api/hotels', requireAuth, async (req: AuthRequest, res: Response) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: '鏈巿鏉?' });
  }

  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const where: Prisma.HotelWhereInput = {};

  if (currentUser.role === 'merchant') {
    where.merchantId = currentUser.id;
  }

  if (status) {
    const upperStatus = status.toUpperCase();
    if (['PENDING', 'APPROVED', 'REJECTED', 'OFFLINE'].includes(upperStatus)) {
      where.status = upperStatus;
    }
  }

  const hotels = await prisma.hotel.findMany({
    where,
    include: { roomTypes: true },
    orderBy: { updatedAt: 'desc' }
  });

  return success(res, {
    success: true,
    hotels: hotels.map(formatHotel)
  });
});

app.post('/api/hotels', requireAuth, async (req: AuthRequest, res: Response) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: '鏈巿鏉?' });
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

  if (!name || !city || !address || !starLevel || !roomType || price === undefined || price === null || !openingDate) {
    return res.status(400).json({
      message: '璇峰～鍐欏畬鏁寸殑閰掑簵鍚嶇О銆佸煄甯傘€佸湴鍧€銆佹槦绾с€佹埧鍨嬨€佷环鏍煎強寮€涓氭椂闂?'
    });
  }

  if (id) {
    const hotelId = Number(id);
    const existing = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!existing) {
      return res.status(404).json({ message: '閰掑簵涓嶅瓨鍦?' });
    }

    if (currentUser.role === 'merchant' && existing.merchantId !== currentUser.id) {
      return res.status(403).json({ message: '鏃犳潈缂栬緫璇ラ厭搴?' });
    }

    const updated = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        name: String(name),
        city: String(city),
        address: String(address),
        phone: phone ? String(phone) : '',
        starLevel: String(starLevel),
        roomType: String(roomType),
        price: Number(price),
        openingDate: String(openingDate),
        nearbyHighlights: nearbyHighlights ? String(nearbyHighlights) : '',
        promotionInfo: promotionInfo ? String(promotionInfo) : '',
        status: 'PENDING',
        rejectReason: ''
      },
      include: { roomTypes: true }
    });

    return success(res, {
      success: true,
      hotel: formatHotel(updated)
    });
  }

  const created = await prisma.hotel.create({
    data: {
      name: String(name),
      city: String(city),
      address: String(address),
      phone: phone ? String(phone) : '',
      starLevel: String(starLevel),
      roomType: String(roomType),
      price: Number(price),
      openingDate: String(openingDate),
      nearbyHighlights: nearbyHighlights ? String(nearbyHighlights) : '',
      promotionInfo: promotionInfo ? String(promotionInfo) : '',
      merchantId: currentUser.id,
      status: 'PENDING'
    },
    include: { roomTypes: true }
  });

  return success(res, {
    success: true,
    hotel: formatHotel(created)
  });
});

app.patch('/api/hotels/:id/status', requireAuth, async (req: AuthRequest, res: Response) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: '鏈巿鏉?' });
  }

  if (currentUser.role !== 'admin') {
    return res.status(403).json({ message: '鍙湁绠＄悊鍛樺彲浠ユ墽琛岃鎿嶄綔' });
  }

  const hotelId = Number(req.params.id);
  const { status, rejectReason } = req.body || {};
  const normalized = String(status || '').toUpperCase();

  if (!['APPROVED', 'REJECTED', 'OFFLINE', 'RESTORE'].includes(normalized)) {
    return res.status(400).json({ message: '闈炴硶鐘舵€?' });
  }

  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) {
    return res.status(404).json({ message: '閰掑簵涓嶅瓨鍦?' });
  }

  const nextStatus = normalized === 'RESTORE' ? 'APPROVED' : normalized;
  if (normalized === 'RESTORE' && hotel.status !== 'OFFLINE') {
    return res.status(400).json({ message: '浠呭凡涓嬬嚎閰掑簵鍙仮澶?' });
  }

  const updated = await prisma.hotel.update({
    where: { id: hotelId },
    data: {
      status: nextStatus,
      rejectReason: nextStatus === 'REJECTED' ? String(rejectReason || '') : ''
    },
    include: { roomTypes: true }
  });

  return success(res, {
    success: true,
    hotel: formatHotel(updated)
  });
});

app.post('/api/hotels/:id/room-types', requireAuth, async (req: AuthRequest, res: Response) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: '鏈巿鏉?' });
  }

  const hotelId = Number(req.params.id);
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) {
    return res.status(404).json({ message: '閰掑簵涓嶅瓨鍦?' });
  }

  if (currentUser.role === 'merchant' && hotel.merchantId !== currentUser.id) {
    return res.status(403).json({ message: '鏃犳潈涓鸿閰掑簵鍒涘缓鎴垮瀷' });
  }

  const { roomTypeJson, images } = req.body || {};

  let roomTypeData: Record<string, unknown>;
  try {
    roomTypeData =
      typeof roomTypeJson === 'string' ? JSON.parse(roomTypeJson) : roomTypeJson || {};
  } catch {
    return res.status(400).json({ message: '鎴垮瀷鏁版嵁鏍煎紡閿欒' });
  }

  const {
    name,
    description,
    tags,
    price,
    originalPrice,
    area,
    bedType,
    maxOccupancy,
    breakfastIncluded,
    cancellationPolicy,
    stock
  } = roomTypeData;

  if (!name || price === undefined || price === null) {
    return res.status(400).json({ message: '璇峰～鍐欐埧鍨嬪悕绉板拰浠锋牸' });
  }

  const imageCount = Array.isArray(images) && images.length > 0 ? images.length : 1;
  const imageSet = resolveRoomTypeImage(String(name), imageCount);

  const created = await prisma.roomType.create({
    data: {
      hotelId,
      name: String(name),
      description: description ? String(description) : '',
      tagsJson: JSON.stringify(Array.isArray(tags) ? tags : []),
      price: Number(price),
      originalPrice: originalPrice !== undefined && originalPrice !== null ? Number(originalPrice) : null,
      area: area ? String(area) : '',
      bedType: bedType ? String(bedType) : '',
      maxOccupancy: maxOccupancy ? Number(maxOccupancy) : 2,
      stock: stock ? Number(stock) : 5,
      breakfastIncluded: Boolean(breakfastIncluded),
      cancellationPolicy: cancellationPolicy ? String(cancellationPolicy) : '',
      image: imageSet.image,
      imagesJson: JSON.stringify(imageSet.images)
    }
  });

  return success(res, {
    success: true,
    roomType: formatRoomType(created)
  });
});

app.get('/api/roomTypes', async (req: AuthRequest, res: Response) => {
  const currentUser = await attachUserIfPresent(req);
  const hotelId = typeof req.query.hotelId === 'string' ? Number(req.query.hotelId) : undefined;
  const { checkInDate, checkOutDate } = getRequestedDates(req.query);

  if (hotelId) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: { roomTypes: true }
    });

    if (!hotel) {
      return res.status(404).json({ message: '閰掑簵涓嶅瓨鍦?' });
    }

    if (!currentUser && hotel.status !== 'APPROVED') {
      return res.status(404).json({ message: '鎴垮瀷涓嶅瓨鍦ㄦ垨閰掑簵鏈彂甯?' });
    }

    if (currentUser?.role === 'merchant' && hotel.merchantId !== currentUser.id) {
      return res.status(403).json({ message: '鏃犳潈鏌ョ湅璇ラ厭搴楁埧鍨?' });
    }

    const roomTypes = await Promise.all(
      hotel.roomTypes.map(async (roomType) =>
        formatRoomType(roomType, {
          remainingRooms: await getRemainingRooms(roomType, checkInDate, checkOutDate)
        })
      )
    );

    return success(res, {
      success: true,
      roomTypes
    });
  }

  if (!currentUser) {
    return res.status(401).json({ message: '鏈巿鏉?' });
  }

  let hotelIds: number[] | undefined;
  if (currentUser.role === 'merchant') {
    const hotels = await prisma.hotel.findMany({
      where: { merchantId: currentUser.id },
      select: { id: true }
    });
    hotelIds = hotels.map((item) => item.id);
  }

  const roomTypes = await prisma.roomType.findMany({
    where: hotelIds ? { hotelId: { in: hotelIds } } : {},
    orderBy: { updatedAt: 'desc' }
  });

  return success(res, {
    success: true,
    roomTypes: roomTypes.map((roomType) => formatRoomType(roomType))
  });
});

app.get('/api/orders', requireAuth, async (req: AuthRequest, res: Response) => {
  const currentUser = getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ message: '鏈巿鏉?' });
  }

  const where: Prisma.OrderWhereInput = {};

  if (currentUser.role === 'merchant') {
    const hotels = await prisma.hotel.findMany({
      where: { merchantId: currentUser.id },
      select: { id: true }
    });
    where.hotelId = { in: hotels.map((item) => item.id) };
  }

  const orders = await prisma.order.findMany({
    where,
    include: { hotel: true, roomType: true },
    orderBy: { createdAt: 'desc' }
  });

  return success(res, {
    success: true,
    orders: orders.map(formatOrder)
  });
});

app.get('/api/public/hotels', async (req: Request, res: Response) => {
  const city = typeof req.query.city === 'string' ? req.query.city : undefined;
  const hotels = await prisma.hotel.findMany({
    where: {
      status: 'APPROVED',
      ...(city ? { city } : {})
    },
    include: { roomTypes: true },
    orderBy: { updatedAt: 'desc' }
  });

  return success(res, {
    success: true,
    hotels: hotels.map(formatHotel)
  });
});

app.get('/api/public/hotels/:id', async (req: Request, res: Response) => {
  const hotelId = Number(req.params.id);
  const { checkInDate, checkOutDate } = getRequestedDates(req.query);
  const hotel = await prisma.hotel.findFirst({
    where: {
      id: hotelId,
      status: 'APPROVED'
    },
    include: { roomTypes: true }
  });

  if (!hotel) {
    return res.status(404).json({ message: '閰掑簵涓嶅瓨鍦ㄦ垨鏈彂甯?' });
  }

  const roomTypes = await Promise.all(
    hotel.roomTypes.map(async (roomType) =>
      formatRoomType(roomType, {
        remainingRooms: await getRemainingRooms(roomType, checkInDate, checkOutDate)
      })
    )
  );

  return success(res, {
    success: true,
    hotel: {
      ...formatHotel(hotel),
      roomTypes
    }
  });
});

app.get('/api/public/roomTypes', async (req: Request, res: Response) => {
  const hotelId = typeof req.query.hotelId === 'string' ? Number(req.query.hotelId) : undefined;
  const { checkInDate, checkOutDate } = getRequestedDates(req.query);
  const where = hotelId ? { hotelId } : {};
  const roomTypes = await prisma.roomType.findMany({
    where,
    orderBy: { updatedAt: 'desc' }
  });

  const formattedRoomTypes = await Promise.all(
    roomTypes.map(async (roomType) =>
      formatRoomType(roomType, {
        remainingRooms: await getRemainingRooms(roomType, checkInDate, checkOutDate)
      })
    )
  );

  return success(res, {
    success: true,
    roomTypes: formattedRoomTypes
  });
});

app.get('/api/public/roomTypes/:id', async (req: Request, res: Response) => {
  const roomTypeId = Number(req.params.id);
  const { checkInDate, checkOutDate } = getRequestedDates(req.query);
  const roomType = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
    include: {
      hotel: true
    }
  });

  if (!roomType || roomType.hotel.status !== 'APPROVED') {
    return res.status(404).json({ message: '鎴垮瀷涓嶅瓨鍦ㄦ垨閰掑簵鏈彂甯?' });
  }

  return success(res, {
    success: true,
    roomType: formatRoomType(roomType, {
      remainingRooms: await getRemainingRooms(roomType, checkInDate, checkOutDate)
    })
  });
});

app.post('/api/public/orders', async (req: Request, res: Response) => {
  const {
    hotelId,
    roomTypeId,
    guestName,
    guestPhone,
    checkInDate,
    checkOutDate,
    roomCount,
    adultCount,
    childCount
  } = req.body || {};

  if (!hotelId || !roomTypeId || !guestName || !guestPhone || !checkInDate || !checkOutDate) {
    return res.status(400).json({ message: '璇峰～鍐欏畬鏁寸殑棰勮淇℃伅' });
  }

  if (!isValidDateString(String(checkInDate)) || !isValidDateString(String(checkOutDate))) {
    return res.status(400).json({ message: '鍏ヤ綇鏃ユ湡鏍煎紡涓嶆纭?' });
  }

  const nights = getNightCount(String(checkInDate), String(checkOutDate));
  if (nights <= 0) {
    return res.status(400).json({ message: '绂诲簵鏃ユ湡蹇呴』鏅氫簬鍏ヤ綇鏃ユ湡' });
  }

  const nextRoomCount = Math.max(1, Number(roomCount || 1));
  const nextAdultCount = Math.max(1, Number(adultCount || 1));
  const nextChildCount = Math.max(0, Number(childCount || 0));

  if (!/^1\d{10}$/.test(String(guestPhone))) {
    return res.status(400).json({ message: '璇疯緭鍏ユ纭殑鎵嬫満鍙风爜' });
  }

  const hotel = await prisma.hotel.findFirst({
    where: {
      id: Number(hotelId),
      status: 'APPROVED'
    }
  });

  if (!hotel) {
    return res.status(404).json({ message: '閰掑簵涓嶅瓨鍦ㄦ垨鏈彂甯?' });
  }

  const roomType = await prisma.roomType.findFirst({
    where: {
      id: Number(roomTypeId),
      hotelId: hotel.id
    }
  });

  if (!roomType) {
    return res.status(404).json({ message: '鎴垮瀷涓嶅瓨鍦?' });
  }

  const totalGuests = nextAdultCount + nextChildCount;
  if (totalGuests > roomType.maxOccupancy * nextRoomCount) {
    return res.status(400).json({ message: '鍏ヤ綇浜烘暟瓒呭嚭褰撳墠鎴垮瀷鎵垮彈鑼冨洿' });
  }

  const remainingRooms = await getRemainingRooms(
    roomType,
    String(checkInDate),
    String(checkOutDate)
  );

  if (remainingRooms < nextRoomCount) {
    return res.status(400).json({ message: '褰撳墠鎴垮瀷鍓╀綑鍙鏁伴噺涓嶈冻' });
  }

  const created = await prisma.order.create({
    data: {
      orderNo: generateOrderNo(),
      hotelId: hotel.id,
      roomTypeId: roomType.id,
      guestName: String(guestName),
      guestPhone: String(guestPhone),
      checkInDate: String(checkInDate),
      checkOutDate: String(checkOutDate),
      roomCount: nextRoomCount,
      adultCount: nextAdultCount,
      childCount: nextChildCount,
      nights,
      totalAmount: roomType.price * nights * nextRoomCount,
      status: 'PENDING'
    },
    include: {
      hotel: true,
      roomType: true
    }
  });

  return success(res, {
    success: true,
    order: formatOrder(created)
  });
});

app.get('/api/public/orders/:id', async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const guestPhone =
    typeof req.query.guestPhone === 'string'
      ? req.query.guestPhone
      : undefined;

  if (!guestPhone) {
    return res.status(400).json({ message: '璇锋彁渚涢璁㈡墜鏈哄彿杩涜鏌ヨ' });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { hotel: true, roomType: true }
  });

  if (!order || order.guestPhone !== guestPhone) {
    return res.status(404).json({ message: '璁㈠崟涓嶅瓨鍦?' });
  }

  return success(res, {
    success: true,
    order: formatOrder(order)
  });
});

app.post('/api/public/orders/:id/pay', async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { guestPhone } = req.body || {};

  if (!guestPhone) {
    return res.status(400).json({ message: '璇锋彁渚涙墜鏈哄彿杩涜鏀粯楠岃瘉' });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { hotel: true, roomType: true }
  });

  if (!order || order.guestPhone !== String(guestPhone)) {
    return res.status(404).json({ message: '璁㈠崟涓嶅瓨鍦?' });
  }

  if (order.status === 'CANCELLED') {
    return res.status(400).json({ message: '宸插彇娑堢殑璁㈠崟鏃犳硶鏀粯' });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' },
    include: { hotel: true, roomType: true }
  });

  return success(res, {
    success: true,
    order: formatOrder(updated)
  });
});

app.post('/api/public/orders/:id/cancel', async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { guestPhone } = req.body || {};

  if (!guestPhone) {
    return res.status(400).json({ message: '璇锋彁渚涙墜鏈哄彿杩涜鍙栨秷楠岃瘉' });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { hotel: true, roomType: true }
  });

  if (!order || order.guestPhone !== String(guestPhone)) {
    return res.status(404).json({ message: '璁㈠崟涓嶅瓨鍦?' });
  }

  if (order.status === 'CANCELLED') {
    return success(res, {
      success: true,
      order: formatOrder(order)
    });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
    include: { hotel: true, roomType: true }
  });

  return success(res, {
    success: true,
    order: formatOrder(updated)
  });
});

app.use((_req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  return res.status(500).json({ message: '鏈嶅姟鍣ㄥ唴閮ㄩ敊璇?' });
});

export default app;
