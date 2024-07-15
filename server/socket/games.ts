import { Logger } from "../logger";
import { io } from "../main";
import { MultiWordle } from "../multiplayer/multi-worlde";
import { Language, Wordle } from "../wordle";
import { words } from "../words";
import { Request } from "express";

export class MultiGames {
    private _games: { [id: string]: MultiWordle } = {};
    private _owners: { [ownerSessionId: string]: string } = {}; // ownerSessionId,gameId
    private _codes: { [invitationCode: string]: string } = {}; // code,gameId
    private _players: { [playerSessionId: string]: string } = {}; // playerSessionId,gameId

    public findById(id: string): MultiWordle | null {
        return this._games[id] ?? null;
    }

    public count(): number {
        return Object.keys(this._games).length;
    }

    public findByOwnerSessionId(sessionId: string): MultiWordle | null {
        const gameId = this._owners[sessionId];
        if (!gameId) {
            return null;
        }
        return this.findById(gameId);
    }

    public findByInvitationCode(code: string): MultiWordle | null {
        const gameId = this._codes[code];
        if (!gameId) {
            return null;
        }
        return this.findById(gameId);
    }

    public addPlayer(sessionId: string, gameId: string): void {
        this._players[sessionId] = gameId;
    }

    public getGameIdByPlayerSessionId(sessionId: string): string | null {
        return this._players[sessionId] ?? null;
    }

    public register(game: MultiWordle): void {
        this._games[game.getId()] = game;
        this._owners[game.getOwnerSessionId()] = game.getOwnerSessionId();
        this._players[game.getOwnerSessionId()] = game.getId(); // add owner also as player!
        this._codes[game.getInvitationCode()] = game.getId();
        Logger.debug(
            `MultiGames.register game:${game.getId()} for session: ${game.getOwnerSessionId()}`,
        );
    }

    // TODO disconnected users from the room and delete the room!
    public delete(id: string): void {
        const game = this.findById(id);
        if (!game) {
            Logger.debug(`MultiGames.delete game not found id:${id}`);
            return;
        }
        Logger.debug(`MultiGames.delete game id: ${id}`);
        delete this._games[id];
        delete this._owners[game.getOwnerSessionId()];
        delete this._codes[game.getInvitationCode()];
        for (const playerSessionId of game.getPlayerSessionIds()) {
            delete this._players[playerSessionId];
            Logger.debug(
                `MultiGames.delete gameId:${id} playerSessionId:${playerSessionId}`,
            );
        }
    }

    public deletePlayer(playerSessionId: string): void {
        delete this._players[playerSessionId];
    }

    public updateInvitationCode(gameId: string, newCode: string): void {
        const game = this.findById(gameId);
        if (!game) {
            return;
        }
        const oldCode = game.getInvitationCode();
        delete this._codes[oldCode];
        this._codes[newCode] = game.getId();
        Logger.debug(
            `MultiGames.updateInvitationCode for gameId:${gameId} newCode:${newCode}`,
        );
    }
}

class SingleplayerGames {
    private _games: { [sessionId: string]: Wordle } = {};

    public findById(sessionId: string): Wordle | null {
        return this._games[sessionId] ?? null;
    }

    public register(sessionId: string, game: Wordle): void {
        this._games[sessionId] = game;
        Logger.debug(`SingleplayerGames.register for sessionId:${sessionId}`);
    }

    public has(sessionId: string): boolean {
        return Boolean(this._games[sessionId]);
    }

    public delete(sessionId: string): void {
        delete this._games[sessionId];
        Logger.debug(`SingleplayerGames.delete for sessionId:${sessionId}`);
    }

    public count(): number {
        return Object.keys(this._games).length;
    }
}

export const sGames = new SingleplayerGames();
export const mGames = new MultiGames();

export function cleanupGames(req: Request) {
    const sessionId = req.session.id;

    const existingSPGameId = sGames.findById(sessionId);
    if (existingSPGameId) {
        sGames.delete(sessionId);
    }
    const existingMPGameId = mGames.getGameIdByPlayerSessionId(sessionId);
    if (existingMPGameId) {
        const existingGame = mGames.findById(existingMPGameId);
        if (existingGame) {
            if (existingGame.isOwner(sessionId)) {
                for (const sessionId of existingGame.getPlayerSessionIds()) {
                    io.to(sessionId).emit("mp_game_deleted");
                }
                const roomName = existingGame.getId();
                const room = io.sockets.adapter.rooms.get(roomName);
                if (room) {
                    for (const socketId of room) {
                        const socket = io.sockets.sockets.get(socketId);
                        if (socket) {
                            socket.leave(roomName);
                        }
                    }
                    delete io.sockets.adapter.rooms[roomName];
                }
                mGames.delete(existingGame.getId());
            } else {
                existingGame.deletePlayer(sessionId);
                mGames.deletePlayer(sessionId);
                // Notify lobby for updated players
                for (const sessionId of existingGame.getPlayerSessionIds()) {
                    io.to(sessionId).emit("mp_players_changed", {
                        isAdmin: existingGame.isOwner(sessionId),
                        isOwnTurn: existingGame.isOwnTurn(sessionId),
                        players: existingGame.getPlayersData(),
                    });
                }
            }
        }
    }
}
