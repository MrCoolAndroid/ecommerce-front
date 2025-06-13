import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const register = async (name: string, email: string, password: string, role = 'user') => {
    const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
    return response.data;
};
