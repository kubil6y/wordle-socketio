import { cn } from "@/lib/utils";
import { DeleteIcon, SendHorizonalIcon } from "lucide-react";

type Language = "en" | "tur";

const layout = {
    en: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    tur: ["ertyuıopğü", "asdfghjklşi", "zcvbnmöç"],
};

type KeyboardProps = {
    language: Language;
    greenLetters: string[];
    yellowLetters: string[];
    onEnter: () => void;
    onClick: (ch: string) => void;
    onBackspace: () => void;
};

export const Keyboard = ({
    language,
    yellowLetters,
    greenLetters,
    onEnter,
    onClick,
    onBackspace,
}: KeyboardProps) => {
    let layout: string[] = resolveLayout(language);
    return (
        <div className="flex flex-col items-center gap-2">
            {layout.map((row, i) => {
                return (
                    <div key={i} className="flex gap-1.5">
                        {i === 2 && (
                            <div
                                onClick={onEnter}
                                className={cn("box", "w-[42px] sm:w-[58px]")}
                            >
                                <SendHorizonalIcon className="size-5 sm:size-6" />
                            </div>
                        )}
                        {row.split("").map((ch, j) => {
                            const hiYellow = yellowLetters.includes(ch);
                            const hiGreen = greenLetters.includes(ch);
                            return (
                                <Box
                                    key={j}
                                    ch={ch}
                                    onClick={onClick}
                                    hiGreen={hiGreen}
                                    hiYellow={hiYellow}
                                />
                            );
                        })}
                        {i === 2 && (
                            <div
                                onClick={onBackspace}
                                className={cn("box", "w-[42px] sm:w-[58px]")}
                            >
                                <DeleteIcon className="size-5 sm:size-7" />
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
    onClick: (ch: string) => void;
};

const Box = ({ ch, onClick, hiYellow, hiGreen }: BoxProps) => {
    return (
        <div
            className={cn(
                "box",
                hiYellow && "bg-amber-400 active:bg-amber-500",
                hiGreen && "bg-emerald-400 active:bg-emerald-500"
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
