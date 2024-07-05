import { createId } from "@paralleldrive/cuid2";
import { MultiGames } from "../socket/games";
import { Language } from "../wordle";
import { Words } from "../words";
import { Player } from "./player";

export const TURN_DURATION = 1000; // 1m

enum GameState {
    WaitingToStart,
    GamePlaying,
    GameEnd,
}

enum RoundState {
    RoundPlaying,
    RoundEnd,
}

export class MultiWordle {
    private _id: string;
    private _ownerSessionId: string;
    private _language: Language;
    private _words: Words;
    private _gameState: GameState;
    private _invitationCode: string;
    private _games: MultiGames;

    private _players: Player[];
    private _spectators: Player[];

    public constructor(
        games: MultiGames,
        ownerSessionId: string,
        words: Words,
        language: Language
    ) {
        this._id = createId();
        this._gameState = GameState.WaitingToStart;
        this._invitationCode = createId();
        this._ownerSessionId = ownerSessionId;
        this._language = language;
        this._words = words;
        this._games = games;
        this._players = [];
        this._spectators = [];
    }

    public getId(): string {
        return this._id;
    }

    public getOwnerSessionId(): string {
        return this._ownerSessionId;
    }

    public isOwner(sessionId: string): boolean {
        return this._ownerSessionId === sessionId;
    }

    public getGameState(): GameState {
        return this._gameState;
    }

    public getInvitationCode(): string {
        return this._invitationCode;
    }

    public getGameStateToString(): string {
        switch (this._gameState) {
            case GameState.WaitingToStart:
                return "waiting_to_start";
            case GameState.GamePlaying:
                return "game_playing";
            case GameState.GameEnd:
                return "game_end";
            default:
                return "unknown_state";
        }
    }

    public generateNewInvitationCode(): void {
        const newCode = createId();
        this._games.updateInvitationCode(this.getId(), newCode);
        this._invitationCode = newCode;
    }

    public startGame(): void {
        this._gameState = GameState.GamePlaying;
    }

    public endGame(): void {
        this._gameState = GameState.GameEnd;
    }

    public setState(gameState: GameState): void {
        this._gameState = gameState;
    }

    public isPlaying(): boolean {
        return this._gameState === GameState.GamePlaying;
    }
    public isEnded(): boolean {
        return this._gameState === GameState.GameEnd;
    }
    public isWaitingToStart(): boolean {
        return this._gameState === GameState.WaitingToStart;
    }

    public tick(): void {
        // TODO!
    }
}
