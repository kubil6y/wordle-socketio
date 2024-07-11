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
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
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
            avatar
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
                data: game.getLobbyData(req.session.id),
            });
        } else {
            ackCb({ ok: false });
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
            ackCb({ ok: false, error: "join_twice" });
            return;
        }

        const player = new Player(
            req.session.id,
            game.getId(),
            username,
            avatar
        );
        socket.join(game.getId());
        game.addPlayer(player);
        mGames.addPlayer(player.getSessionId(), game.getId());

        ackCb({
            ok: true,
            config: game.getData(),
        });

        // inform others in the room
        socket
            .to(game.getId())
            .emit("mp_players_changed", game.getPlayersData());
    });

    socket.on("mp_start_game", (data) => {
        const { gameId } = data;
        const game = mGames.findById(gameId);
        if (!game) {
            return;
        }
        if (game.isOwner(req.session.id) && game.canStart()) {
            game.start();
            const data = game.getData();
            io.to(game.getId()).emit("mp_game_start", data);
        }
    });
}
