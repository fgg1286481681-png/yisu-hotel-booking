import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const authApi = {
    async login({ email, password }) {
        const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
        return res.data;
    },

    async register(payload) {
        const res = await axios.post(`${BASE_URL}/api/auth/register`, payload);
        return res.data;
    },

    async me(token) {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    }
};

