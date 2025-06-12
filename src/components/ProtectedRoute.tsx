import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/AuthStore';

const ProtectedRoute = ({ children }: any) => {
    const { token } = useAuthStore();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
