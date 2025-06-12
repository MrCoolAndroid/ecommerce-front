import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/AuthStore';
import './Home.module.css';

// Utilizar los modules
const Home = () => {
    const { token } = useAuthStore();
    
    return (
        <Container className="mt-5 text-center">
            <h1>Bienvenido a Mi E-Commerce</h1>
            <p>Gestion de productos, usuarios y pedidos con autenticacion y control de acceso.</p>
            {token ? (
                <p className="mt-4">Estas autenticado. Puedes ir al <Link to="/dashboard">Dashboard</Link>.</p>
            ) : (
                    <div className="mt-4">
                        <Link to="/login">
                            <Button variant="primary" className="me-3">Iniciar Sesion</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="success">Registrarse</Button>
                        </Link>
                </div>
            )
            }
        </Container>
    );
};

export default Home;
