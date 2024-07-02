import { Socket } from "socket.io";
import { Request } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { createGame, Wordle } from "../wordle";

const socket_errors = {
    game_not_found: "game_not_found",
    not_valid_word: "not_valid_word",
};

const singleplayerGames: { [sessionId: string]: Wordle } = {};

export function handleSingleplayer(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    const req = socket.request as Request;

    socket.on("sp_create_game", (data, cb) => {
        const sGame = createGame(req.session.id, data.language, data.gameType)!; // TODO
        if (singleplayerGames[req.session.id]) {
            delete singleplayerGames[req.session.id];
        }
        singleplayerGames[req.session.id] = sGame;

        cb({
            ok: true,
            config: sGame.getConfig(),
        });
    });

    socket.on("sp_try_word", (data, ackCb) => {
        const { word } = data;

        const game = singleplayerGames[req.session.id];
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
            socket.emit("alert", {
                type: "error",
                message: `"${word}" is not a valid word!`,
                code: socket_errors.not_valid_word,
            });
        }

        if (game.isOver()) {
            const summary = game.getSummary();
            socket.emit("sp_game_over", summary);
        }
    });

    socket.on("sp_has_game", (ackCb) => {
        const game = singleplayerGames[req.session.id];
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
        const game = singleplayerGames[req.session.id];
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
        const game = singleplayerGames[req.session.id];
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
