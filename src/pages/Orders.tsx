import { useEffect, useState } from 'react';
import useOrderStore from '../stores/OrderStore';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/AuthStore';
import useToastStore from '../stores/ToastStore';
import styles from './Orders.module.css';

const Orders = () => {
    const { fetchOrders, filteredOrders, filterOrders } = useOrderStore();
    const { token } = useAuthStore();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    await fetchOrders(token);
                }
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    showToast('Permiso denegado.', 'danger');
                    navigate('/');
                }
            }
        };
        fetchData();
    }, [token, fetchOrders, navigate, showToast]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        filterOrders(value);
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className="mb-4">Panel de pedidos</h1>

            <Form.Group className="mb-3" controlId="search">
                <Form.Control
                    type="text"
                    placeholder="Buscar pedidos..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </Form.Group>

            <div className="d-flex flex-wrap gap-3">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <Card key={order._id} className={styles.orderCard}>
                            <Card.Body>
                                <Card.Title>Titulo</Card.Title>
                                <Card.Text>Total: {order.totalAmount}</Card.Text>
                                <Card.Text>Estado: {order.status}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No se encontraron pedidos.</p>
                )}
            </div>
        </div>
    );
};

export default Orders;
