import { createId } from "@paralleldrive/cuid2";
import { MultiGames } from "../socket/games";
import { Words } from "../words";
import { Player } from "./player";
import { Logger } from "../logger";
import { Language, GAME_WIDTH, GAME_HEIGHT } from "../wordle";

export const TURN_DURATION = 1000; // 1m

enum GameState {
    WaitingToStart,
    GamePlaying,
    GameEnd,
}

export class MultiWordle {
    private _id: string;
    private _ownerSessionId: string;
    private _language: Language;
    private _words: Words;
    private _gameState: GameState;
    private _invitationCode: string;
    private _games: MultiGames;
    private _secretWord: string;
    private _players: Player[];

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
        this.generateRandomWord();
    }

    public addPlayer(player: Player): void {
        this._players.push(player);
        Logger.debug(
            `MultiWordle.addPlayer player session id: "${player.getSessionId()}"`
        );
    }

    public hasPlayer(sessionId: string): boolean {
        for(const p of this._players) {
            if (p.getSessionId() === sessionId) {
                return true;
            }
        }
        return false;
    }

    public getPlayerSessionIds(): string[] {
        const sessionIds: string[] = [];
        for(const p of this._players) {
            sessionIds.push(p.getSessionId());
        }
        return sessionIds;
    }

    // TODO
    public getPlayersData() {
        const playersData: {
            sessionId: string;
            username: string;
            avatarId: string;
            score: number;
            isAdmin: boolean;
        }[] = [];
        for (const player of this._players) {
            const { sessionId, username, avatarId, score } = player.getData();
            playersData.push({
                sessionId,
                username,
                avatarId,
                score,
                isAdmin: this.isOwner(player.getSessionId()),
            });
        }
        return playersData;
    }

    public getData(sessionId: string) {
        return {
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            secretWord: this._secretWord, // TODO remove this later!
            gameState: this.gameStateToString(),
            language: this._language,
            isAdmin: this.isOwner(sessionId),
            invitationCode: this.getInvitationCode(),
            players: this.getPlayersData(),
        };
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

    public gameStateToString(): string {
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
        Logger.debug(`MultiWordle.generateNewInvitationCode: "${newCode}"`);
    }

    public startGame(): void {
        this._gameState = GameState.GamePlaying;
        Logger.debug("MultiWordle.startGame");
    }

    public endGame(): void {
        this._gameState = GameState.GameEnd;
        Logger.debug("MultiWordle.endGame");
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

    public generateRandomWord() {
        const secretWord = this._words.getRandomWord(this._language);
        this._secretWord = secretWord;
        Logger.debug(
            `MultiWordle.generateRandomWord "${secretWord}" sessionId ${this._ownerSessionId}`
        );
    }
}
