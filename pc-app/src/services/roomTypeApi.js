import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const roomTypeApi = {
    /**
     * 为指定酒店创建房型（支持图片上传）
     * @param {number|string} hotelId
     * @param {FormData} formData - 包含 roomTypeJson / images 等字段
     * @param {string} token
     */
    async create(hotelId, formData, token) {
        const res = await axios.post(
            `${BASE_URL}/api/hotels/${hotelId}/room-types`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                    // 这里不显式设置 Content-Type，axios 会自动根据 FormData 生成 multipart/form-data
                }
            }
        );
        return res.data;
    }
};

