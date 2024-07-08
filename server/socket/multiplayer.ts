import { Socket } from "socket.io";
import { Request } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Wordle } from "../wordle";
import { Player } from "../multiplayer/player";
import { createMultiplayer, mGames } from "./games";

export const multiplayerGames: { [sessionId: string]: Wordle } = {};

export function handleMultiplayer(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    const req = socket.request as Request;

    socket.on("mp_create_game", (data, ackCb) => {
        const { language, avatar, username } = data;
        const ownerSessionId = req.session.id;
        const game = createMultiplayer(ownerSessionId, language);

        const player = new Player(ownerSessionId, game.getId(), username, avatar);
        game.addPlayer(player);
        socket.join(game.getId()); // admin joins game room

        ackCb({
            ok: true,
            config: game.getConfig(ownerSessionId),
        });
    });

    // TODO this should be called if client state is empty!
    socket.on("mp_has_game", (data, ackCb) => {
        // player game is required!
        const game = mGames.findByInvitationCode(data.code);
        if (game) {
            ackCb({
                ok: true,
                //data: game.getData(),
                //config: game.getConfig(),
                data: {
                    gameState: game.getGameStateToString(),
                    invitationCode: game.getInvitationCode(),
                    isAdmin: game.isOwner(req.session.id),
                }
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
        // TODO create player here!
        const game = mGames.findByInvitationCode(data.code);
        if (game) {
        } else {
        }
    })
}
