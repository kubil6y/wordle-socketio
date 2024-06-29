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
import { useHowToPlayModal } from "@/hooks/use-how-to-play-modal";
import { useNewGameModal } from "@/hooks/use-new-game-modal";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { ModalFooter } from "./modal-footer";
import { socket } from "@/lib/socket";

const DEFAULT_LANGUAGE = "en";
const languages = [
    { label: "English", value: "en" },
    { label: "Turkish", value: "tur" },
];

enum GameType {
    Singleplayer,
    Multiplayer,
}

export const NewGameModal = () => {
    const { isOpen, close } = useNewGameModal();
    const { open: openHowToPlayModal } = useHowToPlayModal();

    const [gameType, setGameType] = useState<GameType>(GameType.Singleplayer);
    const [lang, setLang] = useState<string>(DEFAULT_LANGUAGE);

    async function onCreate() {
        // TODO leftoff
        const response = await socket.emitWithAck("create_game", {
            lang,
            gameType: gameTypeToString(gameType).toLowerCase(),
        });
        console.log({response});
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="flex h-full flex-col sm:h-auto">
                <DialogHeader>
                    <DialogTitle className="text-start text-4xl font-semibold">
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
                            defaultValue="en"
                            onValueChange={(value) => {
                                setLang(value);
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

                <Button
                    size="lg"
                    variant="outline"
                    className="mt-4 select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    onClick={onCreate}
                >
                    Create
                </Button>

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
