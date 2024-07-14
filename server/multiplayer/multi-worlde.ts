import { createId } from "@paralleldrive/cuid2";
import { MultiGames } from "../socket/games";
import { Words } from "../words";
import { Player } from "./player";
import { Logger } from "../logger";
import { Language, GAME_WIDTH, GAME_HEIGHT, LetterColor } from "../wordle";
import { formatTimestamps } from "../utils";

export const TURN_DURATION = 1000; // 1m
export const MAX_PLAYER_COUNT = 3;

enum GameState {
    WaitingToStart,
    GamePlaying,
    GameEnd,
}

export type PlayerData = Omit<Player, "gameId"> & {
    isOwnTurn: boolean;
    isAdmin: boolean;
};
export class MultiWordle {
    private _id: string;
    private _success: boolean;
    private _ownerSessionId: string;
    private _language: Language;
    private _gameState: GameState;
    private _invitationCode: string;
    private _secretWord: string;
    private _serverActiveWord: string;
    private _activeRowIndex: number;
    private _currentPlayerIndex: number;
    private _pastTries: string[];
    private _pastTryResults: LetterColor[][];
    private _startTimestamp: number;
    private _endTimestamp: number;

    private _players: Player[];
    private _words: Words;
    private _games: MultiGames;

    public constructor(
        games: MultiGames,
        ownerSessionId: string,
        words: Words,
        language: Language,
    ) {
        this._id = createId();
        this._gameState = GameState.WaitingToStart;
        this._invitationCode = createId();
        this._ownerSessionId = ownerSessionId;
        this._language = language;
        this._words = words;
        this._games = games;
        this._players = [];
        this._success = false;
        this._currentPlayerIndex = 0;
        this._secretWord = "";
        this._activeRowIndex = 0;
        this._pastTries = [];
        this._pastTryResults = [];
    }

    public getServerActiveWord(): string {
        return this._serverActiveWord;
    }

    public setServerActiveWord(word: string): void {
        this._serverActiveWord = word;
    }

    public getActiveRowIndex(): number {
        return this._activeRowIndex;
    }

    public getCurrentPlayerIndex(): number {
        return this._currentPlayerIndex;
    }

    public getCurrentPlayerSessionId(): string {
        const currentPlayer = this._players[this.getCurrentPlayerIndex()];
        if (currentPlayer) {
            return currentPlayer.sessionId;
        } else {
            return "";
        }
    }

    public getCurrentPlayer(): Player | null {
        return this._players[this.getCurrentPlayerIndex()] ?? null;
    }

    public getPastTries() {
        return this._pastTries;
    }

    public getPastTryResults() {
        return this._pastTryResults;
    }

    public nextTurn() {
        this._currentPlayerIndex =
            (this._currentPlayerIndex + 1) % this._players.length;
    }

    public addPlayer(player: Player): void {
        this._players.push(player);
        Logger.debug(
            `MultiWordle.addPlayer player session id: "${player.sessionId}"`,
        );
    }

    public deletePlayer(sessionId: string): void {
        let index = -1;
        for (let i = 0; i < this._players.length; i++) {
            if (this._players[i].sessionId === sessionId) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this._players.splice(index, 1);
            Logger.debug(`MultiWordle.deletePlayer sessionId: ${sessionId}`);
        }
    }

    public hasPlayer(sessionId: string): boolean {
        for (const player of this._players) {
            if (player.sessionId === sessionId) {
                return true;
            }
        }
        return false;
    }

    public canAddNewPlayer(): boolean {
        return this._players.length < MAX_PLAYER_COUNT;
    }

    public getPlayerSessionIds(): string[] {
        const sessionIds: string[] = [];
        for (const player of this._players) {
            sessionIds.push(player.sessionId);
        }
        return sessionIds;
    }

    public getPlayers() {
        return this._players;
    }

    public getPlayersData(): PlayerData[] {
        const playersData: PlayerData[] = [];
        for (const player of this._players) {
            playersData.push({
                ...player,
                isAdmin: this.isOwner(player.sessionId),
                isOwnTurn: this.isOwnTurn(player.sessionId),
            });
        }
        return playersData;
    }

    public getGameData(sessionId: string, withSecret: boolean = false) {
        let duration: string = "";
        let secretWord: string = "";
        if (this.isOver()) {
            if (withSecret) {
                secretWord = this._secretWord;
            }
            duration = formatTimestamps(
                this._startTimestamp,
                this._endTimestamp,
            );
        }
        return {
            gameId: this.getId(),
            success: this._success,
            duration,
            secretWord,
            language: this._language,
            gameState: this.gameStateToString(),
            serverActiveWord: this._serverActiveWord,
            isAdmin: this.isOwner(sessionId),
            isOwnTurn: this.isOwnTurn(sessionId),
            activeRowIndex: this.getActiveRowIndex(),
            players: this.getPlayersData(),
            pastTries: this.getPastTries(),
            pastTryResults: this.getPastTryResults(),
            invitationCode: this.getInvitationCode(),
            hasAlreadyJoined: this.hasPlayer(sessionId),
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

    public isOwnTurn(sessionId: string): boolean {
        return this.getCurrentPlayerSessionId() === sessionId;
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

    public start(): void {
        this._startTimestamp = Date.now();
        this._gameState = GameState.GamePlaying;
        Logger.debug(
            `MultiWordle.start gameId:${this.getId()} ownerSessionId:${this.getOwnerSessionId()}`,
        );
        this.generateRandomWord();
    }

    public end(): void {
        this._gameState = GameState.GameEnd;
        Logger.debug(
            `MultiWordle.end gameId:${this.getId()} ownerSessionId:${this.getOwnerSessionId()}`,
        );
    }

    public canStart(): boolean {
        if (this._players.length >= 2 && !this.isPlaying()) {
            return true;
        }
        return false;
    }

    public isPlaying(): boolean {
        return this._gameState === GameState.GamePlaying;
    }

    public isOver(): boolean {
        return this._gameState === GameState.GameEnd;
    }

    public isWaitingToStart(): boolean {
        return this._gameState === GameState.WaitingToStart;
    }

    public generateRandomWord() {
        const secretWord = this._words.getRandomWord(this._language);
        this._secretWord = secretWord;
        Logger.debug(
            `MultiWordle.generateRandomWord secretWord:${secretWord} gameId:"${this._ownerSessionId}"`,
        );
    }

    public isValidWord(word: string): boolean {
        if (word.length !== GAME_WIDTH) {
            return false;
        }
        return this._words.includes(word, this._language);
    }

    public processWord(word: string) {
        const result: LetterColor[] = new Array(this._secretWord.length).fill(
            "",
        );
        const chMap = new Map<string, number>();
        for (const letter of this._secretWord) {
            const letterCount = chMap.get(letter) ?? 0;
            chMap.set(letter, letterCount + 1);
        }
        // greens
        for (let i = 0; i < word.length; i++) {
            const ch = word[i];
            if (this._secretWord[i] === ch) {
                result[i] = "green";
                chMap.set(ch, chMap.get(ch)! - 1);
            }
        }
        // yellows and blacks
        for (let i = 0; i < word.length; i++) {
            const ch = word[i];
            const letterCount = chMap.get(ch) ?? 0;
            if (this._secretWord[i] !== ch && this._secretWord.includes(ch)) {
                if (letterCount > 0) {
                    result[i] = "yellow";
                } else {
                    result[i] = "black";
                }
            }
        }
        // blacks
        for (let i = 0; i < word.length; i++) {
            const ch = word[i];
            if (!this._secretWord.includes(ch)) {
                result[i] = "black";
            }
        }

        this._pastTryResults.push(result);
        this._pastTries.push(word);
        this._activeRowIndex++;
        this._serverActiveWord = "";

        if (this._secretWord === word) {
            this._success = true;
            const currentPlayer = this.getCurrentPlayer();
            if (!currentPlayer) {
                Logger.error(
                    `Current player is missing gameId:${this.getId()}`,
                );
                return;
            }
            currentPlayer.score++;
            this.endGame();
        } else if (this._pastTries.length === GAME_HEIGHT) {
            this._success = false;
            this.endGame();
        } else {
            this.nextTurn();
        }
    }

    public endGame() {
        this._gameState = GameState.GameEnd;
        this._endTimestamp = Date.now();
        this._serverActiveWord = "";
        this._currentPlayerIndex = 0;
        Logger.debug(`MultiWordle.endGame gameId:${this.getId()}`);
    }

    public giveUp() {
        this._success = false;
        this.endGame();
        Logger.debug(`MultiWordle.giveUp gameId:${this.getId()}`);
    }

    public replay() {
        this._serverActiveWord = "";
        this._activeRowIndex = 0;
        this._currentPlayerIndex = 0;
        this._pastTries = [];
        this._pastTryResults = [];
        this._gameState = GameState.GamePlaying;
        this._startTimestamp = Date.now();
        this.generateRandomWord();
        Logger.debug(`MultiWordle.replay gameId:${this.getId()}`);
    }
}
