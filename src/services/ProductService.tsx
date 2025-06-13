import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
}

export const createProduct = async (token: string, productData: Omit<Product, '_id'>) => {
    const response = await axios.post<Product>(`${API_URL}/products`, productData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
};

export const editProduct = async (token: string, productId: string, productData: Partial<Omit<Product, '_id'>>) => {
    const response = await axios.put<Product>(`${API_URL}/products/${productId}`, productData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
}

export const deleteProduct = async (token: string, productId: string) => {
    const response = await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
};
