/**
 * 统一API服务 - 智能切换后端API和本地模拟数据
 *
 * 开发模式：优先调用PC端mock server
 * 回退模式：如果调用失败，使用本地模拟数据
 */

import Taro from '@tarojs/taro';
import { getHotels as getMockHotels, getHotel as getMockHotel, getCities as getMockCities, Hotel } from '../../../shared/api';
import { fetchHotelsFromApi, fetchHotelDetailFromApi, fetchRoomTypesFromApi } from './api';
import { adaptHotelFromPC, adaptRoomTypeFromPC, getMockHotelImage, getMockRoomImage } from './adapter';
import { requestWithRetry } from '../utils/retry';

// 配置：是否使用后端API
// 现在改为默认启用 PC 端 Mock Server，这样移动端与 PC 端共用一份酒店数据（包括"易宿 / 爱住"等）。
// 如需临时只看本地模拟数据，可将该值改回 false。
const USE_BACKEND_API = true;

// 缓存配置
const HOTEL_LIST_CACHE_TTL = 3 * 60 * 1000; // 酒店列表缓存 3 分钟
const HOTEL_DETAIL_CACHE_TTL = 10 * 60 * 1000; // 酒店详情缓存 10 分钟

/**
 * 生成缓存 key（排除分页参数，只缓存筛选条件）
 */
const getCacheKey = (prefix, params) => {
  // 过滤掉分页参数，只缓存筛选条件
  const { page, limit, ...filterParams } = params;
  const paramsStr = JSON.stringify(filterParams);
  return `cache_${prefix}_${paramsStr}`;
};

/**
 * 从缓存获取数据
 */
const getFromCache = (key) => {
  try {
    const cacheData = Taro.getStorageSync(key);
    if (!cacheData) return null;
    const { data, expiry } = cacheData;
    if (expiry && Date.now() > expiry) {
      Taro.removeStorageSync(key);
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
};

/**
 * 存入缓存
 */
const setToCache = (key, data, ttl) => {
  try {
    const expiry = Date.now() + ttl;
    Taro.setStorageSync(key, { data, expiry });
  } catch (error) {
    // 忽略缓存错误
  }
};

/**
 * 获取酒店列表（统一入口）
 * @param {Object} params - 查询参数
 * @param {boolean} useCache - 是否使用缓存，默认 true
 * @returns {Promise<Hotel[]>}
 */
export async function getHotels(params = {}, useCache = true) {
  // 生成缓存 key
  const cacheKey = getCacheKey('hotels', params);

  // 尝试从缓存获取
  if (useCache) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log('[Cache HIT] hotel list', params);
      return cachedData;
    }
  }

  let hotels = [];

  if (USE_BACKEND_API) {
    try {
      // 调用PC端API（带重试）
      const pcHotels = await requestWithRetry(
        () => fetchHotelsFromApi(params),
        {
          maxRetries: 2,
          retryDelay: 1000,
          onRetry: (attempt) => console.log(`[Retry] 获取酒店列表，第 ${attempt} 次重试...`)
        }
      );

      if (pcHotels && pcHotels.length > 0) {
        // 转换为移动端格式并添加默认图片
        hotels = pcHotels.map((hotel, index) => ({
          ...adaptHotelFromPC(hotel),
          image: hotel.image || getMockHotelImage(hotel.id || index),
          images: hotel.images?.length > 0 ? hotel.images : [hotel.image || getMockHotelImage(hotel.id || index)]
        }));
      } else {
        // 如果API返回空数据，尝试使用本地模拟数据
        console.log('后端API返回空数据，使用本地模拟数据');
        hotels = await getMockHotels(params);
      }
    } catch (error) {
      console.error('调用后端API失败，回退到本地模拟数据:', error);
      hotels = await getMockHotels(params);
    }
  } else {
    // 直接使用本地模拟数据
    hotels = await getMockHotels(params);
  }

  // 存入缓存
  if (useCache && hotels.length > 0) {
    setToCache(cacheKey, hotels, HOTEL_LIST_CACHE_TTL);
  }

  return hotels;
}

/**
 * 获取单个酒店详情（统一入口）
 * @param {number} id - 酒店ID
 * @param {boolean} useCache - 是否使用缓存，默认 true
 * @returns {Promise<Hotel|null>}
 */
export async function getHotel(id, useCache = true) {
  // 生成缓存 key
  const cacheKey = getCacheKey(`hotel_${id}`, {});

  // 尝试从缓存获取
  if (useCache) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log('[Cache HIT] hotel detail', id);
      return cachedData;
    }
  }

  let hotel = null;

  if (USE_BACKEND_API) {
    try {
      // 调用PC端API（带重试）
      const pcHotel = await requestWithRetry(
        () => fetchHotelDetailFromApi(id),
        {
          maxRetries: 2,
          retryDelay: 1000,
          onRetry: (attempt) => console.log(`[Retry] 获取酒店详情，第 ${attempt} 次重试...`)
        }
      );

      if (pcHotel) {
        hotel = {
          ...adaptHotelFromPC(pcHotel),
          image: pcHotel.image || getMockHotelImage(pcHotel.id),
          images: pcHotel.images?.length > 0 ? pcHotel.images : [pcHotel.image || getMockHotelImage(pcHotel.id)]
        };
      } else {
        console.log('后端API返回空数据，尝试本地模拟数据');
        hotel = await getMockHotel(id);
      }
    } catch (error) {
      console.error('调用后端API失败，回退到本地模拟数据:', error);
      hotel = await getMockHotel(id);
    }
  } else {
    hotel = await getMockHotel(id);
  }

  // 存入缓存
  if (useCache && hotel) {
    setToCache(cacheKey, hotel, HOTEL_DETAIL_CACHE_TTL);
  }

  return hotel;
}

/**
 * 获取城市列表（统一入口）
 * @returns {Promise<string[]>}
 */
export async function getCities() {
    if (USE_BACKEND_API) {
        try {
            // 从PC端获取已发布的城市列表
            const hotels = await fetchHotelsFromApi();
            if (hotels && hotels.length > 0) {
                const cities = [...new Set(hotels.map(h => h.city))];
                return cities;
            }
            return await getMockCities();
        } catch (error) {
            console.error('获取城市列表失败，使用本地数据:', error);
            return await getMockCities();
        }
    } else {
        return await getMockCities();
    }
}

/**
 * 获取房型列表（从PC端）
 * @param {number} hotelId - 酒店ID
 * @returns {Promise<Array>}
 */
export async function getRoomTypes(hotelId) {
    if (USE_BACKEND_API) {
        try {
            const roomTypes = await fetchRoomTypesFromApi(hotelId);
            if (roomTypes && roomTypes.length > 0) {
                return roomTypes.map((rt, index) => ({
                    ...adaptRoomTypeFromPC(rt),
                    image: rt.image || getMockRoomImage(rt.id || index + 1),
                    images: rt.images?.length > 0 ? rt.images : [rt.image || getMockRoomImage(rt.id || index + 1)]
                }));
            }
            return [];
        } catch (error) {
            console.error('获取房型列表失败:', error);
            return [];
        }
    }
    return [];
}

// 导出配置，供调试使用
export const API_CONFIG = {
    USE_BACKEND_API,
    setUseBackendApi: (value) => {
        // 动态修改配置（仅用于调试）
        console.warn('API_CONFIG.USE_BACKEND_API 已修改为:', value);
    }
};

/**
 * 清除所有 API 缓存
 */
export const clearApiCache = () => {
    try {
        const keys = Taro.getStorageInfoSync().keys;
        keys.forEach(key => {
            if (key.startsWith('cache_hotels') || key.startsWith('cache_hotel_')) {
                Taro.removeStorageSync(key);
            }
        });
        console.log('[API Cache] 已清除');
    } catch (error) {
        console.error('清除缓存失败:', error);
    }
};
