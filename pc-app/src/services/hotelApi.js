import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const hotelApi = {
    async list(token, params = {}) {
        const res = await axios.get(`${BASE_URL}/api/hotels`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params
        });
        return res.data;
    },

    async save(payload, token) {
        const res = await axios.post(`${BASE_URL}/api/hotels`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    },

    async updateStatus(id, status, rejectReason, token) {
        const res = await axios.patch(
            `${BASE_URL}/api/hotels/${id}/status`,
            { status, rejectReason },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    }
};

