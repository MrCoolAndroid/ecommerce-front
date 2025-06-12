import { create } from 'zustand';

interface AuthState {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token') || null,

    login: (token: string) => {
        localStorage.setItem('token', token);
        set({ token });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ token: null });
    }
}));

export default useAuthStore;
