export class Player {
    private _sessionId: string;
    private _avatarId: string;
    private _score: number;
    private _gameId: string;
    public constructor(sessionId: string, gameId: string, avatarId: string) {
        this._sessionId = sessionId;
        this._avatarId = avatarId;
        this._gameId = gameId;
        this._score = 0;
    }

    public getGameId(): string {
        return this._gameId;
    }

    public getSessionId(): string {
        return this._sessionId;
    }

    public getAvatarId(): string {
        return this._avatarId;
    }

    public setAvatarId(avatarId: string): void {
        this._avatarId = avatarId;
    }

    public getScore(): number {
        return this._score;
    }

    public increaseScore(): void {
        this._score++;
    }

    public resetScore(): void {
        this._score = 0;
    }
}
