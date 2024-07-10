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
    gameId: string;
    width: number;
    height: number;
    isAdmin: boolean;
    language: Language;
    invitationCode: string;
    secretWord: string;
    gameState: GameState;
    players: Player[];
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
        isAdmin: boolean;
        players: Player[];
    }) => void;
    setGameId: (gameId: string) => void;
    setGameState: (gameState: GameState) => void;
    setPlayersData: (players: Player[]) => void;
    reset: () => void;
}

export const useMultiWordle = create<MultiWordleState>()((set) => ({
    gameId: "",
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
                gameId: "",
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
                isAdmin: data.isAdmin,
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
