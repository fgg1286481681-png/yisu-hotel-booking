import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const authApi = {
    async getCaptcha() {
        const res = await axios.get(`${BASE_URL}/api/auth/captcha`);
        return res.data;
    },

    async login({ email, password, captchaId, captchaText }) {
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/login`, { 
                email, 
                password, 
                captchaId, 
                captchaText 
            });
            return res.data;
        } catch (error) {
            // 提取错误消息
            const errorMessage = error.response?.data?.message || error.message || '登录失败，请重试';
            throw new Error(errorMessage);
        }
    },

    async register(payload) {
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/register`, payload);
            return res.data;
        } catch (error) {
            // 提取错误消息
            const errorMessage = error.response?.data?.message || error.message || '注册失败，请重试';
            throw new Error(errorMessage);
        }
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

