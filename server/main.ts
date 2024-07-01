import cors from "cors";
import session from "express-session";
import express, { type Request } from "express";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { createGame, Wordle } from "./wordle";

config();

const socket_errors = {
    game_not_found: "game_not_found",
    not_valid_word: "not_valid_word",
};

declare module "express-session" {
    interface SessionData {
        count: number;
    }
}

const app = express();
const httpServer = createServer(app);

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
});

const io = new Server(httpServer, {
    pingInterval: 2000,
    pingTimeout: 5000,
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

const singleplayerGames: { [sessionId: string]: Wordle } = {};

io.on("connection", (socket) => {
    const req = socket.request as Request;
    console.log(
        `user connected id: ${socket.id} -- sessionId: ${req.session.id}`
    );
    socket.join(req.session.id);

    socket.on("create_game", (data, cb) => {
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
});

const PORT = process.env.PORT ?? 5000;
httpServer.listen(PORT, () => {
    console.log(`listening :${PORT}`);
});
