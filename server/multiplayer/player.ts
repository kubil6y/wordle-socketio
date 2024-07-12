export class Player {
    public gameId: string;
    public sessionId: string;
    public username: string;
    public avatarId: string;
    public score: number;

    public constructor(
        sessionId: string,
        gameId: string,
        username: string,
        avatarId: string
    ) {
        this.sessionId = sessionId;
        this.gameId = gameId;
        this.username = username;
        this.avatarId = avatarId;
        this.score = 0;
    }
}
