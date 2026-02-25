/**
 * 移动端API服务 - 调用PC端后端API
 * 
 * 使用Taro的request方法，兼容微信小程序环境
 */

import Taro from '@tarojs/taro';

// API基础地址 - 开发环境使用PC端mock server
// 注意：小程序需要设置合法域名，或者使用不校验域名选项
const API_BASE_URL = 'http://localhost:3001';

/**
 * 使用Taro.request发送请求（兼容小程序环境）
 */
const request = (options) => {
    return new Promise((resolve, reject) => {
        Taro.request({
            ...options,
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
        });
    });
};

/**
 * 构建URL查询参数（兼容小程序环境）
 * @param {Object} params 
 * @returns {string}
 */
const buildQueryString = (params) => {
    const parts = [];
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        }
    }
    return parts.length > 0 ? '?' + parts.join('&') : '';
};

/**
 * 获取公开的酒店列表（已审核通过的）
 * @param {Object} params - 查询参数
 * @returns {Promise<Array>}
 */
export async function fetchHotelsFromApi(params = {}) {
    try {
        const queryString = buildQueryString(params);
        const url = `${API_BASE_URL}/api/public/hotels${queryString}`;
        
        const data = await request({ url });
        
        if (data.success) {
            return data.hotels || [];
        }
        return [];
    } catch (error) {
        console.error('获取酒店列表失败:', error);
        return [];
    }
}

/**
 * 获取酒店详情
 * @param {number} id - 酒店ID
 * @returns {Promise<Object|null>}
 */
export async function fetchHotelDetailFromApi(id) {
    try {
        const data = await request({
            url: `${API_BASE_URL}/api/public/hotels/${id}`
        });
        
        if (data.success) {
            return data.hotel;
        }
        return null;
    } catch (error) {
        console.error('获取酒店详情失败:', error);
        return null;
    }
}

/**
 * 获取房型列表
 * @param {number} hotelId - 酒店ID
 * @returns {Promise<Array>}
 */
export async function fetchRoomTypesFromApi(hotelId) {
    try {
        const data = await request({
            url: `${API_BASE_URL}/api/roomTypes?hotelId=${hotelId}`
        });
        
        if (data.success) {
            return data.roomTypes || [];
        }
        return [];
    } catch (error) {
        console.error('获取房型列表失败:', error);
        return [];
    }
}

/**
 * 创建酒店（商户端）
 * @param {Object} payload - 酒店数据
 * @param {string} token - 认证token
 * @returns {Promise<Object>}
 */
export async function createHotelApi(payload, token) {
    return await request({
        url: `${API_BASE_URL}/api/hotels`,
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: payload
    });
}

/**
 * 更新酒店状态（审核）
 * @param {number} id - 酒店ID
 * @param {string} status - 状态: approved, rejected, offline, restore
 * @param {string} rejectReason - 拒绝原因
 * @param {string} token - 认证token
 * @returns {Promise<Object>}
 */
export async function updateHotelStatusApi(id, status, rejectReason, token) {
    return await request({
        url: `${API_BASE_URL}/api/hotels/${id}/status`,
        method: 'PATCH',
        header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: { status, rejectReason }
    });
}

export { API_BASE_URL };
