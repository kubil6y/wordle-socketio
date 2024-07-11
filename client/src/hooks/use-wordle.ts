import { usePrevious } from "react-use";
import { create } from "zustand";

export const DEFAULT_GAME_WIDTH = 5;
export const DEFAULT_GAME_HEIGHT = 6;
export const DEFAULT_LANGUAGE: Language = "tr";
export type Language = "en" | "tr";
export type LetterColor = "green" | "yellow" | "black";
export type LetterCellColor = LetterColor | "none";

interface WordleState {
    width: number;
    height: number;
    active: boolean;
    success: boolean;
    language: Language;
    secretWord: string;
    activeRowIndex: number;
    letters: string[];
    pastTries: string[];
    pastTryResults: LetterColor[][];
    duration: string;
    setActive: (active: boolean) => void;
    reset: () => void;
    clearLetters: () => void;
    pushLetter: (letter: string) => void;
    removeLetter: () => void;
    submitWord: () => void;
    setGameOver: (data: {
        success: boolean;
        duration: string;
        secretWord: string;
    }) => void;
    setConfig: (config: {
        width: number;
        height: number;
        language: Language;
        secretWord: string;
    }) => void;
    setData: (data: {
        active: boolean;
        pastTries: string[];
        pastTryResults: LetterColor[][],
        activeRowIndex: number;
    }) => void;
}

export const useWordle = create<WordleState>()((set) => ({
    width: DEFAULT_GAME_WIDTH,
    height: DEFAULT_GAME_HEIGHT,
    success: false,
    active: false,
    secretWord: "",
    language: DEFAULT_LANGUAGE,
    activeRowIndex: 0,
    duration: "",
    letters: [],
    pastTries: [],
    pastTryResults: [],
    reset: () =>
        set((state) => ({
            activeRowIndex: 0,
            success: false,
            active: false,
            language: state.language,
            duration: "",
            secretWord: "",
            letters: [],
            pastTries: [],
            pastTryResults: [],
        })),
    setConfig: ({ width, height, secretWord, language }) =>
        set({
            width,
            height,
            secretWord,
            language,
            active: true,
        }),
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
                pastTries: [...state.pastTries, state.letters.join("")],
            };
        }),
    setData: ({ active, activeRowIndex, pastTries, pastTryResults}) =>
        set((state) => ({
            ...state,
            active,
            pastTries,
            pastTryResults,
            activeRowIndex,
        })),
    clearLetters: () => set({ letters: [] }),
    setGameOver: ({ success, duration, secretWord }) =>
        set({ active: false, duration, secretWord, success }),
    setActive: (active: boolean) => set({ active }),
}));

export const useHasBackspaced = () => {
    const { letters } = useWordle();
    const prevLettersLength: number = usePrevious(letters.length);
    const hasBackspaced = letters.length < prevLettersLength;
    return hasBackspaced;
};

export const useCanSubmit = () => {
    const { letters, width, height, activeRowIndex, active } = useWordle();
    return letters.length == width && activeRowIndex < height && active;
};

export const useCanType = () => {
    const { letters, width, height, activeRowIndex, active } = useWordle();
    return letters.length < width && activeRowIndex < height && active;
};

export const useCanBackspace = () => {
    const { letters, active } = useWordle();
    return letters.length !== 0 && active;
};
