import { useConfig } from "@/hooks/use-config";
import { useCanBackspace, useCanType } from "@/hooks/use-wordle";
import { cn } from "@/lib/utils";
import { DeleteIcon, SendHorizonalIcon } from "lucide-react";
import useSound from "use-sound";

type Language = "en" | "tur";

const layout = {
    en: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    tur: ["ertyuıopğü", "asdfghjklşi", "zcvbnmöç"],
};

type KeyboardProps = {
    language: Language;
    greenLetters: string[];
    yellowLetters: string[];
    notFoundLetters: string[];
    canSubmit: boolean;
    onEnter: () => void;
    onClick: (ch: string) => void;
    onBackspace: () => void;
};

export const Keyboard = ({
    language,
    yellowLetters,
    greenLetters,
    notFoundLetters,
    canSubmit,
    onEnter,
    onClick,
    onBackspace,
}: KeyboardProps) => {
    const { volume } = useConfig();
    const canType = useCanType();
    const canBackspace = useCanBackspace();

    const [playKeypressStandard] = useSound("/sounds/keypress_standard.ogg", { volume });
    const [playkeypressDelete] = useSound("/sounds/keypress_delete.ogg", {volume});
    const [playkeypressReturn] = useSound("/sounds/keypress_return.ogg", {volume});

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
                                    "w-[42px] sm:w-[58px] transition",
                                    !canSubmit &&
                                    "pointer-events-none text-zinc-400 dark:text-zinc-500"
                                )}
                            >
                                <SendHorizonalIcon className="size-5 sm:size-6" />
                            </div>
                        )}
                        {row.split("").map((ch, j) => {
                            const hiYellow = yellowLetters.includes(ch);
                            const hiGreen = greenLetters.includes(ch);
                            const hiNotFound = notFoundLetters.includes(ch);
                            return (
                                <Box
                                    key={j}
                                    ch={ch}
                                    onClick={(ch: string) => {
                                        if (canType) {
                                            playKeypressStandard();
                                        }
                                        onClick(ch);
                                    }}
                                    hiGreen={hiGreen}
                                    hiYellow={hiYellow}
                                    hiNotFound={hiNotFound}
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

type BoxProps = {
    ch: string;
    hiGreen: boolean;
    hiYellow: boolean;
    hiNotFound: boolean;
    onClick: (ch: string) => void;
};

const Box = ({ ch, onClick, hiYellow, hiGreen, hiNotFound }: BoxProps) => {
    return (
        <div
            className={cn(
                "box",
                hiYellow && "bg-amber-500 text-white dark:bg-amber-500",
                hiGreen && "bg-emerald-500 text-white dark:bg-emerald-500",
                hiNotFound && "bg-zinc-600 text-white dark:bg-zinc-600"
            )}
            onClick={() => onClick(ch)}
        >
            {ch}
        </div>
    );
};

function resolveLayout(language: Language): string[] {
    switch (language) {
        case "tur":
            return layout.tur;
        case "en":
            return layout.en;
        default:
            return layout.en;
    }
}
