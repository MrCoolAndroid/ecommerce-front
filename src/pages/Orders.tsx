import { useEffect, useState } from 'react';
import useOrderStore from '../stores/OrderStore';
import useProductStore from '../stores/ProductStore';
import { createOrder } from '../services/OrderService';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/AuthStore';
import useToastStore from '../stores/ToastStore';
import styles from './Orders.module.css';

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
}

const Orders = () => {
    const { fetchOrders, filteredOrders, filterOrders } = useOrderStore();
    const { fetchProducts, products: productsArray } = useProductStore();
    const { token, userId } = useAuthStore();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    const [products, setProducts] = useState(Array<Product>);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    await fetchOrders(token);
                }
            } catch (error: any) {
                if (error.response && error.response.status === 401 || error.response.status === 403) {
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

    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setSelectedProductId('');
        setQuantity(1);
    };
    const handleShowCreateModal = async () => {
        try {
            if (token) {
                await fetchProducts(token);
                setShowCreateModal(true);
            }
        }
        catch (error: any) {
            if (error.response && error.response.status === 401 || error.response.status === 403) {
                showToast('Permiso denegado.', 'danger');
            }
        }
    };

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setProducts([]);
        setTotalAmount(0);
        setStatus('');
    };
    const handleShowDetailsModal = async (orderId: string) => {
        try {
            if (token) {
                await fetchProducts(token);
                let newProducts = new Array();
                filteredOrders.find((x) => x._id == orderId)?.products.map(async (product) => {
                    const productData = productsArray.find((p) => p._id === product.productId);
                    if (productData) {
                        newProducts.push(productData);
                    }
                });
                if (newProducts.length === 0) {
                    showToast('No se encontraron productos para este pedido.', 'warning');
                }
                else {
                    setProducts(newProducts);
                }
                setTotalAmount(filteredOrders.find((x) => x._id == orderId)?.totalAmount || 0);
                setStatus(filteredOrders.find((x) => x._id == orderId)?.status || '');
            }
            setShowDetailsModal(true);
        }
        catch (error: any) {
            if (error.response && error.response.status === 401 || error.response.status === 403) {
                showToast('Permiso denegado.', 'danger');
            }
        }
    };

    const handleCreation = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (token && userId) {
            try {
                await createOrder(token, userId, selectedProductId, quantity);
                showToast('Pedido creado con exito.', 'success');
                handleCloseCreateModal();
                await fetchOrders(token);
            } catch (error: any) {
                if (error.response.status === 400) {
                    showToast('Error al crear el pedido, hay suficiente stock?', 'danger');
                }
                else {
                    showToast('Error al crear el pedido.', 'danger');
                }
            }
        }
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
                            <Card.Header>
                                <Card.Title className="fs-2">Pedido {filteredOrders.indexOf(order) + 1}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>Productos: {order.products.length}</Card.Text>
                                <Card.Text>Total: {order.totalAmount}</Card.Text>
                                <Card.Text>Estado: {order.status}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button onClick={() => handleShowDetailsModal(order._id)}>Ver detalles</Button>
                            </Card.Footer>
                        </Card>
                    ))
                ) : (
                    <p>No se encontraron pedidos.</p>
                )}
                <Card className={styles.orderCard}>
                    <Card.Body className={styles.orderAdd} onClick={handleShowCreateModal}>
                        <Card.Title className="fs-2">Nuevo Pedido</Card.Title>
                        <br></br>
                        <h1 className="fs-1">+</h1>
                    </Card.Body>
                </Card>
            </div>

            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear un nuevo pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Rellena los datos para crear un nuevo pedido
                    <br />
                    <br />
                    <Form onSubmit={handleCreation}>
                        <Form.Group className="mb-3" controlId="formProduct">
                            <Form.Label>Producto</Form.Label>
                            <Form.Select value={selectedProductId}
                                         onChange={(e) => setSelectedProductId(e.target.value)} required>
                                <option value="">Selecciona un producto</option>
                                {productsArray.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name} - ${product.price} - {product.stock} en stock
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Cantidad"
                                required
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreateModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" type="submit">
                                Crear Pedido
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Productos:</h4>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="mb-3">
                                <h5>{product.name}</h5>
                                <p>{product.description}</p>
                                <p>Precio: ${product.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron productos para este pedido.</p>
                    )}
                    <h4>Total: ${totalAmount}</h4>
                    <h4>Estado: {status}</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseDetailsModal}>
                        Okay
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Orders;
