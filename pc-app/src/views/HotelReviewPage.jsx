import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Modal, Space, Table, Tag, message, Switch, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../modules/auth/AuthContext';
import { hotelApi } from '../services/hotelApi';

const { confirm } = Modal;

export function HotelReviewPage() {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [showOffline, setShowOffline] = useState(false);

    const isAdmin = useMemo(() => user?.role === 'admin', [user]);

    const loadHotels = async (options = {}) => {
        const { forceStatus } = options;
        if (!token) return;
        setLoading(true);
        try {
            // 当处于“回收站视图”时，仅加载已下线酒店；否则默认不展示已下线记录
            const listParams = forceStatus || showOffline ? { status: 'offline' } : {};
            const res = await hotelApi.list(token, listParams);
            const allHotels = res.hotels || [];

            const visibleHotels = showOffline
                ? allHotels.filter((h) => h.status === 'offline')
                : allHotels.filter((h) => h.status !== 'offline');

            // 为了让“最新提交 / 待审核”的酒店永远排在最前面：
            // 1. 先按是否为待审核(status === 'pending')分组，待审核在前，其它状态在后
            // 2. 每个分组内部再按 updatedAt 倒序（最新更新时间在前）
            const sortedHotels = [...visibleHotels].sort((a, b) => {
                const isPendingA = a.status === 'pending' ? 1 : 0;
                const isPendingB = b.status === 'pending' ? 1 : 0;

                // 待审核优先：pending 的记录整体排在前面
                if (isPendingA !== isPendingB) {
                    return isPendingB - isPendingA;
                }

                const updatedA = a.updatedAt ? Number(a.updatedAt) : 0;
                const updatedB = b.updatedAt ? Number(b.updatedAt) : 0;
                return updatedB - updatedA;
            });

            setHotels(sortedHotels);
        } catch (e) {
            message.error('加载酒店列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHotels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, showOffline]);

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

    const handleUpdateStatus = (record, status) => {
        if (!token) return;

        const doUpdate = async (rejectReason) => {
            try {
                await hotelApi.updateStatus(record.id, status, rejectReason, token);
                message.success('状态已更新');
                loadHotels();
            } catch (e) {
                message.error('更新状态失败');
            }
        };

        if (status === 'rejected') {
            let reasonText = '';
            Modal.confirm({
                title: '请填写不通过原因',
                icon: <ExclamationCircleOutlined />,
                content: (
                    <textarea
                        style={{ width: '100%', minHeight: 80, marginTop: 8 }}
                        onChange={(e) => {
                            reasonText = e.target.value;
                        }}
                        placeholder="例如：酒店资质照片不清晰，请重新上传。"
                    />
                ),
                okText: '确定',
                cancelText: '取消',
                onOk: () => doUpdate(reasonText || '')
            });
        } else {
            let actionText = '';
            if (status === 'approved') {
                actionText = '通过审核并发布';
            } else if (status === 'offline') {
                actionText = '下线';
            } else if (status === 'restore') {
                actionText = '恢复为已发布';
            } else {
                actionText = '更新状态';
            }
            confirm({
                title: `确认要将该酒店${actionText}吗？`,
                icon: <ExclamationCircleOutlined />,
                okText: '确定',
                cancelText: '取消',
                onOk: () => doUpdate('')
            });
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
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true
        },
        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone'
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
        }
    ];

    if (isAdmin) {
        columns.push({
            title: showOffline ? '回收站操作' : '审核 / 上下线',
            key: 'action',
            fixed: 'right',
            width: 220,
            render: (_, record) => (
                <Space>
                    {!showOffline && record.status !== 'approved' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdateStatus(record, 'approved')}
                        >
                            通过并发布
                        </Button>
                    )}
                    {!showOffline && record.status !== 'rejected' && (
                        <Button
                            type="link"
                            danger
                            onClick={() => handleUpdateStatus(record, 'rejected')}
                        >
                            不通过
                        </Button>
                    )}
                    {!showOffline && record.status === 'approved' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdateStatus(record, 'offline')}
                        >
                            下线
                        </Button>
                    )}
                    {showOffline && record.status === 'offline' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdateStatus(record, 'restore')}
                        >
                            恢复为已发布
                        </Button>
                    )}
                </Space>
            )
        });
    }

    return (
        <div className="page-wrapper">
            <Card>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div className="page-header" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div className="page-title">酒店信息审核 / 发布 / 下线</div>
                            <div className="page-subtitle">
                                {isAdmin
                                    ? '管理员可以在此对商户提交的酒店信息进行审核，审核通过的酒店会标记为“已发布”，也可以随时下线。'
                                    : '当前为商户视角，仅可查看自身酒店的审核状态和下线情况，审核结果由平台管理员给出。'}
                            </div>
                        </div>
                        {isAdmin && (
                            <Space>
                                <Tooltip title="开启后仅展示当前平台中已下线的酒店记录，可从中恢复已下线酒店。">
                                    <span style={{ fontSize: 13, color: '#666' }}>查看已下线酒店（回收站）</span>
                                </Tooltip>
                                <Switch
                                    checked={showOffline}
                                    onChange={(checked) => setShowOffline(checked)}
                                />
                            </Space>
                        )}
                    </div>
                    <Table
                        rowKey="id"
                        loading={loading}
                        dataSource={hotels}
                        columns={columns}
                        pagination={{ pageSize: 8 }}
                        scroll={{ x: 900 }}
                        size="small"
                    />
                </Space>
            </Card>
        </div>
    );
}

