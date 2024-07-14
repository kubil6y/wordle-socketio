import { Socket } from "socket.io";
import { Request } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Wordle } from "../wordle";
import { Player } from "../multiplayer/player";
import { createMultiplayer, mGames } from "./games";
import { socket_errors } from "./errors";
import { io } from "../main";

export const multiplayerGames: { [sessionId: string]: Wordle } = {};

export function handleMultiplayer(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) {
    const req = socket.request as Request;

    socket.on("mp_create_game", (data, ackCb) => {
        const { language, avatar, username } = data;
        const ownerSessionId = req.session.id;
        const game = createMultiplayer(ownerSessionId, language);

        const player = new Player(
            ownerSessionId,
            game.getId(),
            username,
            avatar,
        );
        game.addPlayer(player);
        mGames.addPlayer(ownerSessionId, game.getId());
        socket.join(game.getId()); // admin joins game room

        ackCb({
            ok: true,
            gameId: game.getId(),
            invitationCode: game.getInvitationCode(),
            gameStatus: "waiting_to_start",
        });
    });

    // IsAdmin is set here!
    socket.on("mp_has_game", (data, ackCb) => {
        const { code } = data;
        const game = mGames.findByInvitationCode(code);
        if (game) {
            ackCb({
                ok: true,
                data: game.getGameData(req.session.id),
            });
        } else {
            ackCb({ ok: false, data: null });
        }
    });

    socket.on("mp_join_game", (data, ackCb) => {
        const { avatar, username, code } = data;
        const game = mGames.findByInvitationCode(code);
        if (!game) {
            socket.emit("alert", {
                message: "Game not found!",
                type: "error",
                code: socket_errors.game_not_found,
            });
            ackCb({ ok: false });
            return;
        }

        if (game.hasPlayer(req.session.id)) {
            socket.emit("alert", {
                message: "You can not join twice!",
                type: "error",
                code: socket_errors.join_twice,
            });
            ackCb({ ok: false, error: socket_errors.join_twice });
            return;
        }
        if (!game.canAddNewPlayer()) {
            socket.emit("alert", {
                message: "The maximum player count (3) has been reached.",
                type: "error",
                code: socket_errors.max_player_count,
            });
            ackCb({ ok: false, error: socket_errors.max_player_count });
            return;
        }

        const player = new Player(
            req.session.id,
            game.getId(),
            username,
            avatar,
        );
        socket.join(game.getId());
        game.addPlayer(player);
        mGames.addPlayer(player.sessionId, game.getId());

        ackCb({ ok: true });

        // inform others in the room
        //io.to(game.getId()).emit("mp_players_changed", game.getPlayersData());
        for (const sessionId of game.getPlayerSessionIds()) {
            io.to(sessionId).emit("mp_players_changed", {
                isAdmin: game.isOwner(sessionId),
                isOwnTurn: game.isOwnTurn(sessionId),
                players: game.getPlayersData(),
            });
        }
    });

    socket.on("mp_active_word", (data: { gameId: string; word: string }) => {
        const game = mGames.findById(data.gameId);
        if (!game) {
            return;
        }
        game.setServerActiveWord(data.word);
        socket.to(game.getId()).emit("mp_active_word", {
            serverActiveWord: game.getServerActiveWord(),
        });
    });

    socket.on("mp_start_game", (data) => {
        const { gameId } = data;
        const game = mGames.findById(gameId);
        if (!game) {
            return;
        }
        if (game.isOwner(req.session.id) && game.canStart()) {
            game.start();
            const data = game.getJoinData();
            io.to(game.getId()).emit("mp_game_start", data);
        }
    });

    socket.on("mp_try_word", (data) => {
        const { word, gameId } = data;

        const game = mGames.findById(gameId);
        if (!game) {
            socket.emit("alert", {
                message: "Game not found!",
                type: "error",
                code: socket_errors.game_not_found,
            });
            return;
        }

        if (!game.isPlaying()) {
            socket.emit("alert", {
                message: "Game is not playing",
                type: "error",
                code: socket_errors.game_not_found,
            });
            return;
        }

        if (game.isValidWord(word)) {
            game.processWord(word);

            for (const sessionId of game.getPlayerSessionIds()) {
                const gameData = game.getGameData(sessionId);
                io.to(sessionId).emit("mp_try_word", gameData);
            }
        } else {
            for (const sessionId of game.getPlayerSessionIds()) {
                io.to(sessionId).emit(
                    "mp_not_valid_word",
                    game.getActiveRowIndex(),
                );
            }
        }

        if (game.isOver()) {
            for (const sessionId of game.getPlayerSessionIds()) {
                const gameData = game.getGameData(sessionId);
                io.to(sessionId).emit("mp_game_over", gameData);
            }
        }
    });
}
