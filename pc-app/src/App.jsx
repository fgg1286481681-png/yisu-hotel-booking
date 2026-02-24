import { Layout } from 'antd';
import { AppRouter } from './routes/AppRouter';
import { HeaderBar } from './components/layout/HeaderBar';
import './styles/layout.css';

const { Content } = Layout;

function App() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <HeaderBar />
            <Content className="app-content">
                <AppRouter />
            </Content>
        </Layout>
    );
}

export default App;

