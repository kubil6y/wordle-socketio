import { Socket } from "socket.io";
import { Request } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Wordle } from "../wordle";
import { Player } from "../multiplayer/player";
import { cleanupGames, mGames } from "./games";
import { socket_errors } from "./errors";
import { io } from "../main";
import { words } from "../words";
import { MultiWordle } from "../multiplayer/multi-worlde";

export const multiplayerGames: { [sessionId: string]: Wordle } = {};

export function handleMultiplayer(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) {
    const req = socket.request as Request;

    socket.on("mp_create_game", (data, ackCb) => {
        const { language, avatar, username } = data;
        const sessionId = req.session.id;

        cleanupGames(req);
        const game = new MultiWordle(mGames, sessionId, words, language);
        mGames.register(game);

        const player = new Player(sessionId, game.getId(), username, avatar);
        game.addPlayer(player);
        mGames.addPlayer(sessionId, game.getId());
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
        cleanupGames(req);
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
        if (game.isPlaying()) {
            socket.emit("alert", {
                message: "Game has already started!",
                type: "error",
                code: socket_errors.game_has_already_started,
            });
            ackCb({ ok: false, error: socket_errors.join_twice });
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
        for (const sessionId of game.getPlayerSessionIds()) {
            io.to(sessionId).emit("mp_active_word", {
                serverActiveWord: game.getServerActiveWord(),
            });
        }
    });

    socket.on("mp_start_game", (data) => {
        const { gameId } = data;
        const game = mGames.findById(gameId);
        if (!game) {
            return;
        }
        if (game.isOwner(req.session.id) && game.canStart()) {
            game.start();
            for (const sessionId of game.getPlayerSessionIds()) {
                const gameData = game.getGameData(sessionId);
                io.to(sessionId).emit("mp_game_start", gameData);
            }
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
            const withSecret = true;
            for (const sessionId of game.getPlayerSessionIds()) {
                const gameData = game.getGameData(sessionId, withSecret);
                io.to(sessionId).emit("mp_game_over", gameData);
            }
        }
    });

    socket.on("mp_give_up", (data: { gameId: string }) => {
        const game = mGames.findById(data.gameId);
        if (!game) {
            return;
        }
        if (!game.isOwner(req.session.id)) {
            return;
        }

        game.giveUp();

        const withSecret = true;
        for (const sessionId of game.getPlayerSessionIds()) {
            const gameData = game.getGameData(sessionId, withSecret);
            io.to(sessionId).emit("mp_game_over", gameData);
        }
    });

    socket.on("mp_replay", (data: { gameId: string }) => {
        const game = mGames.findById(data.gameId);
        if (!game) {
            return;
        }
        if (!game.isOwner(req.session.id)) {
            return;
        }

        game.replay();
        for (const sessionId of game.getPlayerSessionIds()) {
            const gameData = game.getGameData(sessionId);
            io.to(sessionId).emit("mp_replay", gameData);
        }
    });
}
