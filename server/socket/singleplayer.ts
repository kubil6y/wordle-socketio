import { Socket } from "socket.io";
import { Request } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { socket_errors } from "./errors";
import { cleanupGames , sGames } from "./games";
import { Wordle } from "../wordle";
import { words } from "../words";

export function handleSingleplayer(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    const req = socket.request as Request;

    socket.on("sp_create_game", (data, cb) => {
        const sessionId = req.session.id;
        cleanupGames(req);
        const game = new Wordle(sessionId, words, data.language);
        sGames.register(sessionId, game);
        cb({
            ok: true,
            config: game.getConfig(),
        });
    });

    socket.on("sp_try_word", (data, ackCb) => {
        const { word } = data;

        const game = sGames.findById(req.session.id);
        if (!game) {
            socket.emit("alert", {
                message: "Game not found!",
                type: "error",
                code: socket_errors.game_not_found,
            });
            ackCb({ ok: false, data: null });
            return;
        }

        if (game.isValidWord(word)) {
            game.processWord(word);
            const gameData = game.getData();
            ackCb({ ok: true, data: gameData });
        } else {
            socket.emit("sp_not_valid_word", game.getActiveRowIndex());
        }

        if (game.isOver()) {
            const summary = game.getSummary();
            socket.emit("sp_game_over", summary);
        }
    });

    socket.on("sp_has_game", (ackCb) => {
        const game = sGames.findById(req.session.id);
        if (game) {
            ackCb({
                ok: true,
                data: game.getData(),
                config: game.getConfig(),
            });

            if (game.isOver()) {
                const summary = game.getSummary();
                socket.emit("sp_game_over", summary);
            }
        } else {
            ackCb({ ok: false, data: null });
        }
    });

    socket.on("sp_give_up", () => {
        const game = sGames.findById(req.session.id);
        if (!game) {
            socket.emit("alert", {
                message: "Game not found!",
                type: "error",
                code: socket_errors.game_not_found,
            });
            return;
        }

        game.giveUp();
        const summary = game.getSummary();
        socket.emit("sp_game_over", summary);
    });

    socket.on("sp_replay", (ackCb) => {
        const game = sGames.findById(req.session.id);
        if (!game) {
            socket.emit("alert", {
                message: "Game not found!",
                type: "error",
                code: socket_errors.game_not_found,
            });
            return;
        }
        game.replay();
        ackCb({ ok: true });
    });
}
