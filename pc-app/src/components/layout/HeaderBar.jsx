import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

export function HeaderBar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 28px',
                background:
                    'linear-gradient(90deg, rgba(0, 21, 41, 0.96) 0%, rgba(24, 90, 188, 0.98) 55%, rgba(0, 140, 117, 0.98) 100%)',
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.45)'
            }}
        >
            <Link
                to="/dashboard"
                style={{
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}
            >
                <span
                    style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background:
                            'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(165, 215, 255, 0.9))',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0958d9',
                        fontSize: 16,
                        fontWeight: 800,
                        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.35)'
                    }}
                >
                    易
                </span>
                易宿酒店管理后台
            </Link>
            <Space>
                {isAuthenticated && (
                    <Text style={{ color: '#fff' }}>
                        欢迎，{user?.displayName || user?.email}
                    </Text>
                )}
                {isAuthenticated ? (
                    <Button size="small" onClick={handleLogout}>
                        退出登录
                    </Button>
                ) : (
                    <>
                        <Button size="small" onClick={() => navigate('/login')}>
                            登录
                        </Button>
                        <Button size="small" type="primary" onClick={() => navigate('/register')}>
                            注册
                        </Button>
                    </>
                )}
            </Space>
        </Header>
    );
}

