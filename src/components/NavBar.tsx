import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import useAuthStore from '../stores/AuthStore';

const Navbar = () => {
    const token = useAuthStore(state => state.token);
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">Mi E-Commerce</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        {token && <Nav.Link as={Link} to="/products">Productos</Nav.Link>}
                        {token && <Nav.Link as={Link} to="/orders">Pedidos</Nav.Link>}
                    </Nav>
                    <Nav>
                        {token ? (
                            <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesion</Button>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Iniciar sesion</Nav.Link>
                                <Nav.Link as={Link} to="/register">Registro</Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
