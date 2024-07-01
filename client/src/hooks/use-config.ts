import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ConfigState {
    volume: number;
    setVolume: (volume: number) => void;
}

export const useConfig = create<ConfigState>()(
    persist(
        (set, get) => ({
            volume: 0.2,
            setVolume: (volume: number) => set({ volume }),
        }),
        {
            name: "kb_wordle:config", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
