import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import GlobalToast from './components/GlobalToast';
import useToastStore from './stores/ToastStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useAuthStore from './stores/AuthStore';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const { token, logout } = useAuthStore();
    const showToast = useToastStore((state) => state.showToast);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const isExpired = (() => {
                try {
                    const { exp } = jwtDecode<{ exp: number }>(token);
                    return Date.now() >= exp * 1000;
                } catch {
                    return true;
                }
            })();

            if (isExpired) {
                logout();
                navigate('/login', { replace: true });
                showToast('Sesión expirada. Por favor, inicia sesión de nuevo.', 'warning');
            }
        }
    }, [token, logout, navigate]);
    return (
        <>
            <NavBar />
            <GlobalToast />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            </Routes>
        </>
    );
}

export default App;

