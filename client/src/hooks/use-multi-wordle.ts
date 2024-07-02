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

interface WordleState {
    isAdmin: boolean;
    invitationCode: string;
    gameState: GameState;
    setIsAdmin: (isAdmin: boolean) => void;
    setInvitationCode: (code: string) => void;
    setGameState: (gameState: GameState) => void;
    reset: () => void;
}

export const useMultiWordle = create<WordleState>()((set) => ({
    isAdmin: false,
    invitationCode: "",
    gameState: GameState.WaitingToStart,
    setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
    setGameState: (gameState: GameState) => set({ gameState }),
    setInvitationCode: (invitationCode: string) => set({ invitationCode }),
    reset: () =>
        set((state) => {
            return state;
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
