import { create } from "zustand";

interface NewGameModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useNewGameModal = create<NewGameModalState>()((set) => ({
    isOpen: true,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}));
