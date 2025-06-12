import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerService } from '../services/AuthService';
import useAuthStore from '../stores/authStore';
import { Form, Button, Container } from 'react-bootstrap';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const { token } = await registerService(name, email, password);
            login(token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al registrarse:', error);
            // Tirar error distinto dependiendo del status code (usar un toast) y validar datos
            alert('Error: ' + error);
        }
    };

    return (
        <Container className="mt-5">
            <h2>Registro</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label>Contrasena</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <Button variant="success" type="submit" className="mt-4">Registrarse</Button>
            </Form>

            <p className="mt-3">
                Ya tenes una cuenta? <Link to="/login">Iniciar Sesion</Link>
            </p>
        </Container>
    );
};

export default Register;
