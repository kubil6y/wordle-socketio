import {
    Language,
    LetterCellColor,
    LetterColor,
    useCanBackspace,
    useCanType,
} from "@/hooks/use-wordle";
import useSound from "use-sound";
import { cn } from "@/lib/utils";
import { useConfig } from "@/hooks/use-config";
import { DeleteIcon, SendHorizonalIcon } from "lucide-react";
import { useMemo, useState } from "react";

const layouts = {
    en: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    tr: ["ertyuıopğü", "asdfghjklşi", "zcvbnmöç"],
};

const alphabets = {
    en: "abcdefghijklmnopqrstuvwxyz",
    tr: "abcçdefgğhıijklmnoöprsştuüvyz",
};

type KeyboardProps = {
    language: Language;
    canSubmit: boolean;
    pastTries: string[];
    pastTryResults: LetterColor[][];
    onEnter: () => void;
    onClick: (ch: string) => void;
    onBackspace: () => void;
};

export const Keyboard = ({
    language,
    canSubmit,
    pastTries,
    pastTryResults,
    onEnter,
    onClick,
    onBackspace,
}: KeyboardProps) => {
    const { volume } = useConfig();
    const canBackspace = useCanBackspace();
    const canType = useCanType();

    const [keyColors, setKeyColors] = useState({});

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

    const [greens, yellows, blacks] = useMemo(() => {
        const greens: Set<string> = new Set<string>();
        const yellows: Set<string> = new Set<string>();
        const blacks: Set<string> = new Set<string>();

        for (let i = 0; i < pastTryResults.length; i++) {
            const result = pastTryResults[i];
            for (let j = 0; j < result.length; j++) {
                const ch = pastTries[i][j];
                if (result[j] === "green") {
                    greens.add(ch);
                } else if (result[j] === "yellow" && !greens.has(ch)) {
                } else if (
                    result[j] === "black" &&
                    !greens.has(ch) &&
                    !yellows.has(ch)
                ) {
                    blacks.add(ch);
                }
            }
        }
        return [greens, yellows, blacks];
    }, [pastTries, pastTryResults]);

    function resolveHi(ch: string): LetterCellColor {
        let hiColor: LetterCellColor = "none";
        if (greens.has(ch)) {
            return "green";
        } else if (yellows.has(ch)) {
            return "yellow";
        } else if (blacks.has(ch)) {
            return "black";
        }
        return hiColor;
    }

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
                            const hiColor = resolveHi(ch);
                            return (
                                <KeyboardButton
                                    key={j}
                                    ch={ch}
                                    hiColor={hiColor}
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

type KeyboardButtonProps = {
    ch: string;
    hiColor: LetterCellColor;
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
            return layouts.tr;
        case "en":
            return layouts.en;
        default:
            return layouts.en;
    }
}

function getBoxColorStyles(color: KeyboardButtonColor): string {
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
