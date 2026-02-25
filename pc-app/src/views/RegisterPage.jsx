import React, { useState } from 'react';
import { Card, Form, Input, Button, Radio, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

const { Title, Text } = Typography;

export function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await register({
                email: values.email,
                password: values.password,
                role: values.role,
                displayName: values.displayName,
                merchantName: values.merchantName
            });
            navigate('/dashboard', { replace: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <Title level={3} className="auth-page-title">
                    注册易宿酒店管理后台
                </Title>
                <Text className="auth-page-subtitle">
                    一次注册，统一管理多门店房态、价格策略与渠道资源
                </Text>
                <Form layout="vertical" onFinish={onFinish} initialValues={{ role: 'admin' }}>
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '邮箱格式不正确' }
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码' },
                            { min: 6, message: '密码至少 6 位' }
                        ]}
                    >
                        <Input.Password placeholder="至少 6 位，建议包含数字和字母" />
                    </Form.Item>
                    <Form.Item
                        label="确认密码"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '请再次输入密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                }
                            })
                        ]}
                    >
                        <Input.Password placeholder="请再次输入密码" />
                    </Form.Item>
                    <Form.Item
                        label="姓名 / 昵称"
                        name="displayName"
                        rules={[{ required: true, message: '请输入姓名或昵称' }]}
                    >
                        <Input placeholder="例如：张三" />
                    </Form.Item>
                    <Form.Item label="角色" name="role">
                        <Radio.Group>
                            <Radio value="admin">平台管理员</Radio>
                            <Radio value="merchant">商户</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prev, cur) => prev.role !== cur.role}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('role') === 'merchant' ? (
                                <Form.Item
                                    label="商户名称"
                                    name="merchantName"
                                    rules={[{ required: true, message: '请输入商户名称' }]}
                                >
                                    <Input placeholder="例如：XX 酒店" />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            注册并登录
                        </Button>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} className="auth-page-footer">
                        已有账号？ <Link to="/login">去登录</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

