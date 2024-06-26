import { usePrevious } from "react-use";
import { create } from "zustand";

interface WordleState {
    width: number;
    height: number;
    letters: string[];
    pastTries: string[];
    activeRowIndex: number;
    greenLetters: string[];
    yellowLetters: string[];
    notFoundLetters: string[];
    reset: () => void;
    setWidthAndHeight: (width: number, height: number) => void;
    setActiveRowIndex: (index: number) => void;
    pushLetter: (letter: string) => void;
    removeLetter: () => void;
    submitWord: () => void;
}

export const useWordle = create<WordleState>()((set) => ({
    width: 5,
    height: 6,
    activeRowIndex: 0,
    letters: [],
    pastTries: [],
    greenLetters: [],
    yellowLetters: [],
    notFoundLetters: [],
    reset: () =>
        set({
            width: 5,
            height: 6,
            activeRowIndex: 0,
            letters: [],
            pastTries: [],
            greenLetters: [],
            yellowLetters: [],
            notFoundLetters: [],
        }),
    setWidthAndHeight: (width: number, height: number) =>
        set({ width, height }),
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
    const { letters, width } = useWordle();
    return letters.length == width;
};

export const useCanType = () => {
    const { letters, width } = useWordle();
    return letters.length < width;
}

export const useCanBackspace = () => {
    const { letters } = useWordle();
    return letters.length !== 0;
}
