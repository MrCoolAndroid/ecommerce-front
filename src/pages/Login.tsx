import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/AuthService';
import useAuthStore from '../stores/AuthStore';
import { Form, Button, Container } from 'react-bootstrap';
import useToastStore from '../stores/ToastStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        if (token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await loginService(email, password);
            login(response.data.token, response.data.user.id);
            showToast('Inicio de sesion exitoso', 'success');
            navigate('/');
        } catch (error: any) {
            if (error) {
                if (error.code === 'ERR_NETWORK') {
                    showToast('Error al iniciar sesion. Por favor, intenta de nuevo mas tarde.', 'danger');
                    return;
                }
                if (error.response.data.error === "Validation errors") {
                    showToast('Datos invalidos. Por favor, revisa tu email y contrasena.', 'danger');
                    return;
                }
                if (error.response.data.error === "Invalid credentials") {
                    showToast('Credenciales invalidas. Por favor, revisa tu email y contrasena.', 'danger');
                    return;
                }
                else {
                    showToast('Error al iniciar sesion. Por favor, intenta de nuevo.', 'danger');
                    return;
                }
            }
            else {
                showToast('Error al iniciar sesion. Por favor, intenta de nuevo.', 'danger');
                return;
            }
        }
    };

    return (
        <Container className="mt-5">
            <h2>Iniciar Sesion</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label>Contrasena</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">Ingresar</Button>
            </Form>
        </Container>
    );
};

export default Login;
