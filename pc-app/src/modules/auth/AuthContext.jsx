import React, { createContext, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import { authApi } from '../../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // 初始化时从 localStorage 恢复登录状态
    useEffect(() => {
        const savedToken = window.localStorage.getItem('auth_token');
        if (!savedToken) {
            setLoading(false);
            return;
        }
        authApi
            .me(savedToken)
            .then((res) => {
                setUser(res.user);
                setToken(savedToken);
            })
            .catch(() => {
                window.localStorage.removeItem('auth_token');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password, captchaId, captchaText) => {
        try {
            const res = await authApi.login({ email, password, captchaId, captchaText });
            setUser(res.user);
            setToken(res.token);
            window.localStorage.setItem('auth_token', res.token);
            message.success('登录成功');
        } catch (error) {
            // 重新抛出错误，让调用方处理
            throw error;
        }
    };

    const register = async (payload) => {
        try {
            const res = await authApi.register(payload);
            setUser(res.user);
            setToken(res.token);
            window.localStorage.setItem('auth_token', res.token);
            message.success('注册成功，已自动登录');
        } catch (error) {
            // 重新抛出错误，让调用方处理
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        window.localStorage.removeItem('auth_token');
        message.success('已退出登录');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth 必须在 AuthProvider 中使用');
    }
    return ctx;
}

