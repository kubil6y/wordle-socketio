import { create } from "zustand";
import {
    DEFAULT_GAME_HEIGHT,
    DEFAULT_GAME_WIDTH,
    DEFAULT_LANGUAGE,
    Language,
} from "./use-wordle";

export const gameStates = {
    waiting_to_start: "waiting_to_start",
    game_playing: "game_playing",
    game_end: "game_end",
    unknown_state: "unknown_state",
};

export enum GameState {
    Unknown,
    WaitingToStart,
    GamePlaying,
    GameEnd,
}

type Player = {
    sessionId: string;
    username: string;
    avatarId: string;
    score: number;
    isAdmin: boolean;
};

interface MultiWordleState {
    width: number;
    height: number;
    isAdmin: boolean;
    language: Language;
    invitationCode: string;
    secretWord: string;
    gameState: GameState;
    players: Player[];
    setIsAdmin: (isAdmin: boolean) => void;
    setInvitationCode: (code: string) => void;
    setGameState: (gameState: GameState) => void;
    setConfig: (config: {
        width: number;
        height: number;
        secretWord: string;
        language: Language;
        isAdmin: boolean;
        invitationCode: string;
        gameState: string;
        players: Player[];
    }) => void;
    reset: () => void;
}

export const useMultiWordle = create<MultiWordleState>()((set) => ({
    width: DEFAULT_GAME_WIDTH,
    height: DEFAULT_GAME_HEIGHT,
    language: DEFAULT_LANGUAGE,
    success: false,
    isAdmin: false,
    invitationCode: "",
    secretWord: "",
    gameState: GameState.WaitingToStart,
    players: [],
    setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
    setGameState: (gameState: GameState) => set({ gameState }),
    setInvitationCode: (invitationCode: string) => set({ invitationCode }),
    reset: () =>
        set((state) => {
            return state;
        }),
    setConfig: (config) =>
        set((state) => {
            return {
                ...state,
                gameState: convertGameStateStringToEnum(config.gameState),
                width: config.width,
                height: config.height,
                secretWord: config.secretWord,
                language: config.language,
                isAdmin: config.isAdmin,
                invitationCode: config.invitationCode,
                players: config.players,
            };
        }),
}));

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
