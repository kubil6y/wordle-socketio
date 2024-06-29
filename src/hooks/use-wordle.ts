import { usePrevious } from "react-use";
import { create } from "zustand";

export type Language = "en" | "tur";

interface WordleState {
    width: number;
    height: number;
    language: Language;
    letters: string[];
    pastTries: string[];
    activeRowIndex: number;
    greenLetters: string[];
    yellowLetters: string[];
    notFoundLetters: string[];
    reset: () => void;
    setActiveRowIndex: (index: number) => void;
    pushLetter: (letter: string) => void;
    removeLetter: () => void;
    submitWord: () => void;
    setup: (width: number, height: number, language: Language) => void;
}

export const useWordle = create<WordleState>()((set) => ({
    width: 5,
    height: 6,
    language: "en",
    activeRowIndex: 0,
    letters: [],
    pastTries: [],
    greenLetters: [],
    yellowLetters: [],
    notFoundLetters: [],
    reset: () =>
        set({
            activeRowIndex: 0,
            letters: [],
            pastTries: [],
            greenLetters: [],
            yellowLetters: [],
            notFoundLetters: [],
        }),
    setup: (width: number, height: number, language: Language) =>
        set({
            width,
            height,
            language,
        }),
    setActiveRowIndex: (index: number) => set({ activeRowIndex: index }),
    removeLetter: () =>
        set((state) => {
            if (state.letters.length === 0) {
                return state;
            }
            const copiedLetters = [...state.letters];
            copiedLetters.pop();
            return { ...state, letters: copiedLetters };
        }),
    pushLetter: (letter: string) =>
        set((state) => {
            if (state.letters.length >= state.width) {
                return state;
            }
            const copiedLetters = [...state.letters];
            copiedLetters.push(letter);
            return { ...state, letters: copiedLetters };
        }),
    submitWord: () =>
        set((state) => {
            if (
                state.letters.length === 0 ||
                state.letters.length !== state.width
            ) {
                return state;
            }

            return {
                ...state,
                letters: [],
                activeRowIndex: state.activeRowIndex + 1,
                pastTries: [...state.pastTries, state.letters.join("")],
            };
        }),
}));

export const useHasBackspaced = () => {
    const { letters } = useWordle();
    const prevLettersLength: number = usePrevious(letters.length);
    const hasBackspaced = letters.length < prevLettersLength;
    return hasBackspaced;
};

export const useCanSubmit = () => {
    const { letters, width, height, activeRowIndex} = useWordle();
    return letters.length == width && activeRowIndex < height;
};

export const useCanType = () => {
    const { letters, width, height, activeRowIndex} = useWordle();
    return letters.length < width && activeRowIndex < height;
};

export const useCanBackspace = () => {
    const { letters } = useWordle();
    return letters.length !== 0;
};
