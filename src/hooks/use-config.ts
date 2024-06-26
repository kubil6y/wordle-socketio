import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ConfigState {
    sound: boolean;
    soundOn: () => void;
    soundOff: () => void;
}

export const useConfig = create<ConfigState>()(
    persist(
        (set, get) => ({
            sound: true,
            soundOn: () => set({ sound: true }),
            soundOff: () => set({ sound: false }),
        }),
        {
            name: "kb_wordle:config", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
