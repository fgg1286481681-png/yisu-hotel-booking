import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Select, Space, Table, Tag, message } from 'antd';
import { useAuth } from '../modules/auth/AuthContext';
import { hotelApi } from '../services/hotelApi';

const CITY_OPTIONS = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '南京', '武汉', '西安'];

export function HotelFormPage() {
    const { user, token } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [editing, setEditing] = useState(null);

    const isMerchant = useMemo(() => user?.role === 'merchant', [user]);

    const loadHotels = async () => {
        if (!token) return;
        setTableLoading(true);
        try {
            const res = await hotelApi.list(token);
            setHotels(res.hotels || []);
        } catch (e) {
            message.error('加载酒店列表失败');
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadHotels();
    }, [token]);

    const resetForm = () => {
        setEditing(null);
        form.resetFields();
    };

    const onFinish = async (values) => {
        if (!token) return;
        setLoading(true);
        try {
            await hotelApi.save(
                {
                    id: editing?.id,
                    name: values.name,
                    city: values.city,
                    address: values.address,
                    phone: values.phone
                },
                token
            );
            message.success(editing ? '酒店信息已保存并提交审核' : '新酒店已提交审核');
            resetForm();
            loadHotels();
        } catch (e) {
            message.error('保存酒店信息失败');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            name: record.name,
            city: record.city,
            address: record.address,
            phone: record.phone
        });
    };

    const statusTag = (status) => {
        switch (status) {
            case 'approved':
                return <Tag color="green">已发布</Tag>;
            case 'rejected':
                return <Tag color="red">未通过</Tag>;
            case 'offline':
                return <Tag color="default">已下线</Tag>;
            case 'pending':
            default:
                return <Tag color="orange">待审核</Tag>;
        }
    };

    const columns = [
        {
            title: '酒店名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Space direction="vertical" size={0}>
                    {statusTag(status)}
                    {status === 'rejected' && record.rejectReason ? (
                        <span style={{ fontSize: 12, color: '#ff4d4f' }}>原因：{record.rejectReason}</span>
                    ) : null}
                </Space>
            )
        },
        {
            title: '最近更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (val) => (val ? new Date(val).toLocaleString() : '-')
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => handleEdit(record)}>
                    编辑
                </Button>
            )
        }
    ];

    return (
        <div className="page-wrapper">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Card>
                    <Space
                        direction="vertical"
                        size={16}
                        style={{ width: '100%' }}
                    >
                        <div className="page-header">
                            <div>
                                <div className="page-title">酒店信息录入 / 编辑</div>
                                <div className="page-subtitle">
                                    {isMerchant
                                        ? '以商户身份登录，可录入和维护自己名下酒店的信息，提交后由平台管理员进行审核。'
                                        : '以管理员身份登录，可代商户维护酒店基础信息，信息保存后会重新进入待审核状态。'}
                                </div>
                            </div>
                        </div>
                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                            initialValues={{ city: CITY_OPTIONS[0] }}
                        >
                            <Form.Item
                                label="酒店名称"
                                name="name"
                                rules={[{ required: true, message: '请输入酒店名称' }]}
                            >
                                <Input placeholder="例如：易宿国际酒店（上海虹桥店）" />
                            </Form.Item>
                            <Form.Item
                                label="所在城市"
                                name="city"
                                rules={[{ required: true, message: '请选择所在城市' }]}
                            >
                                <Select
                                    options={CITY_OPTIONS.map((c) => ({ label: c, value: c }))}
                                    placeholder="请选择城市"
                                    showSearch
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                            <Form.Item
                                label="详细地址"
                                name="address"
                                rules={[{ required: true, message: '请输入详细地址' }]}
                            >
                                <Input.TextArea
                                    placeholder="例如：闵行区申虹路 888 弄 XX 号"
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="联系电话"
                                name="phone"
                                rules={[
                                    {
                                        pattern: /^(\d{3,4}-\d{7,8}|1\d{10})$/,
                                        message: '请输入合法的座机或手机号（可选）'
                                    }
                                ]}
                            >
                                <Input placeholder="例如：021-88888888 或 13800000000（选填）" />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        {editing ? '保存并重新提交审核' : '提交审核'}
                                    </Button>
                                    {editing && (
                                        <Button onClick={resetForm}>取消编辑</Button>
                                    )}
                                </Space>
                            </Form.Item>
                        </Form>
                    </Space>
                </Card>

                <Card>
                    <div className="section-title">酒店列表</div>
                    <Table
                        rowKey="id"
                        loading={tableLoading}
                        dataSource={hotels}
                        columns={columns}
                        pagination={{ pageSize: 5 }}
                        size="small"
                    />
                </Card>
            </Space>
        </div>
    );
}

