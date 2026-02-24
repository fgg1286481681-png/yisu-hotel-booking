import React, { useMemo } from 'react';
import { Card, Typography, Descriptions, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';

const { Title, Paragraph } = Typography;

export function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = useMemo(() => user?.role === 'admin', [user]);

    return (
        <div className="page-wrapper">
            <Card>
                <Title level={3}>概览</Title>
                <Paragraph>
                    欢迎来到易宿酒店信息管理后台。这里可以根据后续需求扩展为房型管理、订单管理、统计报表等模块。
                </Paragraph>
                <Descriptions title="当前登录信息" bordered column={1} size="small">
                    <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
                    <Descriptions.Item label="角色">{user?.role}</Descriptions.Item>
                    <Descriptions.Item label="昵称">
                        {user?.displayName || '-'}
                    </Descriptions.Item>
                </Descriptions>
                <div style={{ marginTop: 24 }}>
                    <Title level={4} style={{ marginBottom: 12 }}>
                        快速入口
                    </Title>
                    <Space wrap>
                        <Button
                            type="primary"
                            onClick={() => navigate('/hotels/form')}
                        >
                            {isAdmin ? '酒店基础信息维护' : '酒店信息录入 / 编辑'}
                        </Button>
                        {isAdmin && (
                            <Button onClick={() => navigate('/hotels/review')}>
                                酒店信息审核 / 发布 / 下线
                            </Button>
                        )}
                    </Space>
                </div>
            </Card>
        </div>
    );
}

