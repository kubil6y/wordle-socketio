import { create } from "zustand";

interface MPGameOverModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useMPGameOverModal = create<MPGameOverModalState>()((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}));
