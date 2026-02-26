import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Radio, Typography, Space, Progress, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { authApi } from '../services/authApi';

const { Title, Text } = Typography;

// 密码强度校验函数
function getPasswordStrength(password) {
    if (!password) return { strength: 0, text: '', percent: 0, status: 'normal' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    const configs = [
        { text: '很弱', percent: 20, status: 'exception' },
        { text: '弱', percent: 40, status: 'exception' },
        { text: '一般', percent: 60, status: 'active' },
        { text: '强', percent: 80, status: 'active' },
        { text: '很强', percent: 100, status: 'success' }
    ];
    
    return configs[strength - 1] || { text: '', percent: 0, status: 'normal' };
}

export function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [captchaLoading, setCaptchaLoading] = useState(false);
    const [captchaId, setCaptchaId] = useState(null);
    const [captchaSvg, setCaptchaSvg] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, text: '', percent: 0, status: 'normal' });
    const [form] = Form.useForm();
    const { register } = useAuth();
    const navigate = useNavigate();

    // 加载验证码
    const loadCaptcha = async () => {
        setCaptchaLoading(true);
        try {
            const res = await authApi.getCaptcha();
            setCaptchaId(res.captchaId);
            setCaptchaSvg(res.captchaSvg);
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
            await register({
                email: values.email,
                password: values.password,
                role: values.role,
                displayName: values.displayName,
                merchantName: values.merchantName,
                captchaId,
                captchaText: values.captchaText
            });
            navigate('/dashboard', { replace: true });
        } catch (error) {
            // 显示错误提示
            const errorMessage = error.message || '注册失败，请重试';
            message.error(errorMessage);
            // 注册失败时刷新验证码
            loadCaptcha();
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPasswordStrength(getPasswordStrength(password));
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
                <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{ role: 'admin' }}>
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
                            { min: 8, message: '密码长度至少8位' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                message: '密码必须包含大小写字母、数字和特殊字符'
                            }
                        ]}
                    >
                        <Input.Password 
                            placeholder="至少8位，包含大小写字母、数字和特殊字符" 
                            onChange={handlePasswordChange}
                        />
                    </Form.Item>
                    {passwordStrength.percent > 0 && (
                        <Form.Item>
                            <div>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    密码强度：{passwordStrength.text}
                                </Text>
                                <Progress 
                                    percent={passwordStrength.percent} 
                                    status={passwordStrength.status}
                                    showInfo={false}
                                    strokeWidth={4}
                                    style={{ marginTop: '4px' }}
                                />
                            </div>
                        </Form.Item>
                    )}
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

