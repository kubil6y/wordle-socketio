import { create } from "zustand";

interface HowToPlayModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useHowToPlayModal = create<HowToPlayModalState>()((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}));
