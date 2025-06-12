import { Toast, ToastContainer } from 'react-bootstrap';
import useToastStore from '../stores/ToastStore';

const GlobalToast = () => {
    const { show, message, variant, hideToast } = useToastStore();

    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast show={show} onClose={hideToast} bg={variant} delay={3000} autohide>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default GlobalToast;
