import {
    Language,
    LetterColor,
    useCanBackspace,
    useCanType,
} from "@/hooks/use-wordle";
import { cn } from "@/lib/utils";
import { useConfig } from "@/hooks/use-config";
import { DeleteIcon, SendHorizonalIcon } from "lucide-react";
import useSound from "use-sound";

const layouts = {
    en: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    tur: ["ertyuıopğü", "asdfghjklşi", "zcvbnmöç"],
};

type KeyboardProps = {
    language: Language;
    canSubmit: boolean;
    onEnter: () => void;
    onClick: (ch: string) => void;
    onBackspace: () => void;
};

export const Keyboard = ({
    language,
    canSubmit,
    onEnter,
    onClick,
    onBackspace,
}: KeyboardProps) => {
    const { volume } = useConfig();
    const canBackspace = useCanBackspace();
    const canType = useCanType();

    const [playKeypressStandard] = useSound("/sounds/keypress_standard.ogg", {
        volume,
    });
    const [playkeypressDelete] = useSound("/sounds/keypress_delete.ogg", {
        volume,
    });
    const [playkeypressReturn] = useSound("/sounds/keypress_return.ogg", {
        volume,
    });

    let layout: string[] = resolveLayout(language);

    return (
        <div className="flex flex-col items-center gap-2">
            {layout.map((row, i) => {
                return (
                    <div key={i} className="flex gap-1.5">
                        {i === 2 && (
                            <div
                                onClick={() => {
                                    playkeypressReturn();
                                    onEnter();
                                }}
                                className={cn(
                                    "box",
                                    "w-[42px] transition sm:w-[58px] duration-200",
                                    !canSubmit &&
                                    "pointer-events-none text-zinc-400 dark:text-zinc-600"
                                )}
                            >
                                <SendHorizonalIcon className="size-5 sm:size-6" />
                            </div>
                        )}
                        {row.split("").map((ch, j) => {
                            return (
                                <KeyboardButton
                                    key={j}
                                    ch={ch}
                                    hiColor="none"
                                    onClick={(ch: string) => {
                                        if (canType) {
                                            playKeypressStandard();
                                            onClick(ch);
                                        }
                                    }}
                                />
                            );
                        })}
                        {i === 2 && (
                            <div
                                onClick={() => {
                                    if (canBackspace) {
                                        playkeypressDelete();
                                    }
                                    onBackspace();
                                }}
                                className={cn(
                                    "box",
                                    "w-[42px] sm:w-[58px]",
                                    !canBackspace && "pointer-events-none"
                                )}
                            >
                                <DeleteIcon className="size-5 sm:size-6" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

type KeyboardButtonColors = LetterColor | "none";
type KeyboardButtonProps = {
    ch: string;
    hiColor: KeyboardButtonColors;
    onClick: (ch: string) => void;
};

const KeyboardButton = ({ ch, onClick, hiColor }: KeyboardButtonProps) => {
    return (
        <div
            className={cn("box", getBoxColorStyles(hiColor))}
            onClick={() => onClick(ch)}
        >
            {ch}
        </div>
    );
};

function resolveLayout(language: Language): string[] {
    switch (language) {
        case "tr":
            return layouts.tur;
        case "en":
            return layouts.en;
        default:
            return layouts.en;
    }
}

function getBoxColorStyles(color: KeyboardButtonColors): string {
    switch (color) {
        case "green":
            return "bg-emerald-500 text-white dark:bg-emerald-500";
        case "yellow":
            return "bg-amber-500 text-white dark:bg-amber-500";
        case "black":
            return "bg-zinc-600 text-white dark:bg-zinc-600";
        case "none":
            return "";
    }
}
