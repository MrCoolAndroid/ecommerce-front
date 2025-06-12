import { useEffect, useState } from 'react';
import useProductStore from '../stores/ProductStore';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useToastStore from '../stores/ToastStore';
import styles from './Products.module.css';

const Products = () => {
    const { fetchProducts, filteredProducts, filterProducts } = useProductStore();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProducts();
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    showToast('Permiso denegado.', 'danger');
                    navigate('/');
                }
            }
        };
        fetchData();
    }, [fetchProducts, navigate, showToast]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        filterProducts(value);
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className="mb-4">Panel de productos</h1>

            <Form.Group className="mb-3" controlId="search">
                <Form.Control
                    type="text"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </Form.Group>

            <div className="d-flex flex-wrap gap-3">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Card key={product._id} className={styles.productCard}>
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>Precio: ${product.price}</Card.Text>
                                <Card.Text>Stock: {product.stock}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
            </div>
        </div>
    );
};

export default Products;
