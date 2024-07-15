import cors from "cors";
import session from "express-session";
import express, { type Request } from "express";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleSingleplayer } from "./socket/singleplayer";
import { handleMultiplayer } from "./socket/multiplayer";
import { Logger } from "./logger";
import { mGames, sGames } from "./socket/games";

config();

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

export const io = new Server(httpServer, {
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
    }),
);
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
    const req = socket.request as Request;
    Logger.info(
        `user connected: socket_id: ${socket.id} | session_id: ${req.session.id}`,
    );
    socket.join(req.session.id);

    io.emit("user_count", io.engine.clientsCount);

    handleSingleplayer(socket);
    handleMultiplayer(socket);

    socket.on("disconnect", () => {
        Logger.warning(
            `user disconnected: socket_id: ${socket.id} | session_id: ${req.session.id}`,
        );

        io.emit("user_count", io.engine.clientsCount);

        if (sGames.has(req.session.id)) {
            sGames.delete(req.session.id);
        }
    });
});

// TODO remove this later
const INACTIVITY_DURATION = 1000 * 60 * 10; // 10 mins
setInterval(() => {
    const now = Date.now();

    // Singleplayer games
    for (const sp of sGames.getAllGames()) {
        const isInactive =
            now - sp.getLastActivityTimestamp() > INACTIVITY_DURATION;
        if (isInactive) {
            const ownerSessionId = sp.getOwnerSessionId();
            io.to(ownerSessionId).emit("sp_game_inactive");
            sGames.delete(ownerSessionId);
        }
    }

    // Multiplayer games
    for (const mp of mGames.getAllGames()) {
        const isInactive =
            now - mp.getLastActivityTimestamp() > INACTIVITY_DURATION;
        if (isInactive) {
            // notify and delete
            for (const sessionId of mp.getPlayerSessionIds()) {
                io.to(sessionId).emit("mp_game_inactive");
            }
            const roomName = mp.getId();
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
            mGames.delete(mp.getId());
        }
    }
    Logger.debug(
        `Game count multiplayer:[${mGames.count()}], singleplayer:[${sGames.count()}]`,
    );
}, 5000);

const PORT = process.env.PORT ?? 5000;
httpServer.listen(PORT, () => {
    Logger.info(`listening :${PORT}`);
});
