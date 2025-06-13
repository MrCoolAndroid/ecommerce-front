import { create } from 'zustand';
import axios from 'axios';

interface Product {
    productId: string;
    quantity: number;
}

interface Order {
    _id: string;
    userId: string;
    products: Product[];
    totalAmount: number;
    status: string;
}

interface OrderState {
    orders: Order[];
    filteredOrders: Order[];
    fetchOrders: (token: string) => Promise<void>;
    filterOrders: (searchTerm: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    filteredOrders: [],

    fetchOrders: async (token: string) => {
        const response = await axios.get(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        set({ orders: response.data.data, filteredOrders: response.data.data });
    },

    filterOrders: (searchTerm: string) => {
        set((state) => ({
            filteredOrders: state.orders.filter((order) =>
                order.status.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }));
    }
}));

export default useOrderStore;
