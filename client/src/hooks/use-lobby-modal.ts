import { create } from "zustand";

interface LobbyModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useLobbyModal = create<LobbyModalState>()((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}));
