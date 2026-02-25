// 房型接口定义
export interface RoomType {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: string[]; // 如：湖景、浴缸、禁烟
  price: number;
  originalPrice?: number; // 原价，用于显示折扣
  area?: string; // 面积，如：30㎡
  bedType?: string; // 床型，如：大床/双床
  maxOccupancy: number; // 最大入住人数
  breakfastIncluded?: boolean; // 是否包含早餐
  cancellationPolicy?: string; // 取消政策
}

// 酒店接口定义
export interface Hotel {
  id: number;
  brand?: '易宿' | '爱住'; // 酒店品牌
  name: string;
  address: string;
  price: number; // 最低价格
  rating: number;
  image: string; // 主图
  images: string[]; // 多张图片
  city: string;
  facilities: string[];
  starRating?: number; // 星级评分
  distance?: number;   // 距离（公里）
  roomTypes?: RoomType[]; // 房型列表
  description?: string; // 酒店描述
  phone?: string; // 联系电话
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
  sort?: 'recommend' | 'price_asc' | 'price_desc' | 'rating_desc' | 'distance_asc' | 'star_high';
  starRating?: number[]; // 星级筛选（多选）
}

// 模拟酒店数据 - 扩展更多数据
const mockHotels: Hotel[] = [
  {
    id: 1,
    name: '北京王府井大酒店',
    address: '北京市东城区王府井大街',
    price: 580,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop'
    ],
    city: '北京',
    facilities: ['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室'],
    starRating: 4,
    distance: 2.5,
    description: '位于北京市中心王府井商业区，交通便利，设施齐全。',
    phone: '010-12345678',
    roomTypes: [
      {
        id: 1,
        name: '豪华大床房',
        description: '宽敞舒适的豪华大床房，配备现代化设施',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['湖景', '浴缸', '禁烟'],
        price: 580,
        originalPrice: 680,
        area: '30㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '行政双床房',
        description: '适合商务旅行的行政双床房',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
        tags: ['城市景观', '办公桌', '免费WiFi'],
        price: 650,
        originalPrice: 750,
        area: '35㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 3,
        name: '套房',
        description: '豪华套房，配备独立客厅和卧室',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
        tags: ['湖景', '浴缸', '客厅', '迷你吧'],
        price: 980,
        originalPrice: 1200,
        area: '60㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      }
    ]
  },
  {
    id: 2,
    name: '上海外滩华尔道夫酒店',
    address: '上海市黄浦区中山东一路',
    price: 1200,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop'
    ],
    city: '上海',
    facilities: ['免费WiFi', '游泳池', '水疗中心', '餐厅', '行政酒廊', '商务中心'],
    starRating: 5,
    distance: 3.1,
    description: '位于上海外滩的豪华酒店，拥有绝佳的江景和顶级服务。',
    phone: '021-12345678',
    roomTypes: [
      {
        id: 1,
        name: '豪华江景房',
        description: '宽敞的江景房，配备现代化设施',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
        tags: ['江景', '浴缸', '免费WiFi'],
        price: 1200,
        originalPrice: 1500,
        area: '45㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '行政套房',
        description: '豪华行政套房，配备独立客厅',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['江景', '浴缸', '客厅', '迷你吧'],
        price: 1800,
        originalPrice: 2200,
        area: '80㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 3,
    name: '广州白云宾馆',
    address: '广州市越秀区环市东路',
    price: 420,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '广州',
    facilities: ['免费WiFi', '停车场', '会议室', '餐厅', '商务中心'],
    starRating: 3,
    distance: 1.8,
    description: '位于广州市中心的商务酒店，交通便利。',
    phone: '020-12345678',
    roomTypes: [
      {
        id: 1,
        name: '标准双床房',
        description: '舒适的标准双床房，适合商务旅行',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
        tags: ['城市景观', '办公桌', '免费WiFi'],
        price: 420,
        originalPrice: 500,
        area: '25㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '豪华大床房',
        description: '宽敞的豪华大床房，配备舒适床品',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 550,
        originalPrice: 650,
        area: '30㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 4,
    name: '深圳香格里拉大酒店',
    address: '深圳市罗湖区建设路',
    price: 880,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '深圳',
    facilities: ['免费WiFi', '游泳池', '健身房', '餐厅', '水疗中心', '商务中心'],
    starRating: 4,
    distance: 4.2,
    description: '深圳罗湖区的豪华酒店，设施齐全，服务一流。',
    phone: '0755-12345678',
    roomTypes: [
      {
        id: 1,
        name: '豪华城景房',
        description: '城市景观豪华房，视野开阔',
        image: 'https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 880,
        originalPrice: 1000,
        area: '35㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '行政套房',
        description: '豪华行政套房，配备独立工作区',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '客厅', '办公桌'],
        price: 1200,
        originalPrice: 1500,
        area: '60㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 5,
    name: '杭州西湖国宾馆',
    address: '杭州市西湖区杨公堤',
    price: 680,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '杭州',
    facilities: ['免费WiFi', '停车场', '餐厅', '花园', '游泳池', '会议室'],
    starRating: 4,
    distance: 5.5,
    description: '位于西湖边的国宾馆，环境优美，风景如画。',
    phone: '0571-12345678',
    roomTypes: [
      {
        id: 1,
        name: '湖景大床房',
        description: '西湖湖景房，视野绝佳',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
        tags: ['湖景', '浴缸', '阳台', '免费WiFi'],
        price: 680,
        originalPrice: 800,
        area: '40㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '花园套房',
        description: '带私人花园的套房，环境幽静',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['花园景观', '浴缸', '客厅', '阳台'],
        price: 980,
        originalPrice: 1200,
        area: '70㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 6,
    name: '成都锦江宾馆',
    address: '成都市锦江区人民南路',
    price: 520,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '成都',
    facilities: ['免费WiFi', '停车场', '餐厅', '会议室', '商务中心'],
    starRating: 3,
    distance: 2.1,
    description: '成都市中心的老牌酒店，地理位置优越。',
    phone: '028-12345678',
    roomTypes: [
      {
        id: 1,
        name: '标准大床房',
        description: '舒适的标准大床房，配备基本设施',
        image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop',
        tags: ['城市景观', '办公桌', '免费WiFi'],
        price: 520,
        originalPrice: 600,
        area: '28㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '豪华双床房',
        description: '宽敞的豪华双床房，适合家庭出行',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 650,
        originalPrice: 750,
        area: '35㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 7,
    name: '西安钟楼饭店',
    address: '西安市碑林区南大街',
    price: 380,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '西安',
    facilities: ['免费WiFi', '停车场', '餐厅', '会议室'],
    starRating: 3,
    distance: 3.8,
    description: '位于西安钟楼附近的酒店，交通便利。',
    phone: '029-12345678',
    roomTypes: [
      {
        id: 1,
        name: '经济大床房',
        description: '经济实惠的大床房，适合预算有限的旅客',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
        tags: ['城市景观', '免费WiFi'],
        price: 380,
        originalPrice: 450,
        area: '22㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '标准双床房',
        description: '标准双床房，配备基本设施',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['城市景观', '办公桌', '免费WiFi'],
        price: 450,
        originalPrice: 550,
        area: '25㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 8,
    brand: '易宿',
    name: '三亚亚龙湾度假酒店',
    address: '三亚市亚龙湾国家旅游度假区',
    price: 980,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop'
    ],
    city: '三亚',
    facilities: ['免费WiFi', '游泳池', '私人海滩', '水疗中心', '餐厅', '健身房', '儿童乐园'],
    starRating: 5,
    distance: 12.5,
    description: '三亚亚龙湾的豪华度假酒店，拥有私人海滩和丰富的水上活动。',
    phone: '0898-12345678',
    roomTypes: [
      {
        id: 1,
        name: '海景大床房',
        description: '海景大床房，直面亚龙湾海景',
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
        tags: ['海景', '浴缸', '阳台', '免费WiFi'],
        price: 980,
        originalPrice: 1200,
        area: '45㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      },
      {
        id: 2,
        name: '豪华海景套房',
        description: '豪华海景套房，配备独立客厅和阳台',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['海景', '浴缸', '客厅', '阳台', '迷你吧'],
        price: 1500,
        originalPrice: 1800,
        area: '80㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      },
      {
        id: 3,
        name: '家庭套房',
        description: '适合家庭出游的套房，配备儿童设施',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
        tags: ['海景', '浴缸', '客厅', '儿童床'],
        price: 1200,
        originalPrice: 1500,
        area: '70㎡',
        bedType: '大床+儿童床',
        maxOccupancy: 4,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 9,
    name: '南京金陵饭店',
    address: '南京市鼓楼区汉中路',
    price: 450,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '南京',
    facilities: ['免费WiFi', '停车场', '餐厅', '健身房', '会议室'],
    starRating: 4,
    distance: 2.9,
    description: '南京市中心的老牌酒店，地理位置优越。',
    phone: '025-12345678',
    roomTypes: [
      {
        id: 1,
        name: '标准大床房',
        description: '舒适的标准大床房，配备现代化设施',
        image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop',
        tags: ['城市景观', '办公桌', '免费WiFi'],
        price: 450,
        originalPrice: 550,
        area: '28㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '豪华双床房',
        description: '宽敞的豪华双床房，适合商务旅行',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 580,
        originalPrice: 680,
        area: '35㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 10,
    name: '武汉光谷凯悦酒店',
    address: '武汉市洪山区珞喻路',
    price: 620,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '武汉',
    facilities: ['免费WiFi', '游泳池', '健身房', '餐厅', '会议室', '商务中心'],
    starRating: 4,
    distance: 4.7,
    description: '武汉光谷地区的豪华酒店，适合商务和休闲旅客。',
    phone: '027-12345678',
    roomTypes: [
      {
        id: 1,
        name: '豪华大床房',
        description: '豪华大床房，配备现代化设施',
        image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 620,
        originalPrice: 750,
        area: '35㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '行政套房',
        description: '行政套房，配备独立工作区和客厅',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '客厅', '办公桌'],
        price: 850,
        originalPrice: 1000,
        area: '60㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      }
    ]
  },
  // 新增北京酒店
  {
    id: 11,
    brand: '易宿',
    name: '北京国贸大酒店',
    address: '北京市朝阳区建国门外大街',
    price: 850,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '游泳池', '健身房', '水疗中心', '餐厅', '会议室'],
    starRating: 5,
    distance: 3.2,
    roomTypes: [
      {
        id: 1,
        name: '商务大床房',
        description: '位于高层楼层，适合商务出行，配备办公桌',
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop',
        tags: ['城市景观', '办公桌', '免费WiFi'],
        price: 850,
        originalPrice: 980,
        area: '32㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '行政套房',
        description: '享有行政酒廊礼遇，配备独立客厅和工作区',
        image: 'https://images.unsplash.com/photo-1521783593447-5702f2c0c8f2?w=800&auto=format&fit=crop',
        tags: ['城市景观', '客厅', '迷你吧'],
        price: 1180,
        originalPrice: 1380,
        area: '60㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      }
    ]
  },
  {
    id: 12,
    name: '北京希尔顿酒店',
    address: '北京市东城区王府井大街',
    price: 720,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '停车场', '健身房', '餐厅', '商务中心'],
    starRating: 4,
    distance: 2.8,
    roomTypes: [
      {
        id: 1,
        name: '高级大床房',
        description: '温馨舒适的大床房，临近王府井商业区',
        image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?w=800&auto=format&fit=crop',
        tags: ['城市景观', '禁烟', '免费WiFi'],
        price: 720,
        originalPrice: 820,
        area: '28㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '豪华双床房',
        description: '配备两张单人床，适合家庭或朋友出行',
        image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop',
        tags: ['城市景观', '双床', '免费WiFi'],
        price: 780,
        originalPrice: 880,
        area: '30㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 13,
    name: '北京香格里拉饭店',
    address: '北京市海淀区紫竹院路',
    price: 680,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '游泳池', '健身房', '水疗中心', '餐厅'],
    starRating: 5,
    distance: 5.1,
    roomTypes: [
      {
        id: 1,
        name: '园景大床房',
        description: '可俯瞰紫竹院公园景观，环境安静',
        image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop',
        tags: ['园景', '浴缸', '免费WiFi'],
        price: 680,
        originalPrice: 880,
        area: '36㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '行政楼层房',
        description: '享行政楼层礼遇，含双早与下午茶',
        image: 'https://images.unsplash.com/photo-1519710884009-4803fa4edc6d?w=800&auto=format&fit=crop',
        tags: ['园景', '行政酒廊', '免费WiFi'],
        price: 880,
        originalPrice: 1080,
        area: '38㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 14,
    name: '北京长城饭店',
    address: '北京市朝阳区东三环北路',
    price: 550,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '停车场', '餐厅', '会议室'],
    starRating: 4,
    distance: 4.5,
    roomTypes: [
      {
        id: 1,
        name: '标准双床房',
        description: '经典双床房，性价比高，适合会展出行',
        image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800&auto=format&fit=crop',
        tags: ['城市景观', '双床', '免费WiFi'],
        price: 550,
        originalPrice: 650,
        area: '26㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '豪华大床房',
        description: '面向东三环景观，房间空间更大',
        image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?w=800&auto=format&fit=crop',
        tags: ['城市景观', '大床', '免费WiFi'],
        price: 620,
        originalPrice: 720,
        area: '30㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 15,
    name: '北京金融街威斯汀大酒店',
    address: '北京市西城区金融大街',
    price: 780,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '游泳池', '健身房', '水疗中心', '餐厅', '商务中心'],
    starRating: 5,
    distance: 3.7,
    roomTypes: [
      {
        id: 1,
        name: '金融街景观房',
        description: '可俯瞰金融街城市景观，安静舒适',
        image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 780,
        originalPrice: 980,
        area: '34㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '行政套房',
        description: '适合高端商务客户，含行政酒廊权益',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop',
        tags: ['行政酒廊', '客厅', '迷你吧'],
        price: 1180,
        originalPrice: 1480,
        area: '65㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 16,
    name: '北京丽思卡尔顿酒店',
    address: '北京市朝阳区建国路',
    price: 950,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '游泳池', '健身房', '水疗中心', '餐厅', '行政酒廊'],
    starRating: 5,
    distance: 2.9,
    roomTypes: [
      {
        id: 1,
        name: '豪华城景房',
        description: '位于高层，可俯瞰国贸核心区夜景',
        image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 950,
        originalPrice: 1180,
        area: '40㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      },
      {
        id: 2,
        name: '豪华套房',
        description: '一室一厅布局，适合长住与商务会客',
        image: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?w=800&auto=format&fit=crop',
        tags: ['客厅', '浴缸', '行政酒廊'],
        price: 1380,
        originalPrice: 1680,
        area: '70㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 17,
    name: '北京昆仑饭店',
    address: '北京市朝阳区新源南路',
    price: 620,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '停车场', '健身房', '餐厅', '会议室'],
    starRating: 4,
    distance: 4.8,
    roomTypes: [
      {
        id: 1,
        name: '标准大床房',
        description: '靠近使馆区，适合商务与旅游出行',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
        tags: ['城市景观', '大床', '免费WiFi'],
        price: 620,
        originalPrice: 720,
        area: '27㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '豪华双床房',
        description: '空间更大，配备两张单人床',
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop',
        tags: ['城市景观', '双床', '免费WiFi'],
        price: 680,
        originalPrice: 820,
        area: '30㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 18,
    name: '北京国际艺苑皇冠假日酒店',
    address: '北京市东城区王府井大街',
    price: 580,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '健身房', '餐厅', '商务中心'],
    starRating: 4,
    distance: 2.3,
    roomTypes: [
      {
        id: 1,
        name: '经典大床房',
        description: '靠近王府井步行街，出行便捷',
        image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop',
        tags: ['城市景观', '禁烟', '免费WiFi'],
        price: 580,
        originalPrice: 680,
        area: '24㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: false,
        cancellationPolicy: '入住前24小时可免费取消'
      },
      {
        id: 2,
        name: '舒适双床房',
        description: '适合朋友结伴出行，含双早',
        image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&auto=format&fit=crop',
        tags: ['城市景观', '双床', '免费WiFi'],
        price: 630,
        originalPrice: 730,
        area: '26㎡',
        bedType: '双床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前24小时可免费取消'
      }
    ]
  },
  {
    id: 19,
    name: '北京金茂威斯汀大饭店',
    address: '北京市朝阳区东三环北路',
    price: 750,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '游泳池', '健身房', '水疗中心', '餐厅'],
    starRating: 5,
    distance: 3.5,
    roomTypes: [
      {
        id: 1,
        name: '豪华大床房',
        description: '位于中高层，采光好，配备浴缸',
        image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 750,
        originalPrice: 880,
        area: '36㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '行政景观房',
        description: '观景更佳，含行政酒廊与晚间鸡尾酒',
        image: 'https://images.unsplash.com/photo-1519710884009-4803fa4edc6d?w=800&auto=format&fit=crop',
        tags: ['行政酒廊', '城市景观', '免费WiFi'],
        price: 920,
        originalPrice: 1120,
        area: '38㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  {
    id: 20,
    name: '北京柏悦酒店',
    address: '北京市朝阳区建国门外大街',
    price: 880,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    city: '北京',
    facilities: ['免费WiFi', '游泳池', '健身房', '水疗中心', '餐厅', '行政酒廊'],
    starRating: 5,
    distance: 3.0,
    roomTypes: [
      {
        id: 1,
        name: '柏悦大床房',
        description: '现代设计风格客房，采光充足',
        image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop',
        tags: ['城市景观', '浴缸', '免费WiFi'],
        price: 880,
        originalPrice: 1080,
        area: '38㎡',
        bedType: '大床',
        maxOccupancy: 2,
        breakfastIncluded: true,
        cancellationPolicy: '入住前48小时可免费取消'
      },
      {
        id: 2,
        name: '柏悦套房',
        description: '一房一厅布局，提供更宽敞的起居空间',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop',
        tags: ['客厅', '浴缸', '行政酒廊'],
        price: 1380,
        originalPrice: 1680,
        area: '72㎡',
        bedType: '大床',
        maxOccupancy: 3,
        breakfastIncluded: true,
        cancellationPolicy: '入住前72小时可免费取消'
      }
    ]
  },
  // 爱住品牌示例酒店
  {
    id: 21,
    brand: '爱住',
    name: '爱住精选酒店（北京国贸店）',
    address: '北京市朝阳区建国门外大街 12 号',
    price: 630,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop'
    ],
    city: '北京',
    facilities: ['免费WiFi', '停车场', '餐厅', '健身房'],
    starRating: 4,
    distance: 3.2,
    description: '爱住品牌北京商务旗舰店，紧邻国贸商圈与地铁枢纽。',
    phone: '010-88880001'
  },
  {
    id: 22,
    brand: '爱住',
    name: '爱住城市酒店（上海外滩店）',
    address: '上海市黄浦区外滩中山东一路 66 号',
    price: 720,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'
    ],
    city: '上海',
    facilities: ['免费WiFi', '江景房', '餐厅', '商务中心'],
    starRating: 4,
    distance: 2.1,
    description: '坐拥外滩夜景的爱住品牌城市酒店，适合商务与度假。',
    phone: '021-88880002'
  },
  {
    id: 23,
    brand: '爱住',
    name: '爱住轻居（广州珠江新城店）',
    address: '广州市天河区珠江新城华夏路 9 号',
    price: 480,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop'
    ],
    city: '广州',
    facilities: ['免费WiFi', '停车场', '自助洗衣', '简餐吧'],
    starRating: 3,
    distance: 2.4,
    description: '主打年轻客群的爱住轻居品牌店，步行可达珠江新城核心区。',
    phone: '020-88880003'
  },
  {
    id: 24,
    brand: '爱住',
    name: '爱住度假酒店（成都青城山店）',
    address: '成都市都江堰市青城山风景区旁',
    price: 560,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop'
    ],
    city: '成都',
    facilities: ['免费WiFi', '温泉', '花园', '餐厅'],
    starRating: 4,
    distance: 10.5,
    description: '依山傍水的爱住度假酒店，提供温泉与花园景观客房。',
    phone: '028-88880004'
  },
  {
    id: 25,
    brand: '爱住',
    name: '爱住海景酒店（三亚湾店）',
    address: '三亚市三亚湾海滨路 188 号',
    price: 920,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop'
    ],
    city: '三亚',
    facilities: ['免费WiFi', '私人海滩', '游泳池', '儿童乐园'],
    starRating: 5,
    distance: 8.8,
    description: '面朝大海的爱住品牌海景酒店，适合亲子与情侣度假。',
    phone: '0898-88880005'
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
      hotel.city === params.city
    );
  }
  
  // 根据价格筛选
  if (params.minPrice !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price >= params.minPrice!);
  }
  
  if (params.maxPrice !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => hotel.price <= params.maxPrice!);
  }
  
  // 根据星级筛选（如果starRating参数存在）
  if (params.starRating && params.starRating.length > 0) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.starRating && params.starRating!.includes(hotel.starRating)
    );
  }
  
  // 排序逻辑
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        filteredHotels.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredHotels.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        filteredHotels.sort((a, b) => b.rating - a.rating);
        break;
      case 'star_high':
        // 按星级降序排序（高星优先）
        filteredHotels.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
        break;
      case 'distance_asc':
        filteredHotels.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'recommend':
      default:
        // 推荐排序：综合评分和价格
        filteredHotels.sort((a, b) => {
          const scoreA = a.rating * 20 - a.price / 50;
          const scoreB = b.rating * 20 - b.price / 50;
          return scoreB - scoreA;
        });
        break;
    }
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

// 真实API调用将在Phase 4实现，在mobile-app项目中创建专门的API文件
// 例如：mobile-app/src/shared/api-taro.ts