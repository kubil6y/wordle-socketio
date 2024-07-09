export class Player {
    private _gameId: string;
    private _sessionId: string;
    private _username: string;
    private _avatarId: string;
    private _score: number;

    public constructor(
        sessionId: string,
        gameId: string,
        username: string,
        avatarId: string
    ) {
        this._sessionId = sessionId;
        this._gameId = gameId;
        this._username = username;
        this._avatarId = avatarId;
        this._score = 0;
    }

    public getSessionId(): string {
        return this._sessionId;
    }

    public setAvatarId(avatarId: string): void {
        this._avatarId = avatarId;
    }

    public getData() {
        return {
            sessionId: this._sessionId,
            username: this._username,
            avatarId: this._avatarId,
            score: this._score,
        };
    }
}
