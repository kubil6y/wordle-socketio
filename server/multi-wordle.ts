import { createId } from "@paralleldrive/cuid2";
import { Language } from "./wordle";
import { Words } from "./words";
import { MultiGames } from "./socket/games";

const TURN_DURATION = 1000; // 1m

enum GameState {
    WaitingToStart,
    GamePlaying,
    GameEnd,
}

enum RoundState {
    RoundPlaying,
    RoundEnd,
}

class Player {
    private _sessionId: string;
    public constructor(sessionId: string) {
        this._sessionId = sessionId;
    }

    public getSessionId(): string {
        return this._sessionId;
    }
}

class Players {
    private _players: { [sessionId: string]: Player } = {};

    public findById(sessionId: string): Player | null {
        return this._players[sessionId] ?? null;
    }

    public register(sessionId: string, player: Player): void {
        this._players[sessionId] = player;
    }

    public has(sessionId: string): boolean {
        return Boolean(this._players[sessionId]);
    }

    public delete(sessionId: string): void {
        delete this._players[sessionId];
    }
}

class PlayerLobby {
    private _adminId: string;
    private _players: Player[];
    private _spectators: Player[];

    public constructor(adminId: string) {
        this._adminId = adminId; // TODO get player from this and whatever?
        this._players = [];
        this._spectators = [];
    }

    public getAdminSessionId(): string {
        return this._adminId;
    }

    public isAdmin(sessionId: string): boolean {
        return this._adminId === sessionId;
    }

    public addPlayer(player: Player): void {
        this._players.push(player);
    }

    public hasPlayer(player: Player): boolean {
        for (const p of this._players) {
            if (p.getSessionId() === player.getSessionId()) {
                return true;
            }
        }
        return false;
    }

    public getPlayers(): Player[] {
        return this._players;
    }

    public getSpectators(): Player[] {
        return this._spectators;
    }
}

export class MultiWordle {
    private _id: string;
    private _ownerSessionId: string;
    private _language: Language;
    private _lobby: PlayerLobby;
    private _words: Words;
    private _gameState: GameState;
    private _invitationCode: string;
    private _games: MultiGames;

    public constructor(
        games: MultiGames,
        ownerSessionId: string,
        words: Words,
        language: Language
    ) {
        this._id = createId();
        this._invitationCode = createId();
        this._ownerSessionId = ownerSessionId;
        this._language = language;
        this._words = words;
        this._gameState = GameState.WaitingToStart;
        this._lobby = new PlayerLobby(this._ownerSessionId);
        this._games = games;
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
                return "game_end"
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
