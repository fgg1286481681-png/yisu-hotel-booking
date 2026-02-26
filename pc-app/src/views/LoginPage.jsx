import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Space, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { authApi } from '../services/authApi';

const { Title, Text } = Typography;

export function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [captchaLoading, setCaptchaLoading] = useState(false);
    const [captchaId, setCaptchaId] = useState(null);
    const [captchaSvg, setCaptchaSvg] = useState(null);
    const [form] = Form.useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    // 加载验证码
    const loadCaptcha = async () => {
        setCaptchaLoading(true);
        try {
            const res = await authApi.getCaptcha();
            setCaptchaId(res.captchaId);
            setCaptchaSvg(res.captchaSvg);
            // 清空验证码输入
            form.setFieldsValue({ captchaText: '' });
        } catch (error) {
            console.error('加载验证码失败:', error);
        } finally {
            setCaptchaLoading(false);
        }
    };

    useEffect(() => {
        loadCaptcha();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await login(values.email, values.password, captchaId, values.captchaText);
            navigate(from, { replace: true });
        } catch (error) {
            // 显示错误提示
            const errorMessage = error.message || '登录失败，请重试';
            message.error(errorMessage);
            // 登录失败时刷新验证码
            loadCaptcha();
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
                <Form layout="vertical" onFinish={onFinish} form={form}>
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
                    <Form.Item
                        label="验证码"
                        name="captchaText"
                        rules={[{ required: true, message: '请输入验证码' }]}
                    >
                        <Space.Compact style={{ width: '100%' }}>
                            <Input 
                                placeholder="请输入验证码" 
                                style={{ flex: 1 }}
                                maxLength={4}
                            />
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: '120px',
                                height: '32px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                backgroundColor: '#fafafa',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {captchaSvg && !captchaLoading && (
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: captchaSvg }}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                        onClick={loadCaptcha}
                                    />
                                )}
                                {captchaLoading && (
                                    <div style={{ padding: '0 8px', fontSize: '12px', color: '#999' }}>加载中...</div>
                                )}
                                {!captchaLoading && (
                                    <Button
                                        type="text"
                                        icon={<ReloadOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            loadCaptcha();
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: '2px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            padding: '0 2px',
                                            height: '20px',
                                            minWidth: '20px',
                                            fontSize: '12px'
                                        }}
                                    />
                                )}
                            </div>
                        </Space.Compact>
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

