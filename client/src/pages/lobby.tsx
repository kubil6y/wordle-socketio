import {
    GameState,
    useMultiWordle,
    convertGameStateStringToEnum,
} from "@/hooks/use-multi-wordle";
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CopyIcon, RotateCcwIcon } from "lucide-react";

type LobbyParams = {
    code: string;
};

export const Lobby = () => {
    const { isConnected } = useSocketStatus();
    const [welcomeModalOpen, setWelcomeModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const params = useParams<LobbyParams>();

    const { isAdmin, setInvitationCode, setGameState, setIsAdmin } =
        useMultiWordle();

    useEffect(() => {
        async function hasGame() {
            if (!params.code) {
                return;
            }
            const response = await socket.emitWithAck("mp_has_game", {
                code: params.code,
            });
            if (!response.ok) {
                toast.error("Game not found!");
                navigate("/");
            } else {
                const { gameState, invitationCode, isAdmin } = response.data;
                console.log({ gameState, invitationCode });
                setIsAdmin(isAdmin);
                setWelcomeModalOpen(true);
                setGameState(convertGameStateStringToEnum(gameState));
                setInvitationCode(invitationCode);
            }
        }
        hasGame();
    }, [params]);

    return (
        <>
            <LobbyWelcomeModal
                open={welcomeModalOpen}
                setOpen={setWelcomeModalOpen}
            />
        </>
    );
};

const LobbyWelcomeModal = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { isConnected } = useSocketStatus();
    const { isAdmin, invitationCode, gameState } = useMultiWordle();
    const navigate = useNavigate();

    function onStart() {
        console.log("onStart()");
    }

    function onClose() { }

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

                {isAdmin && <div className="flex items-center">admin!!</div>}

                <div className="flex items-center">players...</div>

                <InvitationCode
                    code={invitationCode}
                    isAdmin={isAdmin}
                    onGenerate={() => {
                        console.log("generate new invitation code");
                    }}
                />

                <div className="mt-4 flex w-full flex-col gap-2">
                    <Button
                        size="lg"
                        variant="outline"
                        className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                        disabled={!isConnected}
                        onClick={onStart}
                    >
                        Start
                    </Button>

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

type InvitationCodeProps = {
    code: string;
    isAdmin: boolean;
    onGenerate: () => void;
};

function InvitationCode({ code, isAdmin, onGenerate }: InvitationCodeProps) {
    return (
        <div className="flex h-8 w-full items-center justify-between overflow-hidden rounded shadow">
            <div
                className={cn(
                    "h-full w-[90%] bg-gray-200 text-primary",
                    isAdmin && "w-[80%]"
                )}
            >
                {code}
            </div>
            <div
                className={cn(
                    "flex w-[10%] items-center justify-center bg-gray-300 text-primary h-full",
                    isAdmin && "w-[20%]"
                )}
            >
                {isAdmin && (
                    <div className="">
                        <RotateCcwIcon className="size-4" />
                    </div>
                )}

                <div>
                    <CopyIcon className="size-4" />
                </div>
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
