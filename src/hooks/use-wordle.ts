import { usePrevious } from "react-use";
import { create } from "zustand";

export type Language = "en" | "tr";

export type LetterData = {
    index: number;
    color: string;
    letter: string;
};

interface WordleState {
    width: number;
    height: number;
    active: boolean;
    language: Language;
    secretWord: string; // TODO
    letters: string[];
    pastTries: string[];
    activeRowIndex: number;
    coloredLetters: LetterData[];
    notFoundLetters: string[];
    resetAll: () => void;
    clearLetters: () => void;
    pushLetter: (letter: string) => void;
    removeLetter: () => void;
    submitWord: () => void;
    setConfig: (config: {
        width: number;
        height: number;
        language: Language;
        secretWord: string;
    }) => void;
    setData: (data: {
        coloredLetters: LetterData[];
        notFoundLetters: string[];
        pastTries: string[];
        activeRowIndex: number;
    }) => void;
}

export const useWordle = create<WordleState>()((set) => ({
    width: 5,
    height: 6,
    active: false,
    secretWord: "",
    language: "en",
    activeRowIndex: 0,
    letters: [],
    pastTries: [],
    coloredLetters: [],
    notFoundLetters: [],
    resetAll: () =>
        set({
            activeRowIndex: 0,
            active: false,
            letters: [],
            pastTries: [],
            coloredLetters: [],
            notFoundLetters: [],
        }),
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
                activeRowIndex: state.activeRowIndex + 1,
                pastTries: [...state.pastTries, state.letters.join("")],
            };
        }),
    setData: (data) =>
        set((state) => ({
            ...state,
            ...data,
        })),
    clearLetters: () => set({ letters: [] }),
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
    const { letters } = useWordle();
    return letters.length !== 0;
};
