import { create } from "zustand";

interface ConnectedUserCountState {
    count: number;
    setCount: (count: number) => void;
}

export const useConnectedUserCount = create<ConnectedUserCountState>()((set) => ({
    count: 0,
    setCount: (count: number) => set({ count }),
}));
