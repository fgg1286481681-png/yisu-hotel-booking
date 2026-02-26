"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const taro = require("./taro.js");
const mockHotels = [
  {
    id: 1,
    name: "北京王府井大酒店",
    address: "北京市东城区王府井大街",
    price: 580,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop"],
    city: "北京",
    facilities: ["免费WiFi", "停车场", "餐厅", "健身房", "游泳池", "会议室"],
    starRating: 4,
    distance: 2.5,
    description: "位于北京市中心王府井商业区，交通便利，设施齐全。",
    phone: "010-12345678",
    roomTypes: [{
      id: 1,
      name: "豪华大床房",
      description: "宽敞舒适的豪华大床房，配备现代化设施",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["湖景", "浴缸", "禁烟"],
      price: 580,
      originalPrice: 680,
      area: "30㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "行政双床房",
      description: "适合商务旅行的行政双床房",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
      tags: ["城市景观", "办公桌", "免费WiFi"],
      price: 650,
      originalPrice: 750,
      area: "35㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 3,
      name: "套房",
      description: "豪华套房，配备独立客厅和卧室",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop",
      tags: ["湖景", "浴缸", "客厅", "迷你吧"],
      price: 980,
      originalPrice: 1200,
      area: "60㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }]
  },
  {
    id: 2,
    name: "上海外滩华尔道夫酒店",
    address: "上海市黄浦区中山东一路",
    price: 1200,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop"],
    city: "上海",
    facilities: ["免费WiFi", "游泳池", "水疗中心", "餐厅", "行政酒廊", "商务中心"],
    starRating: 5,
    distance: 3.1,
    description: "位于上海外滩的豪华酒店，拥有绝佳的江景和顶级服务。",
    phone: "021-12345678",
    roomTypes: [{
      id: 1,
      name: "豪华江景房",
      description: "宽敞的江景房，配备现代化设施",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
      tags: ["江景", "浴缸", "免费WiFi"],
      price: 1200,
      originalPrice: 1500,
      area: "45㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "行政套房",
      description: "豪华行政套房，配备独立客厅",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["江景", "浴缸", "客厅", "迷你吧"],
      price: 1800,
      originalPrice: 2200,
      area: "80㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 3,
    name: "广州白云宾馆",
    address: "广州市越秀区环市东路",
    price: 420,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "广州",
    facilities: ["免费WiFi", "停车场", "会议室", "餐厅", "商务中心"],
    starRating: 3,
    distance: 1.8,
    description: "位于广州市中心的商务酒店，交通便利。",
    phone: "020-12345678",
    roomTypes: [{
      id: 1,
      name: "标准双床房",
      description: "舒适的标准双床房，适合商务旅行",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop",
      tags: ["城市景观", "办公桌", "免费WiFi"],
      price: 420,
      originalPrice: 500,
      area: "25㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "豪华大床房",
      description: "宽敞的豪华大床房，配备舒适床品",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 550,
      originalPrice: 650,
      area: "30㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 4,
    name: "深圳香格里拉大酒店",
    address: "深圳市罗湖区建设路",
    price: 880,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "深圳",
    facilities: ["免费WiFi", "游泳池", "健身房", "餐厅", "水疗中心", "商务中心"],
    starRating: 4,
    distance: 4.2,
    description: "深圳罗湖区的豪华酒店，设施齐全，服务一流。",
    phone: "0755-12345678",
    roomTypes: [{
      id: 1,
      name: "豪华城景房",
      description: "城市景观豪华房，视野开阔",
      image: "https://images.unsplash.com/photo-1564501049418-3c27787d01e8?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 880,
      originalPrice: 1e3,
      area: "35㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "行政套房",
      description: "豪华行政套房，配备独立工作区",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "客厅", "办公桌"],
      price: 1200,
      originalPrice: 1500,
      area: "60㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 5,
    name: "杭州西湖国宾馆",
    address: "杭州市西湖区杨公堤",
    price: 680,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "杭州",
    facilities: ["免费WiFi", "停车场", "餐厅", "花园", "游泳池", "会议室"],
    starRating: 4,
    distance: 5.5,
    description: "位于西湖边的国宾馆，环境优美，风景如画。",
    phone: "0571-12345678",
    roomTypes: [{
      id: 1,
      name: "湖景大床房",
      description: "西湖湖景房，视野绝佳",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop",
      tags: ["湖景", "浴缸", "阳台", "免费WiFi"],
      price: 680,
      originalPrice: 800,
      area: "40㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "花园套房",
      description: "带私人花园的套房，环境幽静",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["花园景观", "浴缸", "客厅", "阳台"],
      price: 980,
      originalPrice: 1200,
      area: "70㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 6,
    name: "成都锦江宾馆",
    address: "成都市锦江区人民南路",
    price: 520,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "成都",
    facilities: ["免费WiFi", "停车场", "餐厅", "会议室", "商务中心"],
    starRating: 3,
    distance: 2.1,
    description: "成都市中心的老牌酒店，地理位置优越。",
    phone: "028-12345678",
    roomTypes: [{
      id: 1,
      name: "标准大床房",
      description: "舒适的标准大床房，配备基本设施",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop",
      tags: ["城市景观", "办公桌", "免费WiFi"],
      price: 520,
      originalPrice: 600,
      area: "28㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "豪华双床房",
      description: "宽敞的豪华双床房，适合家庭出行",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 650,
      originalPrice: 750,
      area: "35㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 7,
    name: "西安钟楼饭店",
    address: "西安市碑林区南大街",
    price: 380,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "西安",
    facilities: ["免费WiFi", "停车场", "餐厅", "会议室"],
    starRating: 3,
    distance: 3.8,
    description: "位于西安钟楼附近的酒店，交通便利。",
    phone: "029-12345678",
    roomTypes: [{
      id: 1,
      name: "经济大床房",
      description: "经济实惠的大床房，适合预算有限的旅客",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
      tags: ["城市景观", "免费WiFi"],
      price: 380,
      originalPrice: 450,
      area: "22㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "标准双床房",
      description: "标准双床房，配备基本设施",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["城市景观", "办公桌", "免费WiFi"],
      price: 450,
      originalPrice: 550,
      area: "25㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 8,
    brand: "易宿",
    name: "三亚亚龙湾度假酒店",
    address: "三亚市亚龙湾国家旅游度假区",
    price: 980,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop"],
    city: "三亚",
    facilities: ["免费WiFi", "游泳池", "私人海滩", "水疗中心", "餐厅", "健身房", "儿童乐园"],
    starRating: 5,
    distance: 12.5,
    description: "三亚亚龙湾的豪华度假酒店，拥有私人海滩和丰富的水上活动。",
    phone: "0898-12345678",
    roomTypes: [{
      id: 1,
      name: "海景大床房",
      description: "海景大床房，直面亚龙湾海景",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop",
      tags: ["海景", "浴缸", "阳台", "免费WiFi"],
      price: 980,
      originalPrice: 1200,
      area: "45㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }, {
      id: 2,
      name: "豪华海景套房",
      description: "豪华海景套房，配备独立客厅和阳台",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["海景", "浴缸", "客厅", "阳台", "迷你吧"],
      price: 1500,
      originalPrice: 1800,
      area: "80㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }, {
      id: 3,
      name: "家庭套房",
      description: "适合家庭出游的套房，配备儿童设施",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
      tags: ["海景", "浴缸", "客厅", "儿童床"],
      price: 1200,
      originalPrice: 1500,
      area: "70㎡",
      bedType: "大床+儿童床",
      maxOccupancy: 4,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 9,
    name: "南京金陵饭店",
    address: "南京市鼓楼区汉中路",
    price: 450,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "南京",
    facilities: ["免费WiFi", "停车场", "餐厅", "健身房", "会议室"],
    starRating: 4,
    distance: 2.9,
    description: "南京市中心的老牌酒店，地理位置优越。",
    phone: "025-12345678",
    roomTypes: [{
      id: 1,
      name: "标准大床房",
      description: "舒适的标准大床房，配备现代化设施",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&auto=format&fit=crop",
      tags: ["城市景观", "办公桌", "免费WiFi"],
      price: 450,
      originalPrice: 550,
      area: "28㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "豪华双床房",
      description: "宽敞的豪华双床房，适合商务旅行",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 580,
      originalPrice: 680,
      area: "35㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 10,
    name: "武汉光谷凯悦酒店",
    address: "武汉市洪山区珞喻路",
    price: 620,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop", "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "武汉",
    facilities: ["免费WiFi", "游泳池", "健身房", "餐厅", "会议室", "商务中心"],
    starRating: 4,
    distance: 4.7,
    description: "武汉光谷地区的豪华酒店，适合商务和休闲旅客。",
    phone: "027-12345678",
    roomTypes: [{
      id: 1,
      name: "豪华大床房",
      description: "豪华大床房，配备现代化设施",
      image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 620,
      originalPrice: 750,
      area: "35㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "行政套房",
      description: "行政套房，配备独立工作区和客厅",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "客厅", "办公桌"],
      price: 850,
      originalPrice: 1e3,
      area: "60㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }]
  },
  // 新增北京酒店
  {
    id: 11,
    brand: "易宿",
    name: "北京国贸大酒店",
    address: "北京市朝阳区建国门外大街",
    price: 850,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "游泳池", "健身房", "水疗中心", "餐厅", "会议室"],
    starRating: 5,
    distance: 3.2,
    roomTypes: [{
      id: 1,
      name: "商务大床房",
      description: "位于高层楼层，适合商务出行，配备办公桌",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop",
      tags: ["城市景观", "办公桌", "免费WiFi"],
      price: 850,
      originalPrice: 980,
      area: "32㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "行政套房",
      description: "享有行政酒廊礼遇，配备独立客厅和工作区",
      image: "https://images.unsplash.com/photo-1521783593447-5702f2c0c8f2?w=800&auto=format&fit=crop",
      tags: ["城市景观", "客厅", "迷你吧"],
      price: 1180,
      originalPrice: 1380,
      area: "60㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }]
  },
  {
    id: 12,
    name: "北京希尔顿酒店",
    address: "北京市东城区王府井大街",
    price: 720,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "停车场", "健身房", "餐厅", "商务中心"],
    starRating: 4,
    distance: 2.8,
    roomTypes: [{
      id: 1,
      name: "高级大床房",
      description: "温馨舒适的大床房，临近王府井商业区",
      image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?w=800&auto=format&fit=crop",
      tags: ["城市景观", "禁烟", "免费WiFi"],
      price: 720,
      originalPrice: 820,
      area: "28㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "豪华双床房",
      description: "配备两张单人床，适合家庭或朋友出行",
      image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop",
      tags: ["城市景观", "双床", "免费WiFi"],
      price: 780,
      originalPrice: 880,
      area: "30㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 13,
    name: "北京香格里拉饭店",
    address: "北京市海淀区紫竹院路",
    price: 680,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "游泳池", "健身房", "水疗中心", "餐厅"],
    starRating: 5,
    distance: 5.1,
    roomTypes: [{
      id: 1,
      name: "园景大床房",
      description: "可俯瞰紫竹院公园景观，环境安静",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop",
      tags: ["园景", "浴缸", "免费WiFi"],
      price: 680,
      originalPrice: 880,
      area: "36㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "行政楼层房",
      description: "享行政楼层礼遇，含双早与下午茶",
      image: "https://images.unsplash.com/photo-1519710884009-4803fa4edc6d?w=800&auto=format&fit=crop",
      tags: ["园景", "行政酒廊", "免费WiFi"],
      price: 880,
      originalPrice: 1080,
      area: "38㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 14,
    name: "北京长城饭店",
    address: "北京市朝阳区东三环北路",
    price: 550,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "停车场", "餐厅", "会议室"],
    starRating: 4,
    distance: 4.5,
    roomTypes: [{
      id: 1,
      name: "标准双床房",
      description: "经典双床房，性价比高，适合会展出行",
      image: "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800&auto=format&fit=crop",
      tags: ["城市景观", "双床", "免费WiFi"],
      price: 550,
      originalPrice: 650,
      area: "26㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "豪华大床房",
      description: "面向东三环景观，房间空间更大",
      image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?w=800&auto=format&fit=crop",
      tags: ["城市景观", "大床", "免费WiFi"],
      price: 620,
      originalPrice: 720,
      area: "30㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 15,
    name: "北京金融街威斯汀大酒店",
    address: "北京市西城区金融大街",
    price: 780,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "游泳池", "健身房", "水疗中心", "餐厅", "商务中心"],
    starRating: 5,
    distance: 3.7,
    roomTypes: [{
      id: 1,
      name: "金融街景观房",
      description: "可俯瞰金融街城市景观，安静舒适",
      image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 780,
      originalPrice: 980,
      area: "34㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "行政套房",
      description: "适合高端商务客户，含行政酒廊权益",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop",
      tags: ["行政酒廊", "客厅", "迷你吧"],
      price: 1180,
      originalPrice: 1480,
      area: "65㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 16,
    name: "北京丽思卡尔顿酒店",
    address: "北京市朝阳区建国路",
    price: 950,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "游泳池", "健身房", "水疗中心", "餐厅", "行政酒廊"],
    starRating: 5,
    distance: 2.9,
    roomTypes: [{
      id: 1,
      name: "豪华城景房",
      description: "位于高层，可俯瞰国贸核心区夜景",
      image: "https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 950,
      originalPrice: 1180,
      area: "40㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }, {
      id: 2,
      name: "豪华套房",
      description: "一室一厅布局，适合长住与商务会客",
      image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a?w=800&auto=format&fit=crop",
      tags: ["客厅", "浴缸", "行政酒廊"],
      price: 1380,
      originalPrice: 1680,
      area: "70㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 17,
    name: "北京昆仑饭店",
    address: "北京市朝阳区新源南路",
    price: 620,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "停车场", "健身房", "餐厅", "会议室"],
    starRating: 4,
    distance: 4.8,
    roomTypes: [{
      id: 1,
      name: "标准大床房",
      description: "靠近使馆区，适合商务与旅游出行",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
      tags: ["城市景观", "大床", "免费WiFi"],
      price: 620,
      originalPrice: 720,
      area: "27㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "豪华双床房",
      description: "空间更大，配备两张单人床",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop",
      tags: ["城市景观", "双床", "免费WiFi"],
      price: 680,
      originalPrice: 820,
      area: "30㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 18,
    name: "北京国际艺苑皇冠假日酒店",
    address: "北京市东城区王府井大街",
    price: 580,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "健身房", "餐厅", "商务中心"],
    starRating: 4,
    distance: 2.3,
    roomTypes: [{
      id: 1,
      name: "经典大床房",
      description: "靠近王府井步行街，出行便捷",
      image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop",
      tags: ["城市景观", "禁烟", "免费WiFi"],
      price: 580,
      originalPrice: 680,
      area: "24㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: false,
      cancellationPolicy: "入住前24小时可免费取消"
    }, {
      id: 2,
      name: "舒适双床房",
      description: "适合朋友结伴出行，含双早",
      image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&auto=format&fit=crop",
      tags: ["城市景观", "双床", "免费WiFi"],
      price: 630,
      originalPrice: 730,
      area: "26㎡",
      bedType: "双床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前24小时可免费取消"
    }]
  },
  {
    id: 19,
    name: "北京金茂威斯汀大饭店",
    address: "北京市朝阳区东三环北路",
    price: 750,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "游泳池", "健身房", "水疗中心", "餐厅"],
    starRating: 5,
    distance: 3.5,
    roomTypes: [{
      id: 1,
      name: "豪华大床房",
      description: "位于中高层，采光好，配备浴缸",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 750,
      originalPrice: 880,
      area: "36㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "行政景观房",
      description: "观景更佳，含行政酒廊与晚间鸡尾酒",
      image: "https://images.unsplash.com/photo-1519710884009-4803fa4edc6d?w=800&auto=format&fit=crop",
      tags: ["行政酒廊", "城市景观", "免费WiFi"],
      price: 920,
      originalPrice: 1120,
      area: "38㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  {
    id: 20,
    name: "北京柏悦酒店",
    address: "北京市朝阳区建国门外大街",
    price: 880,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
    city: "北京",
    facilities: ["免费WiFi", "游泳池", "健身房", "水疗中心", "餐厅", "行政酒廊"],
    starRating: 5,
    distance: 3,
    roomTypes: [{
      id: 1,
      name: "柏悦大床房",
      description: "现代设计风格客房，采光充足",
      image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop",
      tags: ["城市景观", "浴缸", "免费WiFi"],
      price: 880,
      originalPrice: 1080,
      area: "38㎡",
      bedType: "大床",
      maxOccupancy: 2,
      breakfastIncluded: true,
      cancellationPolicy: "入住前48小时可免费取消"
    }, {
      id: 2,
      name: "柏悦套房",
      description: "一房一厅布局，提供更宽敞的起居空间",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop",
      tags: ["客厅", "浴缸", "行政酒廊"],
      price: 1380,
      originalPrice: 1680,
      area: "72㎡",
      bedType: "大床",
      maxOccupancy: 3,
      breakfastIncluded: true,
      cancellationPolicy: "入住前72小时可免费取消"
    }]
  },
  // 爱住品牌示例酒店
  {
    id: 21,
    brand: "爱住",
    name: "爱住精选酒店（北京国贸店）",
    address: "北京市朝阳区建国门外大街 12 号",
    price: 630,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop"],
    city: "北京",
    facilities: ["免费WiFi", "停车场", "餐厅", "健身房"],
    starRating: 4,
    distance: 3.2,
    description: "爱住品牌北京商务旗舰店，紧邻国贸商圈与地铁枢纽。",
    phone: "010-88880001"
  },
  {
    id: 22,
    brand: "爱住",
    name: "爱住城市酒店（上海外滩店）",
    address: "上海市黄浦区外滩中山东一路 66 号",
    price: 720,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop"],
    city: "上海",
    facilities: ["免费WiFi", "江景房", "餐厅", "商务中心"],
    starRating: 4,
    distance: 2.1,
    description: "坐拥外滩夜景的爱住品牌城市酒店，适合商务与度假。",
    phone: "021-88880002"
  },
  {
    id: 23,
    brand: "爱住",
    name: "爱住轻居（广州珠江新城店）",
    address: "广州市天河区珠江新城华夏路 9 号",
    price: 480,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop"],
    city: "广州",
    facilities: ["免费WiFi", "停车场", "自助洗衣", "简餐吧"],
    starRating: 3,
    distance: 2.4,
    description: "主打年轻客群的爱住轻居品牌店，步行可达珠江新城核心区。",
    phone: "020-88880003"
  },
  {
    id: 24,
    brand: "爱住",
    name: "爱住度假酒店（成都青城山店）",
    address: "成都市都江堰市青城山风景区旁",
    price: 560,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop"],
    city: "成都",
    facilities: ["免费WiFi", "温泉", "花园", "餐厅"],
    starRating: 4,
    distance: 10.5,
    description: "依山傍水的爱住度假酒店，提供温泉与花园景观客房。",
    phone: "028-88880004"
  },
  {
    id: 25,
    brand: "爱住",
    name: "爱住海景酒店（三亚湾店）",
    address: "三亚市三亚湾海滨路 188 号",
    price: 920,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop"],
    city: "三亚",
    facilities: ["免费WiFi", "私人海滩", "游泳池", "儿童乐园"],
    starRating: 5,
    distance: 8.8,
    description: "面朝大海的爱住品牌海景酒店，适合亲子与情侣度假。",
    phone: "0898-88880005"
  }
];
const getHotels$1 = (..._0) => __async(exports, [..._0], function* (params = {}) {
  yield new Promise((resolve) => setTimeout(resolve, 300));
  let filteredHotels = [...mockHotels];
  if (params.city) {
    filteredHotels = filteredHotels.filter((hotel) => hotel.city === params.city);
  }
  if (params.minPrice !== void 0) {
    filteredHotels = filteredHotels.filter((hotel) => hotel.price >= params.minPrice);
  }
  if (params.maxPrice !== void 0) {
    filteredHotels = filteredHotels.filter((hotel) => hotel.price <= params.maxPrice);
  }
  if (params.starRating && params.starRating.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) => hotel.starRating && params.starRating.includes(hotel.starRating));
  }
  if (params.sort) {
    switch (params.sort) {
      case "price_asc":
        filteredHotels.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredHotels.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        filteredHotels.sort((a, b) => b.rating - a.rating);
        break;
      case "star_high":
        filteredHotels.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
        break;
      case "distance_asc":
        filteredHotels.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case "recommend":
      default:
        filteredHotels.sort((a, b) => {
          const scoreA = a.rating * 20 - a.price / 50;
          const scoreB = b.rating * 20 - b.price / 50;
          return scoreB - scoreA;
        });
        break;
    }
  }
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  return filteredHotels.slice(start, end);
});
const getHotel$1 = (id) => __async(exports, null, function* () {
  yield new Promise((resolve) => setTimeout(resolve, 200));
  const hotel = mockHotels.find((h) => h.id === id);
  return hotel || null;
});
const API_BASE_URL = "http://localhost:3001";
const request = (options) => {
  return new Promise((resolve, reject) => {
    taro.Taro.request(__spreadProps(__spreadValues({}, options), {
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.errMsg}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    }));
  });
};
const buildQueryString = (params) => {
  const parts = [];
  for (const key in params) {
    if (params[key] !== void 0 && params[key] !== null && params[key] !== "") {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }
  return parts.length > 0 ? "?" + parts.join("&") : "";
};
function fetchHotelsFromApi() {
  return __async(this, arguments, function* (params = {}) {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_BASE_URL}/api/public/hotels${queryString}`;
      const data = yield request({
        url
      });
      if (data.success) {
        return data.hotels || [];
      }
      return [];
    } catch (error) {
      console.error("获取酒店列表失败:", error);
      return [];
    }
  });
}
function fetchHotelDetailFromApi(id) {
  return __async(this, null, function* () {
    try {
      const data = yield request({
        url: `${API_BASE_URL}/api/public/hotels/${id}`
      });
      if (data.success) {
        return data.hotel;
      }
      return null;
    } catch (error) {
      console.error("获取酒店详情失败:", error);
      return null;
    }
  });
}
function adaptHotelFromPC(pcHotel) {
  if (!pcHotel)
    return null;
  let starRating = 3;
  if (pcHotel.starLevel) {
    const starMatch = pcHotel.starLevel.match(/(\d+)/);
    if (starMatch) {
      starRating = parseInt(starMatch[1], 10);
    }
  }
  let roomTypes = [];
  if (pcHotel.roomTypes && Array.isArray(pcHotel.roomTypes)) {
    roomTypes = pcHotel.roomTypes.map(adaptRoomTypeFromPC);
  }
  const facilities = [];
  if (pcHotel.nearbyHighlights) {
    const keywords = ["地铁", "公交", "商圈", "景区", "火车站", "机场"];
    keywords.forEach((kw) => {
      if (pcHotel.nearbyHighlights.includes(kw)) {
        facilities.push(kw + "附近");
      }
    });
  }
  if (!facilities.includes("WiFi"))
    facilities.push("免费WiFi");
  return {
    id: pcHotel.id,
    name: pcHotel.name || "",
    address: pcHotel.address || "",
    price: pcHotel.price || 0,
    rating: 4,
    // 默认评分，新酒店暂无评分
    image: pcHotel.image || "https://via.placeholder.com/800x400?text=Hotel",
    images: pcHotel.images || [pcHotel.image || "https://via.placeholder.com/800x400?text=Hotel"],
    city: pcHotel.city || "",
    facilities,
    starRating,
    distance: Math.round(Math.random() * 10 * 10) / 10,
    // 模拟距离数据
    roomTypes,
    description: pcHotel.nearbyHighlights || pcHotel.promotionInfo || "",
    phone: pcHotel.phone || ""
  };
}
function adaptRoomTypeFromPC(pcRoomType) {
  var _a;
  if (!pcRoomType)
    return null;
  return {
    id: pcRoomType.id,
    name: pcRoomType.name || "",
    description: pcRoomType.description || "",
    image: pcRoomType.image || ((_a = pcRoomType.images) == null ? void 0 : _a[0]) || "https://via.placeholder.com/400x300?text=Room",
    tags: pcRoomType.tags || [],
    price: pcRoomType.price || 0,
    originalPrice: pcRoomType.originalPrice,
    area: pcRoomType.area,
    bedType: pcRoomType.bedType,
    maxOccupancy: pcRoomType.maxOccupancy || 2,
    breakfastIncluded: pcRoomType.breakfastIncluded || false,
    cancellationPolicy: pcRoomType.cancellationPolicy || ""
  };
}
function getMockHotelImage(hotelId) {
  const images = ["https://picsum.photos/seed/hotel1/800/400", "https://picsum.photos/seed/hotel2/800/400", "https://picsum.photos/seed/hotel3/800/400", "https://picsum.photos/seed/hotel4/800/400"];
  return images[hotelId % images.length];
}
const RETRYABLE_ERRORS = ["NETWORK_ERROR", "NETWORK_TIMEOUT", "request:fail", "request:fail -1", "ETIMEDOUT", "ECONNREFUSED", "ENOTFOUND", "socket timeout", "timeout"];
const isRetryableError = (error) => {
  if (!error)
    return false;
  const errorStr = JSON.stringify(error).toLowerCase();
  return RETRYABLE_ERRORS.some((code) => errorStr.includes(code.toLowerCase()));
};
const requestWithRetry = (_0, ..._1) => __async(exports, [_0, ..._1], function* (requestFn, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1e3,
    backoffMultiplier = 2,
    onRetry,
    retryCondition
  } = options;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return yield requestFn();
    } catch (error) {
      lastError = error;
      const shouldRetry = retryCondition ? retryCondition(error) : isRetryableError(error);
      if (attempt >= maxRetries || !shouldRetry) {
        console.error(`[Retry] 请求失败，已重试 ${attempt} 次:`, error);
        throw error;
      }
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      console.log(`[Retry] 请求失败，${attempt + 1} 秒后重试...`, error);
      if (onRetry) {
        onRetry(attempt + 1, error);
      }
      yield new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
});
const HOTEL_LIST_CACHE_TTL = 3 * 60 * 1e3;
const HOTEL_DETAIL_CACHE_TTL = 10 * 60 * 1e3;
const getCacheKey = (prefix, params) => {
  const _a = params, {
    page,
    limit
  } = _a, filterParams = __objRest(_a, [
    "page",
    "limit"
  ]);
  const paramsStr = JSON.stringify(filterParams);
  return `cache_${prefix}_${paramsStr}`;
};
const getFromCache = (key) => {
  try {
    const cacheData = taro.Taro.getStorageSync(key);
    if (!cacheData)
      return null;
    const {
      data,
      expiry
    } = cacheData;
    if (expiry && Date.now() > expiry) {
      taro.Taro.removeStorageSync(key);
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
};
const setToCache = (key, data, ttl) => {
  try {
    const expiry = Date.now() + ttl;
    taro.Taro.setStorageSync(key, {
      data,
      expiry
    });
  } catch (error) {
  }
};
function getHotels() {
  return __async(this, arguments, function* (params = {}, useCache = true) {
    const cacheKey = getCacheKey("hotels", params);
    if (useCache) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        console.log("[Cache HIT] hotel list", params);
        return cachedData;
      }
    }
    let hotels = [];
    {
      try {
        const pcHotels = yield requestWithRetry(() => fetchHotelsFromApi(params), {
          maxRetries: 2,
          retryDelay: 1e3,
          onRetry: (attempt) => console.log(`[Retry] 获取酒店列表，第 ${attempt} 次重试...`)
        });
        if (pcHotels && pcHotels.length > 0) {
          hotels = pcHotels.map((hotel, index2) => {
            var _a;
            return __spreadProps(__spreadValues({}, adaptHotelFromPC(hotel)), {
              image: hotel.image || getMockHotelImage(hotel.id || index2),
              images: ((_a = hotel.images) == null ? void 0 : _a.length) > 0 ? hotel.images : [hotel.image || getMockHotelImage(hotel.id || index2)]
            });
          });
        } else {
          console.log("后端API返回空数据，使用本地模拟数据");
          hotels = yield getHotels$1(params);
        }
      } catch (error) {
        console.error("调用后端API失败，回退到本地模拟数据:", error);
        hotels = yield getHotels$1(params);
      }
    }
    if (useCache && hotels.length > 0) {
      setToCache(cacheKey, hotels, HOTEL_LIST_CACHE_TTL);
    }
    return hotels;
  });
}
function getHotel(id, useCache = true) {
  return __async(this, null, function* () {
    var _a;
    const cacheKey = getCacheKey(`hotel_${id}`, {});
    if (useCache) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        console.log("[Cache HIT] hotel detail", id);
        return cachedData;
      }
    }
    let hotel = null;
    {
      try {
        const pcHotel = yield requestWithRetry(() => fetchHotelDetailFromApi(id), {
          maxRetries: 2,
          retryDelay: 1e3,
          onRetry: (attempt) => console.log(`[Retry] 获取酒店详情，第 ${attempt} 次重试...`)
        });
        if (pcHotel) {
          hotel = __spreadProps(__spreadValues({}, adaptHotelFromPC(pcHotel)), {
            image: pcHotel.image || getMockHotelImage(pcHotel.id),
            images: ((_a = pcHotel.images) == null ? void 0 : _a.length) > 0 ? pcHotel.images : [pcHotel.image || getMockHotelImage(pcHotel.id)]
          });
        } else {
          console.log("后端API返回空数据，尝试本地模拟数据");
          hotel = yield getHotel$1(id);
        }
      } catch (error) {
        console.error("调用后端API失败，回退到本地模拟数据:", error);
        hotel = yield getHotel$1(id);
      }
    }
    if (useCache && hotel) {
      setToCache(cacheKey, hotel, HOTEL_DETAIL_CACHE_TTL);
    }
    return hotel;
  });
}
const index = "";
const HOLIDAYS = {
  "2026-02-17": "除夕",
  "2026-02-18": "春节",
  "2026-02-19": "春节",
  "2026-02-20": "春节",
  "2026-02-21": "春节",
  "2026-02-22": "春节",
  "2026-03-08": "妇女节",
  "2026-04-04": "清明",
  "2026-05-01": "劳动节",
  "2026-06-01": "儿童节",
  "2026-10-01": "国庆节",
  "2026-10-02": "国庆节",
  "2026-10-03": "国庆节",
  "2026-10-04": "国庆节",
  "2026-10-05": "国庆节",
  "2026-10-06": "国庆节",
  "2026-10-07": "国庆节"
};
const WORKDAY_ADJUSTMENTS = {
  "2026-02-15": "班",
  // 调休上班
  "2026-02-16": "班",
  // 调休上班
  "2026-02-23": "休",
  // 调休休息
  "2026-02-24": "休"
  // 调休休息
};
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month - 1, 1).getDay();
};
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};
const isDateInRange = (date, startDate, endDate) => {
  if (!startDate || !endDate)
    return false;
  return date >= startDate && date <= endDate;
};
const getDayLabel = (date) => {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, today))
    return "今天";
  if (isSameDay(date, tomorrow))
    return "明天";
  return "";
};
const Calendar = ({
  mode,
  value,
  onChange,
  visible,
  onClose,
  minDate,
  maxDate
}) => {
  const [selectedStartDate, setSelectedStartDate] = taro.useState(null);
  const [selectedEndDate, setSelectedEndDate] = taro.useState(null);
  const [selectedSingleDate, setSelectedSingleDate] = taro.useState(null);
  const [currentMonth, setCurrentMonth] = taro.useState((/* @__PURE__ */ new Date()).getMonth() + 1);
  const [currentYear, setCurrentYear] = taro.useState((/* @__PURE__ */ new Date()).getFullYear());
  taro.useEffect(() => {
    if (mode === "range" && Array.isArray(value)) {
      const [startStr, endStr] = value;
      if (startStr)
        setSelectedStartDate(parseDate(startStr));
      if (endStr)
        setSelectedEndDate(parseDate(endStr));
    } else if (mode === "single" && typeof value === "string") {
      setSelectedSingleDate(parseDate(value));
    }
  }, [mode, value]);
  taro.useEffect(() => {
    if (mode === "range") {
      setSelectedSingleDate(null);
    } else if (mode === "single") {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
    }
  }, [mode]);
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const days = taro.useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth - 1, i);
      daysArray.push(date);
    }
    return daysArray;
  }, [currentYear, currentMonth]);
  const handleDateClick = (date) => {
    if (mode === "range") {
      if (!selectedStartDate || selectedStartDate && selectedEndDate) {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else if (selectedStartDate && !selectedEndDate) {
        let startDate = selectedStartDate;
        let endDate = date;
        if (date < selectedStartDate) {
          startDate = date;
          endDate = selectedStartDate;
          setSelectedStartDate(date);
          setSelectedEndDate(selectedStartDate);
        } else {
          setSelectedEndDate(date);
        }
        if (onChange) {
          onChange([formatDate(startDate), formatDate(endDate)]);
        }
      }
    } else {
      setSelectedSingleDate(date);
      if (onChange) {
        onChange(formatDate(date));
      }
    }
  };
  const getDateState = (date) => {
    const dateStr = formatDate(date);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = isSameDay(date, today);
    const isSelected = mode === "single" ? selectedSingleDate && isSameDay(date, selectedSingleDate) : selectedStartDate && isSameDay(date, selectedStartDate) || selectedEndDate && isSameDay(date, selectedEndDate);
    const isInRange = mode === "range" && isDateInRange(date, selectedStartDate, selectedEndDate);
    const isStart = selectedStartDate && isSameDay(date, selectedStartDate);
    const isEnd = selectedEndDate && isSameDay(date, selectedEndDate);
    const holiday = HOLIDAYS[dateStr];
    const workdayAdjustment = WORKDAY_ADJUSTMENTS[dateStr];
    const dayLabel = getDayLabel(date);
    return {
      isToday,
      isSelected,
      isInRange,
      isStart,
      isEnd,
      holiday,
      workdayAdjustment,
      dayLabel
    };
  };
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  if (!visible)
    return null;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "calendar-modal-mask", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-modal-overlay", onClick: onClose }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "calendar-modal-panel", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "calendar-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "calendar-title", children: "选择日期" }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-close", onClick: onClose, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "calendar-month-nav", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-nav-button", onClick: goToPreviousMonth, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "‹" }) }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "calendar-month-title", children: [
          currentYear,
          "年",
          currentMonth,
          "月"
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-nav-button", onClick: goToNextMonth, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "›" }) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-week-header", children: weekDays.map(
        (day, index2) => /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-week-day", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: `week-day-text ${index2 === 0 || index2 === 6 ? "weekend" : ""}`, children: day }) }, index2)
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.ScrollView, { className: "calendar-scroll", scrollY: true, children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-grid", children: days.map((date, index2) => {
          if (!date) {
            return /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-day empty" }, index2);
          }
          const {
            isToday,
            isSelected,
            isInRange,
            isStart,
            isEnd,
            holiday,
            workdayAdjustment,
            dayLabel
          } = getDateState(date);
          const day = date.getDate();
          formatDate(date);
          return /* @__PURE__ */ taro.jsx(
            taro.View,
            {
              className: `calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isInRange ? "in-range" : ""} ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`,
              onClick: () => handleDateClick(date),
              children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "day-content", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "day-number", children: day }),
                dayLabel && /* @__PURE__ */ taro.jsx(taro.Text, { className: "day-label", children: dayLabel }),
                holiday && /* @__PURE__ */ taro.jsx(taro.Text, { className: "holiday-label", children: holiday }),
                workdayAdjustment && /* @__PURE__ */ taro.jsx(taro.Text, { className: "workday-adjustment", children: workdayAdjustment }),
                isStart && mode === "range" && /* @__PURE__ */ taro.jsx(taro.Text, { className: "range-label", children: "入住" }),
                isEnd && mode === "range" && /* @__PURE__ */ taro.jsx(taro.Text, { className: "range-label", children: "离店" })
              ] })
            },
            index2
          );
        }) }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "next-month-preview", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "next-month-title", children: currentMonth === 12 ? `${currentYear + 1}年1月` : `${currentYear}年${currentMonth + 1}月` }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "next-month-hint", children: "继续滑动查看更多日期" })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "calendar-actions", children: [
        /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-button clear-button", onClick: () => {
          if (mode === "range") {
            setSelectedStartDate(null);
            setSelectedEndDate(null);
          } else {
            setSelectedSingleDate(null);
          }
        }, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "清除" }) }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "calendar-button confirm-button", onClick: onClose, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "确定" }) })
      ] })
    ] })
  ] });
};
exports.Calendar = Calendar;
exports.getHotel = getHotel;
exports.getHotels = getHotels;
//# sourceMappingURL=common.js.map
