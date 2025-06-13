import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    userId?: string;
    login: (token: string, userId: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            userId: undefined,

            login: (token: string, userId: string) => {
                set({ token });
                set({ userId });
            },

            logout: () => {
                set({ token: null });
                set({ userId: undefined });
            },
        }),
        {
            name: 'auth',
        }
    )
);

export default useAuthStore;

