import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import LetterPullup from "./magicui/letter-pullup";
import { Logo } from "./logo";
import { ConnectionStatus } from "./connection-status";
import { ModalFooter } from "./modal-footer";
import { Button } from "./ui/button";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { useNavigate } from "react-router-dom";
import { socket } from "@/lib/socket";
import { cn, getLanguageIcon } from "@/lib/utils";
import { useMPGameOverModal } from "@/hooks/use-mp-game-over-modal";
import { useMultiWordle } from "@/hooks/use-multi-wordle";
import { PlayerCard } from "./player-card";

export const MPGameOverModal = () => {
    const { isConnected } = useSocketStatus();
    const multiWordle = useMultiWordle();
    const mpGameOverModal = useMPGameOverModal();
    const navigate = useNavigate();

    function onReplay() {
        socket.emit("mp_replay", {
            gameId: multiWordle.gameId,
        });
    }

    const LanguageIcon = getLanguageIcon(multiWordle.language);

    return (
        <Dialog open={mpGameOverModal.isOpen} onOpenChange={() => { }}>
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
                        <LetterPullup
                            words={"ROUND OVER"}
                            className={cn(
                                "select-none",
                                multiWordle.success
                                    ? "text-emerald-600 dark:text-emerald-600"
                                    : "text-red-600 dark:text-red-600",
                            )}
                        />
                    </DialogTitle>
                </DialogHeader>

                <div className="text-lg">
                    <span className="text-xl font-semibold">
                        '{multiWordle.secretWord}'{" "}
                    </span>
                    {multiWordle.success
                        ? "was guessed correctly."
                        : "was the answer!"}
                </div>

                <div className="my-4 flex items-center justify-center gap-4">
                    {multiWordle.players.map((player) => {
                        return (
                            <PlayerCard
                                selected={true}
                                player={player}
                                key={player.sessionId}
                                hiGrayscale={false}
                                bordered
                            />
                        );
                    })}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        Language: <LanguageIcon className="size-5" />
                    </div>
                    <p>Time: {multiWordle.duration}</p>
                </div>

                <DialogDescription>Per aspera ad astra!</DialogDescription>

                <div className="mt- flex w-full gap-4">
                    {multiWordle.isAdmin && (
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            disabled={!isConnected}
                            onClick={onReplay}
                        >
                            Replay
                        </Button>
                    )}

                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full select-none rounded-none text-2xl font-semibold uppercase"
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
