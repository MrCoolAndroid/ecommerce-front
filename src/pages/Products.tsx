import { useEffect, useState } from 'react';
import useProductStore from '../stores/ProductStore';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createProduct, editProduct, deleteProduct } from '../services/ProductService';
import useAuthStore from '../stores/AuthStore';
import useToastStore from '../stores/ToastStore';
import styles from './Products.module.css';

const Products = () => {
    const { fetchProducts, filteredProducts, filterProducts } = useProductStore();

    const [search, setSearch] = useState('');
    const { token } = useAuthStore();
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    const [productId, setProductId] = useState<string>('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [stock, setStock] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    await fetchProducts(token);
                }
            } catch (error: any) {
                if (error.response && error.response.status === 401 || error.response.status === 403) {
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

    const handleCreateSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            let Product;
            Product = {
                name,
                description,
                category,
                price,
                image,
                stock
            };
            if (token) {
                await createProduct(token, Product);
                fetchProducts(token);
            }
            showToast('Producto creado exitosamente.', 'success');
            handleCloseCreationModal();
        }
        catch (error: any) {
            if (error.response && error.response.status === 400) {
                showToast('Error al crear el producto. Por favor, revisa los datos e intenta de nuevo.', 'danger');
            } else {
                showToast('Error al crear el producto. Por favor, intenta de nuevo.', 'danger');
            }
        }
    };

    const handleEditSubmit = async (productId: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setProductId(productId);
        setName(filteredProducts.find(product => product._id === productId)?.name || '');
        setDescription(filteredProducts.find(product => product._id === productId)?.description || '');
        setCategory(filteredProducts.find(product => product._id === productId)?.category || '');
        setPrice(filteredProducts.find(product => product._id === productId)?.price || 0);
        setImage(filteredProducts.find(product => product._id === productId)?.image || '');
        setStock(filteredProducts.find(product => product._id === productId)?.stock || 0);
        handleShowEditModal();
    };

    const handleEditForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            let Product;
            Product = {
                name,
                description,
                category,
                price,
                image,
                stock
            };
            if (token) {
                await editProduct(token, productId, Product);
                fetchProducts(token);
            }
            showToast('Producto editado exitosamente.', 'success');
            handleCloseEditModal();
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                showToast('Error al editar el producto. Por favor, revisa los datos e intenta de nuevo.', 'danger');
            } else {
                showToast('Error al editar el producto. Por favor, intenta de nuevo.', 'danger');
            }
        }
    };

    const handleDelete = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            if (token) {
                await deleteProduct(token, productId);
                fetchProducts(token);
            }
            showToast('Producto eliminado exitosamente.', 'success');
            handleCloseDeleteModal();
        } catch (error: any) {
            showToast('Error al eliminar el producto. Por favor, intenta de nuevo.', 'danger');
        }
    };

    const [showCreationModal, setShowCreationModal] = useState(false);

    const handleCloseCreationModal = () => setShowCreationModal(false);
    const handleShowCreationModal = () => setShowCreationModal(true);

    const [showEditModal, setShowEditModal] = useState(false);

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setProductId('');
        setName('');
        setDescription('');
        setCategory('');
        setPrice(0);
        setImage('');
        setStock(0);
    };
    const handleShowEditModal = () => setShowEditModal(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleShowDeleteModal = (productId: string) => {
        setProductId(productId);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

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
                            <Card.Header>
                                <Card.Title className="fs-2">{product.name}</Card.Title>
                                <Card.Img variant="right" src={product.image} />
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>Precio: ${product.price}</Card.Text>
                                <Card.Text>Stock: {product.stock}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="primary" onClick={(e) => handleEditSubmit(product._id, e)} className="me-2">Editar</Button>
                                <Button variant="danger" onClick={() => handleShowDeleteModal(product._id)} className="me-2">Eliminar</Button>
                            </Card.Footer>
                        </Card>
                    ))
                ) : (
                    <p>No se encontraron productos.</p>
                )}
                <Card className={styles.productCard}>
                    <Card.Body className={styles.productAdd} onClick={handleShowCreationModal}>
                        <Card.Title className="fs-2">Nuevo Producto</Card.Title>
                        <br></br>
                        <h1 className="fs-1">+</h1>
                    </Card.Body>
                </Card>
            </div>

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Rellena los datos para editar el producto
                    <br />
                    <br />
                    <Form onSubmit={handleEditForm}>
                        <Form.Group className="mb-3" controlId="formProduct">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre del producto" value={name} onChange={(e) => setName(e.target.value)} required />
                            <Form.Text>Debe ser un nombre unico</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control type="text" placeholder="Descripcion del producto" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCategory">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control type="text" placeholder="Categoria del producto" value={category} onChange={(e) => setCategory(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" placeholder="Precio del producto" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                            <Form.Text>No debe ser un numero negativo</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formImage">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control type="text" placeholder="URL de la imagen" value={image} onChange={(e) => setImage(e.target.value)} required />
                            <Form.Text>Debe ser una URL valida</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
                            <Form.Text>No debe ser un numero negativo</Form.Text>
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEditModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" type="submit">
                                Editar Producto
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showCreationModal} onHide={handleCloseCreationModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear un nuevo producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Rellena los datos para crear un nuevo producto
                    <br />
                    <br />
                    <Form onSubmit={handleCreateSubmit}>
                        <Form.Group className="mb-3" controlId="formProduct">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre del producto" value={name} onChange={(e) => setName(e.target.value)} required />
                            <Form.Text>Debe ser un nombre unico</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control type="text" placeholder="Descripcion del producto" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCategory">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control type="text" placeholder="Categoria del producto" value={category} onChange={(e) => setCategory(e.target.value)} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" placeholder="Precio del producto" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                            <Form.Text>No debe ser un numero negativo</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formImage">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control type="text" placeholder="URL de la imagen" value={image} onChange={(e) => setImage(e.target.value)} required />
                            <Form.Text>Debe ser una URL valida</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
                            <Form.Text>No debe ser un numero negativo</Form.Text>
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreationModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" type="submit">
                                Crear Producto
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Seguro que deseas eliminar este producto?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Esta accion es irreversible
                    <br />
                    <br />
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Eliminar Producto
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Products;
