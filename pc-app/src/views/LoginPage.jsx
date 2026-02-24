import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

const { Title, Text } = Typography;

export function LoginPage() {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await login(values.email, values.password);
            navigate(from, { replace: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <Title level={3} className="auth-page-title">
                    登录易宿酒店管理后台
                </Title>
                <Text className="auth-page-subtitle">
                    精准管理房态、订单与房价，为您的酒店运营保驾护航
                </Text>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '邮箱格式不正确' }
                        ]}
                    >
                        <Input placeholder="admin@example.com" />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            登录
                        </Button>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} className="auth-page-footer">
                        还没有账号？ <Link to="/register">立即注册</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

