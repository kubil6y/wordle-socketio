import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { socket } from "@/lib/socket";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { useHowToPlayModal } from "@/hooks/use-how-to-play-modal";
import { FormEvent, useState } from "react";
import { ModalFooter } from "./modal-footer";
import { ConnectionStatus } from "./connection-status";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { useNavigate } from "react-router-dom";
import { useWordle } from "@/hooks/use-wordle";
import { useSPGameOverModal } from "@/hooks/use-sp-game-over-modal";
import { useMultiWordle } from "@/hooks/use-multi-wordle";
import { Input } from "./ui/input";
import { FormTitle } from "./form-title";
import { useJoinGameModal } from "@/hooks/use-join-game-modal";
import { AvatarSelection } from "./avatar-selection";
import { FormErrorMessage } from "./form-error-message";

const DEFAULT_AVATAR = "avatar1";

type JoinGameModalProps = {
    isClosable?: boolean;
    showHomeButton?: boolean;
};

export const JoinGameModal = ({
    showHomeButton = true,
    isClosable = true,
}: JoinGameModalProps) => {
    const { isConnected } = useSocketStatus();
    const { isOpen, close } = useJoinGameModal();
    const { open: openHowToPlayModal } = useHowToPlayModal();

    const wordle = useWordle();
    const multiWordle = useMultiWordle();
    const gameOverModal = useSPGameOverModal();
    const navigate = useNavigate();

    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);

    const [codeInput, setCodeInput] = useState<string>("");
    const [username, setUsername] = useState<string>(""); // this should be cached on client? TODO
    const [gameNotFound, setGameNotFound] = useState<boolean>(false);

    function onClose() {
        if (isClosable) {
            resetInputs();
            close();
        }
    }

    function resetInputs() {
        setGameNotFound(false);
        setCodeInput("");
    }

    function onAvatarSelect(avatar: string): void {
        setAvatar(avatar);
    }

    async function handleJoin(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!isConnected) {
            return;
        }
        console.log(codeInput);
        const response = await socket.emitWithAck("mp_has_game", {
            code: codeInput,
        });
        if (response.ok) {
            console.log(response);
        } else {
            setGameNotFound(true);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="flex h-full flex-col sm:h-auto"
                hideCloseButton={!isClosable}
            >
                <DialogHeader>
                    <div className="mb-2 flex items-center gap-4">
                        <Logo
                            onClick={() => {
                                resetInputs();
                                close();
                            }}
                        />
                        <ConnectionStatus />
                    </div>

                    <DialogTitle className="text-4xl font-semibold">
                        Join Game
                    </DialogTitle>

                    <DialogDescription className="text-start">
                        If you are unfamiliar with how to play, please click{" "}
                        <span
                            className="cursor-pointer underline"
                            onClick={(e) => {
                                e.preventDefault();
                                resetInputs();
                                close();
                                openHowToPlayModal();
                            }}
                        >
                            here
                        </span>{" "}
                        to learn more.
                    </DialogDescription>
                </DialogHeader>

                <AvatarSelection selectedAvatar={avatar} onSelect={onAvatarSelect} />

                <div className="space-y-2">
                    <FormTitle title={"Username"} />
                    <Input
                        className="placeholder:italic rounded-none"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* JOIN GAME */}
                <form onSubmit={handleJoin} className="mt-4 space-y-2">
                    <div className="space-y-2">
                        <FormTitle title={"Got an invitation code?"} />
                        <div className="flex items-center gap-2">
                            <Input
                                className="placeholder:italic rounded-none"
                                placeholder="Enter invitation code"
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value)}
                            />
                            <Button
                                disabled={!isConnected}
                                className="select-none rounded-none bg-red-600 font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                                type="submit"
                            >
                                JOIN
                            </Button>
                        </div>
                    </div>
                    {gameNotFound && (
                        <FormErrorMessage message={"Game not found!"}/>
                    )}
                </form>

                <ModalFooter />
            </DialogContent>
        </Dialog>
    );
};
