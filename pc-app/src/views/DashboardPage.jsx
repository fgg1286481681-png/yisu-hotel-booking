import React, { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Space, Row, Col, Statistic, message } from 'antd';
import { useAuth } from '../modules/auth/AuthContext';
import { hotelApi } from '../services/hotelApi';

const { Title, Paragraph } = Typography;

const roomPriceTrend = [60, 72, 80, 78, 86, 90, 94];
const orderTrend = [40, 55, 63, 70, 68, 74, 82];
const reportTrend = [30, 42, 48, 55, 60, 66, 72];

export function DashboardPage() {
    const { user, token } = useAuth();
    const isAdmin = useMemo(() => user?.role === 'admin', [user]);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        offline: 0,
        rejected: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            if (!token) return;
            try {
                const res = await hotelApi.list(token);
                const hotels = res.hotels || [];

                const scopedHotels = isAdmin
                    ? hotels
                    : hotels.filter((h) => h.ownerId === user?.id || h.merchantId === user?.id);

                const total = scopedHotels.length;
                const approved = scopedHotels.filter((h) => h.status === 'approved').length;
                const pending = scopedHotels.filter((h) => h.status === 'pending').length;
                const offline = scopedHotels.filter((h) => h.status === 'offline').length;
                const rejected = scopedHotels.filter((h) => h.status === 'rejected').length;

                setStats({
                    total,
                    approved,
                    pending,
                    offline,
                    rejected
                });
            } catch (e) {
                message.error('加载酒店统计信息失败');
            }
        };

        loadStats();
    }, [token, isAdmin, user]);

    return (
        <div
            className="page-wrapper"
            style={{
                width: '90%',
                margin: '0 auto',
                minHeight: '100vh',
                paddingBottom: 32,
            }}
        >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ minHeight: 120 }}>
                            <Statistic
                                title={isAdmin ? '系统酒店总数' : '我的酒店总数'}
                                value={stats.total}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ minHeight: 120 }}>
                            <Statistic
                                title="已发布酒店"
                                value={stats.approved}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ minHeight: 120 }}>
                            <Statistic
                                title={isAdmin ? '待审核酒店' : '待审核我的酒店'}
                                value={stats.pending}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{ minHeight: 120 }}>
                            <Statistic
                                title="未通过 / 已下线"
                                value={stats.rejected + stats.offline}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Card style={{ minHeight: 320 }}>
                            <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                <Title level={5} style={{ marginBottom: 0 }}>
                                    房型与房价管理
                                </Title>
                                <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                                    当前上线房型 18 个，平均可售价格 ¥420，近 7 日整体入住率 86%。
                                </Paragraph>
                                <Statistic
                                    title="近 7 日平均入住率"
                                    value={86}
                                    suffix="%"
                                    valueStyle={{ color: '#16a34a' }}
                                />
                                {/* 柱状图风格 */}
                                <div style={{ height: 56, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                                    {roomPriceTrend.map((v, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                flex: 1,
                                                height: `${(v / 100) * 56}px`,
                                                borderRadius: 6,
                                                background: 'linear-gradient(to top, #22c55e, #bbf7d0)',
                                                boxShadow: '0 4px 10px rgba(34,197,94,0.25)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card style={{ minHeight: 320 }}>
                            <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                <Title level={5} style={{ marginBottom: 0 }}>
                                    订单与入住管理
                                </Title>
                                <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                                    近 7 日累计订单 132 单，入住完成率 91%，当日在住房间 42 间。
                                </Paragraph>
                                <Statistic
                                    title="近 7 日订单量"
                                    value={132}
                                    suffix="单"
                                    valueStyle={{ color: '#2563eb' }}
                                />
                                {/* 折线图风格（用圆点和线段模拟） */}
                                <div
                                    style={{
                                        position: 'relative',
                                        height: 64,
                                        padding: '0 4px'
                                    }}
                                >
                                    <svg width="100%" height="64" style={{ overflow: 'visible' }}>
                                        {orderTrend.map((v, idx) => {
                                            if (idx === 0) return null;
                                            const prev = orderTrend[idx - 1];
                                            const stepX = 100 / (orderTrend.length - 1);
                                            const x1 = stepX * (idx - 1);
                                            const x2 = stepX * idx;
                                            const y1 = 64 - (prev / 100) * 48 - 4;
                                            const y2 = 64 - (v / 100) * 48 - 4;
                                            return (
                                                <line
                                                    key={`line-${idx}`}
                                                    x1={`${x1}%`}
                                                    y1={y1}
                                                    x2={`${x2}%`}
                                                    y2={y2}
                                                    stroke="#3b82f6"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            );
                                        })}
                                        {orderTrend.map((v, idx) => {
                                            const stepX = 100 / (orderTrend.length - 1);
                                            const cx = stepX * idx;
                                            const cy = 64 - (v / 100) * 48 - 4;
                                            return (
                                                <circle
                                                    key={`dot-${idx}`}
                                                    cx={`${cx}%`}
                                                    cy={cy}
                                                    r="3"
                                                    fill="#3b82f6"
                                                    stroke="#eff6ff"
                                                    strokeWidth="2"
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={8}>
                        <Card style={{ minHeight: 320 }}>
                            <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                <Title level={5} style={{ marginBottom: 0 }}>
                                    统计分析报表
                                </Title>
                                <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                                    近 30 日营收同比增长 18%，主要来源于直销渠道与周末高价房型。
                                </Paragraph>
                                <Statistic
                                    title="近 30 日营收同比"
                                    value={18}
                                    suffix="%"
                                    valueStyle={{ color: '#f97316' }}
                                />
                                {/* 面积图/条形组合风格 */}
                                <div style={{ height: 56, position: 'relative' }}>
                                    <svg width="100%" height="56" style={{ overflow: 'visible' }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#fdba74" stopOpacity="0.9" />
                                                <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.2" />
                                            </linearGradient>
                                        </defs>
                                        <polygon
                                            points={reportTrend
                                                .map((v, idx) => {
                                                    const stepX = 100 / (reportTrend.length - 1);
                                                    const x = stepX * idx;
                                                    const y = 56 - (v / 100) * 40 - 4;
                                                    return `${x},${y}`;
                                                })
                                                .join(' ') + ` 100,56 0,56`}
                                            fill="url(#revenueGradient)"
                                        />
                                        {reportTrend.map((v, idx) => {
                                            if (idx === 0) return null;
                                            const prev = reportTrend[idx - 1];
                                            const stepX = 100 / (reportTrend.length - 1);
                                            const x1 = stepX * (idx - 1);
                                            const x2 = stepX * idx;
                                            const y1 = 56 - (prev / 100) * 40 - 4;
                                            const y2 = 56 - (v / 100) * 40 - 4;
                                            return (
                                                <line
                                                    key={`rev-line-${idx}`}
                                                    x1={`${x1}%`}
                                                    y1={y1}
                                                    x2={`${x2}%`}
                                                    y2={y2}
                                                    stroke="#fb923c"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Card style={{ minHeight: 180 }}>
                    <div className="section-title">运营提示 / 使用建议</div>
                    <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                        当前版本主要聚焦于酒店基础信息的录入、审核与发布流程。建议先完善酒店资料，再根据平台规则提交审核。
                    </Paragraph>
                    <Paragraph type="secondary">
                        后续可在此区域展示平台公告、配置指引或运营建议，帮助商户更高效地管理房态与价格。
                    </Paragraph>
                </Card>
            </Space>
        </div>
    );
}

