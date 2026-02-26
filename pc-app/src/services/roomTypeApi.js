import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const roomTypeApi = {
    /**
     * 为指定酒店创建房型（当前使用 JSON 提交，不做真实文件上传）
     * @param {number|string} hotelId
     * @param {{ roomTypeJson: any, images?: any[] }} payload - 包含 roomTypeJson / images 等字段
     * @param {string} token
     */
    async create(hotelId, payload, token) {
        const res = await axios.post(
            `${BASE_URL}/api/hotels/${hotelId}/room-types`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;
    }
};

