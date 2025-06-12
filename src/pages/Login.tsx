import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/AuthService';
import useAuthStore from '../stores/authStore';
import { Form, Button, Container } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const { token } = await loginService(email, password);
            login(token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            // Tirar error distinto dependiendo del status code (usar un toast)
            //alert('Credenciales inválidas');
            alert('Error: ' + error);
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
