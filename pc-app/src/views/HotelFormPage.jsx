import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Select, Space, Table, Tag, Upload, Divider, Alert, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../modules/auth/AuthContext';
import { hotelApi } from '../services/hotelApi';
import { roomTypeApi } from '../services/roomTypeApi';

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
    const [roomForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [editing, setEditing] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // 1: 创建 / 编辑酒店；2: 为当前酒店创建房型
    const [currentHotel, setCurrentHotel] = useState(null); // 保存刚创建或正在编辑的酒店
    const [roomImageFiles, setRoomImageFiles] = useState([]); // 当前房型图片 File 列表

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
        roomForm.resetFields();
        setCurrentStep(1);
        setCurrentHotel(null);
        setRoomImageFiles([]);
    };

    const onFinish = async (values) => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await hotelApi.save(
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

            const savedHotel = res?.hotel || res;

            message.success(editing ? '酒店信息已保存并提交审核' : '新酒店已提交审核，下一步请创建房型');

            // 进入第二步：为当前酒店创建房型
            if (savedHotel && savedHotel.id) {
                setCurrentHotel(savedHotel);
                setCurrentStep(2);
                roomForm.resetFields();
                setRoomImageFiles([]);
            } else {
                // 如果没有返回 id，就只刷新列表并重置
                resetForm();
                loadHotels();
            }
        } catch (e) {
            message.error('保存酒店信息失败');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditing(record);
        setCurrentHotel(record);
        setCurrentStep(1);
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

    // 房型图片 Upload （不真正上传，只收集 File）
    const roomUploadProps = {
        listType: 'picture-card',
        fileList: roomImageFiles,
        beforeUpload: () => false,
        onChange: ({ fileList }) => {
            setRoomImageFiles(fileList);
        }
    };

    // 第二步：提交房型创建（支持一次一个房型，重复添加）
    const onRoomFinish = async (values) => {
        if (!token) return;
        if (!currentHotel || !currentHotel.id) {
            message.error('请先完成酒店信息并获取酒店 ID');
            return;
        }

        const hotelId = currentHotel.id;

        const dto = {
            hotelId,
            name: values.name,
            description: values.description,
            tags: values.tags ? values.tags.split(/[，,]/).map((t) => t.trim()).filter(Boolean) : [],
            price: Number(values.price),
            originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
            area: values.area,
            bedType: values.bedType,
            maxOccupancy: values.maxOccupancy ? Number(values.maxOccupancy) : 2,
            breakfastIncluded: values.breakfastIncluded === 'yes',
            cancellationPolicy: values.cancellationPolicy
        };

        const formData = new FormData();
        formData.append('roomTypeJson', JSON.stringify(dto));

        roomImageFiles.forEach((fileWrapper, index) => {
            // antd Upload 的 file 对象里真正的 File 在 originFileObj
            const realFile = fileWrapper.originFileObj || fileWrapper;
            formData.append(`images[${index}]`, realFile);
        });

        setLoading(true);
        try {
            await roomTypeApi.create(hotelId, formData, token);
            message.success('房型已创建');
            roomForm.resetFields();
            setRoomImageFiles([]);
        } catch (e) {
            message.error('创建房型失败');
        } finally {
            setLoading(false);
        }
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

                        <Alert
                            type="info"
                            showIcon
                            message={
                                currentStep === 1
                                    ? '步骤一：先完善酒店基础信息并提交审核，系统会返回酒店 ID。'
                                    : `步骤二：为酒店【${currentHotel?.name || '当前酒店'}】创建房型，可重复添加多个房型。`
                            }
                        />
                        {/* 步骤 1：酒店创建 / 编辑表单 */}
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
                                        {currentHotel && currentHotel.id && (
                                            <Button type="default" onClick={() => setCurrentStep(2)}>
                                                去创建房型
                                            </Button>
                                        )}
                                </Space>
                            </Form.Item>
                        </Form>

                        {/* 步骤 2：为当前酒店创建房型 */}
                        {currentHotel && currentHotel.id && (
                            <>
                                <Divider />
                                <Alert
                                    type="info"
                                    showIcon
                                    message="步骤二：为当前酒店创建房型，可重复添加多个房型。"
                                    style={{ marginBottom: 16 }}
                                />
                                <Form
                                    layout="vertical"
                                    form={roomForm}
                                    onFinish={onRoomFinish}
                                >
                                    <Form.Item
                                        label="房型名称"
                                        name="name"
                                        rules={[{ required: true, message: '请输入房型名称' }]}
                                    >
                                        <Input placeholder="例如：豪华大床房 / 标准双床房" />
                                    </Form.Item>
                                    <Form.Item
                                        label="房型描述（可选）"
                                        name="description"
                                    >
                                        <Input.TextArea
                                            placeholder="例如：30㎡，大床 1.8m，带浴缸，可住 2 人"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="标签（可选，以逗号或顿号分隔）"
                                        name="tags"
                                    >
                                        <Input placeholder="例如：湖景，浴缸，含早" />
                                    </Form.Item>
                                    <Form.Item
                                        label="销售价格（含税）"
                                        name="price"
                                        rules={[{ required: true, message: '请输入销售价格' }]}
                                    >
                                        <Input type="number" min={0} placeholder="单位：人民币元" />
                                    </Form.Item>
                                    <Form.Item
                                        label="原价（可选）"
                                        name="originalPrice"
                                    >
                                        <Input type="number" min={0} placeholder="单位：人民币元" />
                                    </Form.Item>
                                    <Form.Item
                                        label="面积（可选）"
                                        name="area"
                                    >
                                        <Input placeholder="例如：30㎡" />
                                    </Form.Item>
                                    <Form.Item
                                        label="床型（可选）"
                                        name="bedType"
                                    >
                                        <Input placeholder="例如：大床 1.8m / 双床 1.2m*2" />
                                    </Form.Item>
                                    <Form.Item
                                        label="最大入住人数"
                                        name="maxOccupancy"
                                        initialValue={2}
                                        rules={[{ required: true, message: '请输入最大入住人数' }]}
                                    >
                                        <Input type="number" min={1} max={8} />
                                    </Form.Item>
                                    <Form.Item
                                        label="是否含早"
                                        name="breakfastIncluded"
                                        initialValue="no"
                                    >
                                        <Select
                                            options={[
                                                { label: '不含早', value: 'no' },
                                                { label: '含早', value: 'yes' }
                                            ]}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="取消政策（可选）"
                                        name="cancellationPolicy"
                                    >
                                        <Input.TextArea
                                            placeholder="例如：入住前 1 天 18:00 前可免费取消，逾期收取首晚房费"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="房型图片（可选，移动端直接上传）">
                                        <Upload {...roomUploadProps}>
                                            {roomImageFiles.length >= 6 ? null : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>上传图片</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item>
                                        <Space>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                            >
                                                添加房型
                                            </Button>
                                            <Button onClick={() => setCurrentStep(1)}>
                                                返回酒店信息
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            </>
                        )}
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

