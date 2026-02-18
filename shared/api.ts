import Taro from '@tarojs/taro';

// 酒店接口定义
export interface Hotel {
  id: number;
  name: string;
  address: string;
  price: number;
  rating: number;
  image: string;
  city: string;
  facilities: string[];
}

// 酒店查询参数
export interface HotelQueryParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

// 模拟酒店数据
const mockHotels: Hotel[] = [
  {
    id: 1,
    name: '北京王府井大酒店',
    address: '北京市东城区王府井大街',
    price: 580,
    rating: 4.5,
    image: 'https://example.com/hotel1.jpg',
    city: '北京',
    facilities: ['免费WiFi', '停车场', '餐厅', '健身房']
  },
  {
    id: 2,
    name: '上海外滩华尔道夫酒店',
    address: '上海市黄浦区中山东一路',
    price: 1200,
    rating: 4.8,
    image: 'https://example.com/hotel2.jpg',
    city: '上海',
    facilities: ['免费WiFi', '游泳池', '水疗中心', '餐厅']
  },
  {
    id: 3,
    name: '广州白云宾馆',
    address: '广州市越秀区环市东路',
    price: 420,
    rating: 4.2,
    image: 'https://example.com/hotel3.jpg',
    city: '广州',
    facilities: ['免费WiFi', '停车场', '会议室']
  },
  {
    id: 4,
    name: '深圳香格里拉大酒店',
    address: '深圳市罗湖区建设路',
    price: 880,
    rating: 4.6,
    image: 'https://example.com/hotel4.jpg',
    city: '深圳',
    facilities: ['免费WiFi', '游泳池', '健身房', '餐厅']
  },
  {
    id: 5,
    name: '杭州西湖国宾馆',
    address: '杭州市西湖区杨公堤',
    price: 680,
    rating: 4.7,
    image: 'https://example.com/hotel5.jpg',
    city: '杭州',
    facilities: ['免费WiFi', '停车场', '餐厅', '花园']
  }
];

// 获取酒店列表（模拟数据）
export const getHotels = async (params: HotelQueryParams = {}): Promise<Hotel[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredHotels = [...mockHotels];
  
  // 根据城市筛选
  if (params.city) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.city.includes(params.city!) || hotel.name.includes(params.city!)
    );
  }
  
  // 根据价格筛选
  if (params.minPrice !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price >= params.minPrice!);
  }
  
  if (params.maxPrice !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price <= params.maxPrice!);
  }
  
  // 分页
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return filteredHotels.slice(start, end);
};

// 获取单个酒店详情
export const getHotel = async (id: number): Promise<Hotel | null> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const hotel = mockHotels.find(h => h.id === id);
  return hotel || null;
};

// 获取城市列表
export const getCities = async (): Promise<string[]> => {
  const cities = Array.from(new Set(mockHotels.map(hotel => hotel.city)));
  return cities;
};

// 真实API调用（Phase 4使用）
export const fetchHotelsFromAPI = async (params: HotelQueryParams): Promise<Hotel[]> => {
  try {
    const response = await Taro.request({
      url: '/api/hotels',
      method: 'GET',
      data: params
    });
    
    if (response.statusCode === 200) {
      return response.data as Hotel[];
    } else {
      throw new Error(`API请求失败: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('获取酒店数据失败:', error);
    throw error;
  }
};