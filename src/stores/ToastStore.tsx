import { create } from 'zustand';

interface ToastState {
    show: boolean;
    message: string;
    variant: 'success' | 'danger' | 'warning' | 'info';
    showToast: (message: string, variant?: 'success' | 'danger' | 'warning' | 'info') => void;
    hideToast: () => void;
}

const useToastStore = create<ToastState>((set) => ({
    show: false,
    message: '',
    variant: 'success',

    showToast: (message, variant = 'success') => set({ show: true, message, variant }),
    hideToast: () => set({ show: false }),
}));

export default useToastStore;
