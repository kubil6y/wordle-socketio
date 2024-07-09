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
import { GameState, Player, useMultiWordle } from "@/hooks/use-multi-wordle";
import { useNavigate } from "react-router-dom";
import { InvitationCode } from "./invitation-code";

export const LobbyWelcomeModal = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { isConnected } = useSocketStatus();
    const { isAdmin, invitationCode, gameState, players } = useMultiWordle();
    const navigate = useNavigate();

    function onStart() {
        console.log("onStart()");
    }

    function onClose() {
        // TODO
    }

    function onClickHome() {
        setOpen(false);
        navigate("/");
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="flex h-full flex-col sm:h-auto"
                hideCloseButton
            >
                <DialogHeader>
                    <div className="mb-2 flex items-center gap-4">
                        <Logo onClick={close} />
                        <ConnectionStatus />
                    </div>

                    <DialogTitle className="text-4xl font-semibold">
                        Lobby
                    </DialogTitle>

                    <DialogDescription className="text-start">
                        {getGameStateMessage(gameState)}
                    </DialogDescription>
                </DialogHeader>

                {isAdmin && <div className="flex items-center">admin!!!</div>}

                <div className="flex items-center gap-6">
                    {players?.map((player) => (
                        <PlayerCard key={player.sessionId} player={player} />
                    ))}
                </div>

                <InvitationCode code={invitationCode} />

                <div className="mt-4 flex w-full flex-col gap-2">
                    {isAdmin && (
                        <Button
                            size="lg"
                            variant="outline"
                            className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            disabled={!isConnected}
                            onClick={onStart}
                        >
                            Start
                        </Button>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        className="text w-full select-none rounded-none font-semibold uppercase"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </Button>
                </div>

                <ModalFooter />
            </DialogContent>
        </Dialog>
    );
};

function PlayerCard({ player }: { player: Player }) {
    const avatarPath = `/avatars/${player.avatarId}.png`;
    return (
        <div className="flex flex-col items-center">
            <img src={avatarPath} className="size-[64px] aspect-square" />

            <div className="px-2 py-1">
                <p className="font-semibold text-sm text-center">{player.username}</p>
            </div>
        </div>
    );
}

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
