import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "./logo";
import { ConnectionStatus } from "./connection-status";
import { ModalFooter } from "./modal-footer";
import { Button } from "./ui/button";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { useSPGameOverModal } from "@/hooks/use-sp-game-over-modal";
import { useWordle } from "@/hooks/use-wordle";
import { useNavigate } from "react-router-dom";
import { socket } from "@/lib/socket";

export const SPGameOverModal = () => {
    const { isConnected } = useSocketStatus();
    const { success, duration, secretWord, reset, setActive } = useWordle();
    const { isOpen, close } = useSPGameOverModal();
    const navigate = useNavigate();

    async function onReplay() {
        const response = await socket.emitWithAck("sp_replay");
        if (response.ok) {
            reset();
            setActive(true);
            close();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
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
                        {success ? (
                            <p className="text-emerald-600">You win!</p>
                        ) : (
                            <p className="text-red-600">You lose!</p>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {!success && (
                    <div className="text-xl">
                        Correct answer was{" "}
                        <span className="font-semibold underline">
                            {secretWord}
                        </span>
                    </div>
                )}
                <div className="text-lg">Time: {duration}</div>

                <DialogDescription>Per aspera ad astra!</DialogDescription>

                <div className="mt- flex w-full gap-4">
                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                        disabled={!isConnected}
                        onClick={onReplay}
                    >
                        Replay
                    </Button>

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
