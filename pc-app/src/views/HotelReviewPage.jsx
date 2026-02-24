import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Modal, Space, Table, Tag, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../modules/auth/AuthContext';
import { hotelApi } from '../services/hotelApi';

const { confirm } = Modal;

export function HotelReviewPage() {
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);

    const isAdmin = useMemo(() => user?.role === 'admin', [user]);

    const loadHotels = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await hotelApi.list(token);
            setHotels(res.hotels || []);
        } catch (e) {
            message.error('加载酒店列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHotels();
    }, [token]);

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
            const actionText = status === 'approved' ? '通过审核并发布' : '下线';
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
            title: '审核 / 上下线',
            key: 'action',
            fixed: 'right',
            width: 220,
            render: (_, record) => (
                <Space>
                    {record.status !== 'approved' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdateStatus(record, 'approved')}
                        >
                            通过并发布
                        </Button>
                    )}
                    {record.status !== 'rejected' && (
                        <Button
                            type="link"
                            danger
                            onClick={() => handleUpdateStatus(record, 'rejected')}
                        >
                            不通过
                        </Button>
                    )}
                    {record.status === 'approved' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdateStatus(record, 'offline')}
                        >
                            下线
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
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                            酒店信息审核 / 发布 / 下线
                        </div>
                        <div style={{ color: '#64748b', fontSize: 13 }}>
                            {isAdmin
                                ? '管理员可以在此对商户提交的酒店信息进行审核，审核通过的酒店会标记为“已发布”，也可以随时下线。'
                                : '当前为商户视角，仅可查看自身酒店的审核状态和下线情况，审核结果由平台管理员给出。'}
                        </div>
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

