import { usePrevious } from "react-use";
import {
    DEFAULT_GAME_HEIGHT,
    DEFAULT_GAME_WIDTH,
    DEFAULT_LANGUAGE,
    Language,
    LetterColor,
} from "./use-wordle";
import { create } from "zustand";

export const gameStates = {
    waiting_to_start: "waiting_to_start",
    game_playing: "game_playing",
    game_end: "game_end",
    unknown_state: "unknown_state",
};

export enum GameState {
    Unknown = "Unknown",
    WaitingToStart = "WaitingToStart",
    GamePlaying = "GamePlaying",
    GameEnd = "GameEnd",
}

export type Player = {
    sessionId: string;
    username: string;
    avatarId: string;
    score: number;
    isAdmin: boolean;
};

interface MultiWordleState {
    gameId: string;
    width: number;
    height: number;
    isAdmin: boolean;
    language: Language;
    invitationCode: string;
    secretWord: string;
    gameState: GameState;
    players: Player[];

    // new additions
    success: boolean;
    isOwnTurn: boolean;
    activeRowIndex: number;
    letters: string[];
    pastTries: string[];
    pastTryResults: LetterColor[][];
    duration: string;

    pushLetter: (letter: string) => void;
    clearLetters: () => void;
    removeLetter: () => void;

    setLobbyData: (data: {
        gameId: string;
        isAdmin: boolean;
        language: Language;
        gameState: string;
        invitationCode: string;
        players: Player[];
    }) => void;
    setData: (data: {
        width: number;
        height: number;
        secretWord: string;
        gameState: string;
        players: Player[];
    }) => void;
    setGameId: (gameId: string) => void;
    setGameState: (gameState: GameState) => void;
    setPlayersData: (players: Player[]) => void;
    reset: () => void;
}

export const useMultiWordle = create<MultiWordleState>()((set) => ({
    success: false,
    isOwnTurn: false, // must be calculated!
    activeRowIndex: 0,
    letters: [],
    pastTries: [],
    pastTryResults: [],
    duration: "",
    //
    gameId: "",
    width: DEFAULT_GAME_WIDTH,
    height: DEFAULT_GAME_HEIGHT,
    language: DEFAULT_LANGUAGE,
    isAdmin: false,
    invitationCode: "",
    secretWord: "",
    gameState: GameState.WaitingToStart,
    players: [],
    reset: () =>
        set((state) => {
            // TODO
            return {
                ...state,
                gameId: "",
                width: DEFAULT_GAME_WIDTH,
                height: DEFAULT_GAME_HEIGHT,
                language: DEFAULT_LANGUAGE,
                isAdmin: false,
                invitationCode: "",
                secretWord: "",
                players: [],
                success: false,
                isOwnTurn: false,
                activeRowIndex: 0,
                letters: [],
                pastTries: [],
                pastTryResults: [],
                duration: "",
            };
        }),
    setGameId: (gameId: string) => set({ gameId }),
    setGameState: (gameState) => set({ gameState }),
    setPlayersData: (players) => set({ players }),
    setData: (data) =>
        set((state) => {
            return {
                ...state,
                width: data.width,
                height: data.height,
                secretWord: data.secretWord,
                gameState: convertGameStateStringToEnum(data.gameState),
                players: data.players,
            };
        }),
    setLobbyData: (data) =>
        set((state) => ({
            ...state,
            gameId: data.gameId,
            gameState: convertGameStateStringToEnum(data.gameState),
            language: data.language,
            isAdmin: data.isAdmin,
            players: data.players,
            invitationCode: data.invitationCode,
        })),

    // new additions
    pushLetter: (letter: string) =>
        set((state) => {
            if (state.letters.length >= state.width) {
                return state;
            }
            const copiedLetters = [...state.letters];
            copiedLetters.push(letter);
            return { ...state, letters: copiedLetters };
        }),
    clearLetters: () => set({ letters: [] }),
    removeLetter: () =>
        set((state) => {
            if (state.letters.length === 0) {
                return state;
            }
            const copiedLetters = [...state.letters];
            copiedLetters.pop();
            return { ...state, letters: copiedLetters };
        }),
}));

export const useMPHasBackspaced = () => {
    const { letters } = useMultiWordle();
    const prevLettersLength: number = usePrevious(letters.length);
    const hasBackspaced = letters.length < prevLettersLength;
    return hasBackspaced;
};

export const useMPCanSubmit = () => {
    const { letters, width, height, activeRowIndex, isOwnTurn, gameState } =
        useMultiWordle();
    return (
        letters.length == width &&
        activeRowIndex < height &&
        isOwnTurn &&
        gameState === GameState.GamePlaying
    );
};

export const useMPCanType = () => {
    const { letters, width, height, activeRowIndex, isOwnTurn } =
        useMultiWordle();
    // TODO
    //return letters.length < width && activeRowIndex < height && isOwnTurn;
    return true;
};

export const useMPCanBackspace = () => {
    const { letters, isOwnTurn } = useMultiWordle();
    // TODO
    //return letters.length !== 0 && isOwnTurn;
    return true;
};

export function convertGameStateStringToEnum(gameState: string): GameState {
    switch (gameState) {
        case gameStates.waiting_to_start:
            return GameState.WaitingToStart;
        case gameStates.game_playing:
            return GameState.GamePlaying;
        case gameStates.game_end:
            return GameState.GameEnd;
        default:
            return GameState.Unknown;
    }
}
