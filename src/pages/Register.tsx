import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerService } from '../services/AuthService';
import useAuthStore from '../stores/AuthStore';
import { Form, Button, Container } from 'react-bootstrap';
import useToastStore from '../stores/ToastStore';

const Register = () => {
    const [name, setName] = useState('');
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
            const response = await registerService(name, email, password);
            login(response.data.token);
            showToast('Registro exitoso', 'success');
            navigate('/');
        } catch (error : any) {
            if (error.response.data.error === "E-mail already registered") {
                showToast('El e-mail ingresado ya esta en uso.', 'danger');
            }
            else if (error.response.data.error === "Validation errors") {
                showToast('Datos invalidos. Por favor, revisa tus datos e intenta de nuevo.', 'danger');
            }
            else {
                showToast('Error al iniciar sesion. Por favor, intenta de nuevo.', 'danger');
            }
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

                <Form.Group controlId="formBasicEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Form.Text>Debe ser un e-mail valido.</Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label>Contrasena</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Form.Text>Debe contener un minimo de 6 caracteres.</Form.Text>
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
