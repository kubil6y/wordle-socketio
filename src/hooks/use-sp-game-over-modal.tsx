import { create } from "zustand";

interface SPGameOverModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useSPGameOverModal = create<SPGameOverModalState>()((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}));
