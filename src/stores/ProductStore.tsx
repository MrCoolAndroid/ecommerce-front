import { create } from 'zustand';
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
}

interface ProductState {
    products: Product[];
    filteredProducts: Product[];
    fetchProducts: (token: string) => Promise<void>;
    filterProducts: (searchTerm: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useProductStore = create<ProductState>((set) => ({
    products: [],
    filteredProducts: [],

    fetchProducts: async (token: string) => {
        const response = await axios.get<Product[]>(`${API_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        set({ products: response.data.data, filteredProducts: response.data.data });
    },

    filterProducts: (searchTerm: string) => {
        set((state) => ({
            filteredProducts: state.products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }));
    }
}));

export default useProductStore;
