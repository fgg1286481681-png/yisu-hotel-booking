import React from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { HeaderBar } from './components/layout/HeaderBar';
import { SideMenu } from './components/layout/SideMenu';
import './styles/layout.css';

const { Content } = Layout;

function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HeaderBar />
            {isAuthPage ? (
                <Content className="app-content">
                    <AppRouter />
                </Content>
            ) : (
                <Layout>
                    <SideMenu />
                    <Content className="app-content">
                        <AppRouter />
                    </Content>
                </Layout>
            )}
        </Layout>
    );
}

export default App;

