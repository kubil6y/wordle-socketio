import { Socket } from "socket.io";
import { Request } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Wordle } from "../wordle";
import { Player } from "../multiplayer/player";
import { createMultiplayer, mGames } from "./games";
import { socket_errors } from "./errors";

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
        socket.join(game.getId()); // admin joins game room

        ackCb({
            ok: true,
            invitationCode: game.getInvitationCode(),
            gameStatus: "waiting_to_start",
        });
    });

    socket.on("already_has_game", (ackCb) => {
        const gameId = mGames.getPlayerGameId(req.session.id);
        if (!gameId) {
            ackCb({ ok: false });
            return;
        }
        const game = mGames.findById(gameId);
        if (!gameId) {
            ackCb({ ok: false });
            return;
        }
    });

    // TODO this should be called if client state is empty!
    socket.on("mp_has_game", (data, ackCb) => {
        // player game is required!
        const game = mGames.findByInvitationCode(data.code);
        if (game) {
            ackCb({
                ok: true,
                data: game.getData(req.session.id),
            });

            if (game.isEnded()) {
                //const summary = game.getSummary();
                //socket.emit("sp_game_over", summary);
            }
        } else {
            ackCb({ ok: false, data: null });
        }
    });

    socket.on("mp_join_game", (data, ackCb) => {
        // TODO: also emit and send other players about this
        // alert other players in this!
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
            ackCb({ ok: false });
            return;
        }

        const player = new Player(
            req.session.id,
            game.getId(),
            username,
            avatar
        );
        game.addPlayer(player);
        mGames.addPlayer(player.getSessionId(), game.getId());

        ackCb({
            ok: true,
            config: game.getData(req.session.id),
        });

        // inform others in the room
        socket
            .to(game.getId())
            .emit("players_changed", game.getPlayersData() );
    });
}
