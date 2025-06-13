import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Order {
    _id: string;
    userId: string;
    products: { productId: string; quantity: number }[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
}

export const createOrder = async (token: string, userId: string, productId: string, quantity: number) => {
    const response = await axios.post<Order>(`${API_URL}/orders`,
        {
            products: [{ productId, quantity }],
            userId
        }, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
};