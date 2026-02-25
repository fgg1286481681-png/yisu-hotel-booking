import Taro from '@tarojs/taro';

export type HotelStatus = 'pending' | 'approved' | 'rejected' | 'offline';

// 房型结构（与后端 roomTypes 字段对齐）
export interface RoomType {
  id: number;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  tags?: string[];
  price: number;
  originalPrice?: number;
  area?: string;
  bedType?: string;
  maxOccupancy?: number;
  breakfastIncluded?: boolean;
  cancellationPolicy?: string;
}

// PC 端后台存储的原始酒店结构（与 mock server / 后端接口保持一致）
export interface ServerHotel {
  id: number;
  name: string;
  city: string;
  address: string;
  starLevel: string;
  roomType: string;
  price: number;
  openingDate: string;
  phone?: string;
  nearbyHighlights?: string;
  promotionInfo?: string;
  merchantId?: number;
  status: HotelStatus;
  rejectReason?: string;
  updatedAt?: number;

  // 新增：对外展示用字段（如果后端已经直接给出）
  rating?: number;
  image?: string;
  images?: string[];
  facilities?: string[];
  starRating?: number;
  distance?: number;
  description?: string;
  roomTypes?: RoomType[];
}

// 移动端使用的统一酒店结构
export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  price: number;
  // 评分 / 图片 / 设施是展示用字段，可根据后台基础信息“推导”或给默认值
  rating: number;
  image: string;
  // 轮播图图片数组：如果后端返回 images，就优先使用；否则用单张 image 占位
  images: string[];
  facilities: string[];
  // 1-5 星，方便移动端渲染星级
  starRating: number;

  // 额外信息（可选，用于详情或后续扩展）
  starLevel?: string;
  roomType?: string;
  openingDate?: string;
  phone?: string;
  nearbyHighlights?: string;
  promotionInfo?: string;
  description?: string;
  distance?: number;
  roomTypes?: RoomType[];
}

// 列表查询参数（与移动端 list 页面保持一致）
export interface HotelQueryParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: 'recommend' | 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc' | 'star_high';
}

const BASE_URL = 'http://localhost:3001';

interface PublicHotelListResponse {
  success: boolean;
  hotels: ServerHotel[];
}

interface PublicHotelDetailResponse {
  success: boolean;
  hotel: ServerHotel;
}

// 将后台的 ServerHotel 映射为前端统一使用的 Hotel
function mapServerHotelToClient(h: ServerHotel): Hotel {
  // 1）星级：优先使用后端给的 starRating，没有则根据 starLevel 推导
  const level = (h.starLevel || '').toLowerCase();
  let starRating = typeof h.starRating === 'number' ? h.starRating : 3;
  if (typeof h.starRating !== 'number') {
    if (level.includes('1') || level.includes('经济')) starRating = 1;
    else if (level.includes('2')) starRating = 2;
    else if (level.includes('3') || level.includes('舒适')) starRating = 3;
    else if (level.includes('4') || level.includes('高档')) starRating = 4;
    else if (level.includes('5') || level.includes('豪华')) starRating = 5;
  }

  // 2）评分：优先使用后端 rating，没有则按 id 生成稳定评分
  let rating: number;
  if (typeof h.rating === 'number') {
    rating = h.rating;
  } else {
    const baseRating = 4 + ((h.id % 10) / 10);
    rating = Math.round(baseRating * 10) / 10;
  }

  // 3）主图和轮播图：优先使用后端传过来的 image / images
  const fallbackImage = `https://picsum.photos/seed/hotel-${h.id}/800/450`;
  const mainImage = h.image || fallbackImage;
  const images =
    (h.images && h.images.length > 0 ? h.images : [mainImage]);

  // 4）设施：优先使用后端 facilities；否则从现有字段中“推导”
  let facilities: string[] = [];
  if (Array.isArray(h.facilities) && h.facilities.length > 0) {
    facilities = h.facilities;
  } else {
    if (h.roomType) {
      facilities.push(...h.roomType.split(/[、，,]/).map(s => s.trim()).filter(Boolean));
    }
    if (h.nearbyHighlights) {
      facilities.push('交通便利');
    }
    if (h.promotionInfo) {
      facilities.push('优惠活动');
    }
    if (facilities.length === 0) {
      facilities.push('免费 WiFi', '24 小时前台');
    }
  }

  return {
    id: h.id,
    name: h.name,
    city: h.city,
    address: h.address,
    price: h.price,
    rating,
    image: mainImage,
    images,
    facilities,
    starRating,
    starLevel: h.starLevel,
    roomType: h.roomType,
    openingDate: h.openingDate,
    phone: h.phone,
    nearbyHighlights: h.nearbyHighlights,
    promotionInfo: h.promotionInfo,
    description: h.description,
    distance: h.distance,
    roomTypes: h.roomTypes,
  };
}

// 获取全部对外公开酒店（仅 approved），后续由前端做筛选/排序/分页
async function fetchPublicHotelsRaw(): Promise<ServerHotel[]> {
  const res = await Taro.request<PublicHotelListResponse>({
    url: `${BASE_URL}/api/public/hotels`,
    method: 'GET',
  });

  if (!res.data || !res.data.success) {
    throw new Error('加载酒店列表失败');
  }

  return res.data.hotels || [];
}

// 对外导出的：根据查询参数获取酒店列表（移动端使用）
export async function getHotels(params: HotelQueryParams = {}): Promise<Hotel[]> {
  const all = await fetchPublicHotelsRaw();

  let list = all.slice();

  // 按城市过滤
  if (params.city) {
    list = list.filter(h => h.city === params.city);
  }

  // 价格过滤
  if (typeof params.minPrice === 'number') {
    list = list.filter(h => h.price >= (params.minPrice as number));
  }
  if (typeof params.maxPrice === 'number') {
    list = list.filter(h => h.price <= (params.maxPrice as number));
  }

  // 排序
  switch (params.sort) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      list.sort((a, b) => {
        const ra = 4 + ((a.id % 10) / 10);
        const rb = 4 + ((b.id % 10) / 10);
        return rb - ra;
      });
      break;
    case 'star_high':
      list.sort((a, b) => {
        const la = (a.starLevel || '').length;
        const lb = (b.starLevel || '').length;
        return lb - la;
      });
      break;
    case 'distance_asc':
    case 'recommend':
    default:
      // 先保持后端返回顺序（已按 updatedAt 排序），可按后续需要再补充“智能排序/距离排序”逻辑
      break;
  }

  // 分页
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : list.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  return list.slice(start, end).map(mapServerHotelToClient);
}

// 获取单个酒店详情
export async function getHotelById(id: number): Promise<Hotel | null> {
  const res = await Taro.request<PublicHotelDetailResponse>({
    url: `${BASE_URL}/api/public/hotels/${id}`,
    method: 'GET',
  });

  if (!res.data || !res.data.success || !res.data.hotel) {
    return null;
  }

  return mapServerHotelToClient(res.data.hotel);
}

