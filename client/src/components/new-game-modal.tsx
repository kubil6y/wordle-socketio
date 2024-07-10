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
import { cn, getLanguageIcon } from "@/lib/utils";
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
import {
    convertGameStateStringToEnum,
    useMultiWordle,
} from "@/hooks/use-multi-wordle";
import { FormTitle } from "./form-title";
import { useJoinGameModal } from "@/hooks/use-join-game-modal";
import { AvatarSelection } from "./avatar-selection";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { useLobbyModal } from "@/hooks/use-lobby-modal";

const DEFAULT_AVATAR = "avatar3";

const languages = [
    { label: "Turkish", value: "tr", icon: Icons.flag.tr },
    { label: "English", value: "en", icon: Icons.flag.en },
];

enum GameType {
    Singleplayer,
    Multiplayer,
}

type NewGameModalProps = {
    isClosable?: boolean;
    showHomeButton?: boolean;
};

export const NewGameModal = ({
    showHomeButton = true,
    isClosable = true,
}: NewGameModalProps) => {
    const [gameType, setGameType] = useState<GameType>(GameType.Multiplayer);
    const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
    const [username, setUsername] = useState<string>("");

    const { isConnected } = useSocketStatus();
    const newGameModal = useNewGameModal();
    const joinGameModal = useJoinGameModal();
    const lobbyModal = useLobbyModal();
    const { open: openHowToPlayModal } = useHowToPlayModal();
    const wordle = useWordle();
    const multiWordle = useMultiWordle();
    const gameOverModal = useSPGameOverModal();
    const navigate = useNavigate();

    async function onCreate() {
        switch (gameType) {
            case GameType.Multiplayer:
                await createMultiplayer();
                break;
            default:
            case GameType.Singleplayer:
                await createSingleplayer();
                break;
        }
    }

    async function createMultiplayer() {
        const response = await socket.emitWithAck("mp_create_game", {
            language,
            avatar,
            username,
        });

        if (response.ok) {
            newGameModal.close();
            multiWordle.reset();
            multiWordle.setGameState(
                convertGameStateStringToEnum(response.gameState)
            );
            lobbyModal.open();
            navigate(`/lobby/${response.invitationCode}`);
        }
    }

    async function createSingleplayer() {
        const response = await socket.emitWithAck("sp_create_game", {
            language,
        });
        if (response.ok) {
            newGameModal.close();
            gameOverModal.close();
            wordle.reset();
            wordle.setConfig(response.config);
            navigate("/play");
        }
    }

    function onClose() {
        if (isClosable) {
            newGameModal.close();
        }
    }

    function onAlreadyHaveAcode() {
        newGameModal.close();
        joinGameModal.open();
    }

    const isUssernameValid = username.length >= 2 && username.length <= 16;
    function isDisabled() {
        if (!isConnected) {
            return true;
        }
        if (gameType === GameType.Multiplayer) {
            return !isUssernameValid;
        }
        return false;
    }

    return (
        <Dialog open={newGameModal.isOpen} onOpenChange={onClose}>
            <DialogContent
                className="flex h-full flex-col sm:h-auto"
                hideCloseButton={!isClosable}
            >
                <DialogHeader>
                    <div className="mb-2 flex items-center gap-4">
                        <Logo onClick={newGameModal.close} />
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
                                newGameModal.close();
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
                                    {languages.map((language, index) => {
                                        const LanguageIcon = getLanguageIcon(
                                            language.value as Language
                                        );
                                        return (
                                            <SelectItem
                                                value={language.value}
                                                key={index}
                                                className=""
                                            >
                                                <LanguageIcon className="size-5 mr-1 inline" />
                                                {language.label}
                                            </SelectItem>
                                        );
                                    })}
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
                            <div className="space-y-6">
                                <p className="text-sm italic text-muted-foreground">
                                    The maximum capacity for the lobby is three
                                    people.
                                </p>

                                <div className="mx-8">
                                    <AvatarSelection
                                        selectedAvatar={avatar}
                                        onSelect={setAvatar}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FormTitle title="Username" />
                                    <Input
                                        placeholder="ex: kubilay"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                    {!isUssernameValid && (
                                        <p className="text-sm font-medium text-destructive">
                                            Username must be between 2 and 16
                                            characters long.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex w-full flex-col gap-2">
                    <Button
                        size="lg"
                        variant="outline"
                        disabled={isDisabled()}
                        className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white disabled:opacity-50 dark:hover:bg-white dark:hover:text-black"
                        onClick={onCreate}
                    >
                        CREATE
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        className="text w-full select-none rounded-none font-semibold"
                        onClick={onAlreadyHaveAcode}
                    >
                        Already have a code?
                    </Button>

                    {showHomeButton && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="text w-full select-none rounded-none font-semibold uppercase"
                            onClick={() => navigate("/")}
                        >
                            Home
                        </Button>
                    )}
                </div>

                <ModalFooter />
            </DialogContent>
        </Dialog>
    );
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
