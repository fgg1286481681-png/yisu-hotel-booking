import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Select, Space, Table, Tag, message } from 'antd';
import { useAuth } from '../modules/auth/AuthContext';
import { hotelApi } from '../services/hotelApi';

const CITY_OPTIONS = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '南京', '武汉', '西安'];

const STAR_LEVEL_OPTIONS = [
    '经济型 / 1-2 星',
    '舒适型 / 3 星',
    '高档型 / 4 星',
    '豪华型 / 5 星'
];

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
                    phone: values.phone,
                    starLevel: values.starLevel,
                    roomType: values.roomType,
                    price: values.price,
                    openingDate: values.openingDate,
                    nearbyHighlights: values.nearbyHighlights,
                    promotionInfo: values.promotionInfo
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
            phone: record.phone,
            starLevel: record.starLevel,
            roomType: record.roomType,
            price: record.price,
            openingDate: record.openingDate,
            nearbyHighlights: record.nearbyHighlights,
            promotionInfo: record.promotionInfo
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
            title: '星级',
            dataIndex: 'starLevel',
            key: 'starLevel'
        },
        {
            title: '主要房型',
            dataIndex: 'roomType',
            key: 'roomType',
            ellipsis: true
        },
        {
            title: '基础价格',
            dataIndex: 'price',
            key: 'price',
            render: (val) => (val !== undefined && val !== null ? `¥${val}` : '-')
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
                                <div className="page-subtitle">
                                    必填维度包括：酒店名称（中）、所在城市与详细地址、酒店星级、主要房型、基础价格及开业时间；
                                    可选维度包括：酒店周边热门景点 / 交通及商圈说明、价格优惠场景等营销信息。
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
                                label="酒店名称（中文）"
                                name="name"
                                rules={[{ required: true, message: '请输入酒店中文名称' }]}
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
                                label="酒店星级"
                                name="starLevel"
                                rules={[{ required: true, message: '请选择酒店星级' }]}
                            >
                                <Select
                                    options={STAR_LEVEL_OPTIONS.map((label) => ({ label, value: label }))}
                                    placeholder="请选择酒店星级"
                                />
                            </Form.Item>
                            <Form.Item
                                label="主要房型"
                                name="roomType"
                                rules={[{ required: true, message: '请输入主要房型信息' }]}
                            >
                                <Input.TextArea
                                    placeholder="例如：大床房 / 双床房 / 家庭房等，可用顿号或逗号分隔"
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="基础价格（含税）"
                                name="price"
                                rules={[{ required: true, message: '请输入基础价格' }]}
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="例如：520，单位为人民币元"
                                />
                            </Form.Item>
                            <Form.Item
                                label="酒店开业时间"
                                name="openingDate"
                                rules={[{ required: true, message: '请选择或输入开业时间' }]}
                            >
                                <Input type="date" />
                            </Form.Item>
                            <Form.Item
                                label="周边热门景点 / 交通及商圈（可选）"
                                name="nearbyHighlights"
                            >
                                <Input.TextArea
                                    placeholder="例如：步行 5 分钟可达地铁站，毗邻 XX 商圈及 XX 景区"
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="价格优惠场景 / 套餐说明（可选）"
                                name="promotionInfo"
                            >
                                <Input.TextArea
                                    placeholder="例如：节日连住 3 晚 8 折、机酒套餐立减多少元等"
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                />
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

