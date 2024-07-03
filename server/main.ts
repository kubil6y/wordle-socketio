import cors from "cors";
import session from "express-session";
import express, { type Request } from "express";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleSingleplayer } from "./socket/singleplayer";
import { handleMultiplayer } from "./socket/multiplayer";
import { Logger } from "./logger";

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

io.on("connection", (socket) => {
    const req = socket.request as Request;
    Logger.info(`socket_id: ${socket.id} | session_id: ${req.session.id}`);
    socket.join(req.session.id);

    handleSingleplayer(socket);
    handleMultiplayer(socket);
});

const PORT = process.env.PORT ?? 5000;
httpServer.listen(PORT, () => {
    Logger.info(`listening :${PORT}`);
});
