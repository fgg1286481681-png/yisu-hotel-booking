import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    FormOutlined,
    AuditOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';

const { Sider } = Layout;

export function SideMenu() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAdmin = useMemo(() => user?.role === 'admin', [user]);

    const menuItems = useMemo(() => {
        if (!isAuthenticated) {
            // 未登录时仅展示一个占位菜单，主要用于保持布局
            return [
                {
                    key: '/dashboard',
                    icon: <DashboardOutlined />,
                    label: '概览'
                }
            ];
        }

        const items = [
            {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: '概览'
            },
            {
                key: '/hotels/form',
                icon: <FormOutlined />,
                label: '酒店信息录入 / 维护'
            }
        ];

        if (isAdmin) {
            items.push({
                key: '/hotels/review',
                icon: <AuditOutlined />,
                label: '酒店审核 / 发布 / 下线'
            });
        }

        return items;
    }, [isAuthenticated, isAdmin]);

    const handleClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Sider
            width={220}
            style={{
                background: '#001529',
                borderRight: '1px solid rgba(15, 23, 42, 0.35)'
            }}
            breakpoint="lg"
            collapsedWidth={64}
        >
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleClick}
                style={{ marginTop: 8 }}
            />
        </Sider>
    );
}

