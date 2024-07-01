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
import { cn } from "@/lib/utils";
import { socket } from "@/lib/socket";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { useHowToPlayModal } from "@/hooks/use-how-to-play-modal";
import { useNewGameModal } from "@/hooks/use-new-game-modal";
import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { ModalFooter } from "./modal-footer";
import { ConnectionStatus } from "./connection-status";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { useNavigate } from "react-router-dom";
import { DEFAULT_LANGUAGE, Language, useWordle } from "@/hooks/use-wordle";
import { useSPGameOverModal } from "@/hooks/use-sp-game-over-modal";

const languages = [
    { label: "Turkish", value: "tr" },
    { label: "English", value: "en" },
];

enum GameType {
    Singleplayer,
    Multiplayer,
}

type NewGameModalProps = {
    isClosable?: boolean;
};

export const NewGameModal = ({ isClosable = true }: NewGameModalProps) => {
    const { isConnected } = useSocketStatus();
    const { isOpen, close } = useNewGameModal();
    const { open: openHowToPlayModal } = useHowToPlayModal();
    const wordle = useWordle();
    const gameOverModal = useSPGameOverModal();
    const navigate = useNavigate();

    const [gameType, setGameType] = useState<GameType>(GameType.Singleplayer);
    const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

    async function onCreate() {
        const response = await socket.emitWithAck("create_game", {
            language,
            gameType: gameTypeToString(gameType),
        });
        if (response.ok) {
            close();
            gameOverModal.close();
            wordle.reset();
            wordle.setConfig(response.config);
            navigate("/play");
        }
    }

    function onClose() {
        if (isClosable) {
            close();
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
                        <Logo onClick={close} />
                        <ConnectionStatus />
                    </div>

                    <DialogTitle className="text-4xl font-semibold">
                        New Game
                    </DialogTitle>

                    <DialogDescription className="text-start">
                        If you are unfamiliar with how to play, please click{" "}
                        <span
                            className="cursor-pointer underline"
                            onClick={(e) => {
                                e.preventDefault();
                                close();
                                openHowToPlayModal();
                            }}
                        >
                            here
                        </span>{" "}
                        to learn more.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Language */}
                    <div className="space-y-2">
                        <FormTitle title="Language" />

                        <Select
                            defaultValue={DEFAULT_LANGUAGE}
                            onValueChange={(value) => {
                                setLanguage(value as Language);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Languages</SelectLabel>
                                    {languages.map((language, index) => (
                                        <SelectItem
                                            value={language.value}
                                            key={index}
                                        >
                                            {language.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Game Type */}
                    <div className="space-y-2">
                        <FormTitle title="Game Type" />
                        <div className="flex items-center gap-4">
                            <SelectGameTypeButton
                                selectedGameType={gameType}
                                gameType={GameType.Singleplayer}
                                setGameType={setGameType}
                            />
                            <SelectGameTypeButton
                                selectedGameType={gameType}
                                gameType={GameType.Multiplayer}
                                setGameType={setGameType}
                            />
                        </div>

                        {gameType === GameType.Multiplayer && (
                            <p className="text-sm italic text-muted-foreground">
                                The maximum capacity for the lobby is three
                                people.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex w-full flex-col gap-2 mt-4">
                    <Button
                        size="lg"
                        variant="outline"
                        className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                        disabled={!isConnected}
                        onClick={onCreate}
                    >
                        Create
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full select-none rounded-none text font-semibold uppercase"
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

type FormTitleProps = {
    title: string;
};

const FormTitle = ({ title }: FormTitleProps) => {
    return <p className="text-2xl font-semibold">{title}</p>;
};

type SelectGameTypeButtonProps = {
    selectedGameType: GameType;
    gameType: GameType;
    setGameType: React.Dispatch<React.SetStateAction<GameType>>;
};

const SelectGameTypeButton = ({
    gameType,
    selectedGameType,
    setGameType,
}: SelectGameTypeButtonProps) => {
    const gameTypeLabel = gameTypeToString(gameType);
    const isSelected = gameType === selectedGameType;
    return (
        <Button
            className={cn(
                "flex w-full items-center justify-center text-[15px]",
                isSelected &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
            variant="outline"
            onClick={() => {
                setGameType(gameType);
            }}
        >
            {isSelected && <CheckIcon className="size-5 mr-3 shrink-0" />}
            {gameTypeLabel}
        </Button>
    );
};

function gameTypeToString(gameType: GameType) {
    switch (gameType) {
        case GameType.Multiplayer:
            return "Multiplayer";
        default:
        case GameType.Singleplayer:
            return "Singleplayer";
    }
}
