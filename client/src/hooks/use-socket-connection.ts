import { create } from "zustand";

interface SocketStatusState {
    isConnected: boolean;
    transport: string;
    setIsConnected: (isConnected: boolean) => void;
    setTransport: (transport: string) => void;
}

export const useSocketStatus = create<SocketStatusState>()((set) => ({
    isConnected: false,
    transport: "N/A",
    setIsConnected: (isConnected: boolean) => set({ isConnected }),
    setTransport: (transport) => set({ transport }),
}));
