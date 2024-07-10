import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ConnectionStatus } from "@/components/connection-status";
import { Logo } from "@/components/logo";
import { ModalFooter } from "@/components/modal-footer";
import { Button } from "@/components/ui/button";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { GameState, useMultiWordle } from "@/hooks/use-multi-wordle";
import { useNavigate } from "react-router-dom";
import { InvitationCode } from "./invitation-code";
import { useJoinGameModal } from "@/hooks/use-join-game-modal";
import { useLobbyModal } from "@/hooks/use-lobby-modal";
import { PlayerCard } from "./player-card";
import { getLanguageIcon } from "@/lib/utils";
import { socket } from "@/lib/socket";

type LobbyModalProps = {
    hasAlreadyJoined: boolean;
};

export const LobbyModal = ({
    hasAlreadyJoined,
}: LobbyModalProps) => {
    const { isConnected } = useSocketStatus();
    const { isAdmin, invitationCode, gameState, players, language, gameId } =
        useMultiWordle();
    const joinGameModal = useJoinGameModal();
    const lobbyModal = useLobbyModal();
    const navigate = useNavigate();

    function onStart() {
        // TODO
        socket.emit("mp_start_game", {
            gameId,
        });
    }

    function onClickJoin() {
        lobbyModal.close();
        navigate("/");
        joinGameModal.open();
    }

    function onClose() {
        // TODO
        console.log("onClose()lmao")
    }

    function onClickHome() {
        lobbyModal.close();
        navigate("/");
    }

    const LanguageIcon = getLanguageIcon(language);

    return (
        <Dialog open={lobbyModal.isOpen} onOpenChange={onClose}>
            <DialogContent
                className="flex h-full flex-col sm:h-auto"
                hideCloseButton
            >
                <DialogHeader>
                    <div className="mb-2 flex items-center gap-4">
                        <Logo onClick={close} />
                        <ConnectionStatus />
                    </div>

                    <DialogTitle className="flex items-start gap-3 text-4xl font-semibold">
                        Lobby <LanguageIcon className="size-8" />
                    </DialogTitle>

                    <DialogDescription className="text-start">
                        {getGameStateMessage(gameState)}
                    </DialogDescription>
                </DialogHeader>

                {isAdmin && <div className="flex items-center">admin!!!</div>}

                <div className="flex items-center gap-6">
                    {players?.map((player) => (
                        <PlayerCard
                            key={player.sessionId}
                            player={player}
                            showScore={false}
                        />
                    ))}
                </div>

                <InvitationCode code={invitationCode} />

                <div className="mt-4 flex w-full flex-col gap-2">
                    {isAdmin && (
                        <Button
                            size="lg"
                            variant="outline"
                            className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            disabled={!isConnected || players.length < 2}
                            onClick={onStart}
                        >
                            Start{" "}
                            <span className="ml-2 italic">
                                ({players.length}/3)
                            </span>
                        </Button>
                    )}
                    {!hasAlreadyJoined && (
                        <Button
                            size="lg"
                            variant="outline"
                            className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            disabled={!isConnected}
                            onClick={onClickJoin}
                        >
                            JOIN
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        className="text w-full select-none rounded-none font-semibold uppercase"
                        onClick={onClickHome}
                    >
                        Home
                    </Button>
                </div>

                <ModalFooter />
            </DialogContent>
        </Dialog>
    );
};

function getGameStateMessage(gameState: GameState): string {
    switch (gameState) {
        case GameState.WaitingToStart:
            return "WaitingToStart !!!";
        case GameState.GamePlaying:
            return "GamePlaying";
        case GameState.GameEnd:
            return "GameEnd";
        default:
        case GameState.Unknown:
            return "Unknown";
    }
}
