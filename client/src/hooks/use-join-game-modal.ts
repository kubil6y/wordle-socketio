import { create } from "zustand";

interface JoinGameModalState {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export const useJoinGameModal = create<JoinGameModalState>()((set) => ({
    isOpen: false,
    open: () => set(() => ({ isOpen: true })),
    close: () => set(() => ({ isOpen: false })),
}));
