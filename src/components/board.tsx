import { cn } from "@/lib/utils";
import { useHasBackspaced, useWordle } from "@/hooks/use-wordle";

export const Board = () => {
    const { activeRowIndex, width, height, pastTries, letters } = useWordle();
    const hasBackspaced = useHasBackspaced();
    const activeWord = letters.join("");
    const currentLetterIndex = letters.length;
    return (
        <div className="flex flex-col items-center gap-2">
            {new Array(height).fill(null).map((_, rowIndex) => {
                return (
                    <div className="flex gap-1.5" key={rowIndex}>
                        {new Array(width).fill(null).map((_, i) => {
                            let ch = "";
                            if (activeRowIndex === rowIndex) {
                                ch = activeWord[i];
                            } else if (pastTries.length > rowIndex) {
                                ch = pastTries[rowIndex][i];
                            }

                            let animate = false;
                            if (
                                currentLetterIndex === i + 1 &&
                                activeRowIndex === rowIndex &&
                                !hasBackspaced
                            ) {
                                animate = true;
                            }

                            const hiActive =
                                activeRowIndex === rowIndex &&
                                letters.length > i;
                            const hiGreen = false;
                            const hiYellow = false;
                            const hiNotFound = false;

                            return (
                                <Cell
                                    key={`${rowIndex}:${i}`}
                                    ch={ch}
                                    hiActive={hiActive}
                                    hiGreen={hiGreen}
                                    hiYellow={hiYellow}
                                    hiNotFound={hiNotFound}
                                    animate={animate}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

type CellProps = {
    ch?: string;
    hiActive: boolean;
    hiGreen: boolean;
    hiYellow: boolean;
    hiNotFound: boolean;
    animate: boolean;
};

export const Cell = ({
    ch,
    hiActive,
    hiGreen,
    hiYellow,
    hiNotFound,
    animate,
}: CellProps) => {
    return (
        <div
            className={cn(
                "size-[52px] sm:size-[60px] flex select-none items-center justify-center border-[2px] border-zinc-300  dark:border-zinc-700",
                animate && "animate-scale border-red-500",
                hiYellow && "bg-amber-500 text-white dark:bg-amber-500",
                hiGreen && "bg-emerald-500 text-white dark:bg-emerald-500",
                hiNotFound && "bg-zinc-600 text-white dark:bg-zinc-600",
                hiActive && "border-zinc-600 dark:border-zinc-300"
            )}
        >
            <p className="text-3xl font-semibold  uppercase">{ch}</p>
        </div>
    );
};
