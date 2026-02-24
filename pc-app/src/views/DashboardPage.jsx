import React from 'react';
import { Card, Typography, Descriptions } from 'antd';
import { useAuth } from '../modules/auth/AuthContext';

const { Title, Paragraph } = Typography;

export function DashboardPage() {
    const { user } = useAuth();

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
            </Card>
        </div>
    );
}

