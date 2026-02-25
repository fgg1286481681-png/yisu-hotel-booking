/**
 * 统一API服务 - 智能切换后端API和本地模拟数据
 *
 * 开发模式：优先调用PC端mock server
 * 回退模式：如果调用失败，使用本地模拟数据
 */

import { getHotels as getMockHotels, getHotel as getMockHotel, getCities as getMockCities, Hotel } from '../../../shared/api';
import { fetchHotelsFromApi, fetchHotelDetailFromApi, fetchRoomTypesFromApi } from './api';
import { adaptHotelFromPC, adaptRoomTypeFromPC, getMockHotelImage, getMockRoomImage } from './adapter';

// 配置：是否使用后端API（开发环境设为true）
const USE_BACKEND_API = true; // 生产环境应为 true

/**
 * 获取酒店列表（统一入口）
 * @param {Object} params - 查询参数
 * @returns {Promise<Hotel[]>}
 */
export async function getHotels(params = {}) {
    if (USE_BACKEND_API) {
        try {
            // 调用PC端API
            const pcHotels = await fetchHotelsFromApi(params);

            if (pcHotels && pcHotels.length > 0) {
                // 转换为移动端格式并添加默认图片
                return pcHotels.map((hotel, index) => ({
                    ...adaptHotelFromPC(hotel),
                    image: hotel.image || getMockHotelImage(hotel.id || index),
                    images: hotel.images?.length > 0 ? hotel.images : [hotel.image || getMockHotelImage(hotel.id || index)]
                }));
            }

            // 如果API返回空数据，尝试使用本地模拟数据
            console.log('后端API返回空数据，使用本地模拟数据');
            return await getMockHotels(params);
        } catch (error) {
            console.error('调用后端API失败，回退到本地模拟数据:', error);
            return await getMockHotels(params);
        }
    } else {
        // 直接使用本地模拟数据
        return await getMockHotels(params);
    }
}

/**
 * 获取单个酒店详情（统一入口）
 * @param {number} id - 酒店ID
 * @returns {Promise<Hotel|null>}
 */
export async function getHotel(id) {
    if (USE_BACKEND_API) {
        try {
            const pcHotel = await fetchHotelDetailFromApi(id);

            if (pcHotel) {
                return {
                    ...adaptHotelFromPC(pcHotel),
                    image: pcHotel.image || getMockHotelImage(pcHotel.id),
                    images: pcHotel.images?.length > 0 ? pcHotel.images : [pcHotel.image || getMockHotelImage(pcHotel.id)]
                };
            }

            console.log('后端API返回空数据，尝试本地模拟数据');
            return await getMockHotel(id);
        } catch (error) {
            console.error('调用后端API失败，回退到本地模拟数据:', error);
            return await getMockHotel(id);
        }
    } else {
        return await getMockHotel(id);
    }
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
