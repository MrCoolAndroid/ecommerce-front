import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './NoMatch.module.css';

const NoMatch = () => {
    const navigate = useNavigate();

    return (
        <Container className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.message}>Oops! Pagina no encontrada.</p>
            <Button variant="primary" onClick={() => navigate('/')}>
                Volver al inicio
            </Button>
        </Container>
    );
};

export default NoMatch;
