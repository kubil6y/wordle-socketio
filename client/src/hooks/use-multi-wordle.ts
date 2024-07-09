import {
    DEFAULT_GAME_HEIGHT,
    DEFAULT_GAME_WIDTH,
    DEFAULT_LANGUAGE,
    Language,
} from "./use-wordle";
import { create } from "zustand";

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

export type Player = {
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
    setData: (config: {
        width: number;
        height: number;
        secretWord: string;
        language: Language;
        isAdmin: boolean;
        invitationCode: string;
        gameState: string;
        players: Player[];
    }) => void;
    setGameState: (gameState: GameState) => void;
    setPlayersData: (players: Player[]) => void;
    reset: () => void;
}

export const useMultiWordle = create<MultiWordleState>()((set) => ({
    hasUsedJoined: false,
    width: DEFAULT_GAME_WIDTH,
    height: DEFAULT_GAME_HEIGHT,
    language: DEFAULT_LANGUAGE,
    success: false,
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
                width: DEFAULT_GAME_WIDTH,
                height: DEFAULT_GAME_HEIGHT,
                language: DEFAULT_LANGUAGE,
                success: false,
                isAdmin: false,
                invitationCode: "",
                secretWord: "",
                players: [],
            };
        }),
    setGameState: (gameState) => set({ gameState }),
    setPlayersData: (players) => set({ players }),
    setData: (config) =>
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
