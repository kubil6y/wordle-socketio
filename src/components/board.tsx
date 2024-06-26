import { cn } from "@/lib/utils";

type BoardProps = {
    width: number;
    height: number;
    activeWord: string;
    activeRowIndex: number;
    pastTries: string[];
    currentLetterIndex: number;
};

export const Board = ({
    width,
    height,
    activeWord,
    activeRowIndex,
    pastTries,
    currentLetterIndex,
}: BoardProps) => {
    return (
        <div className="flex flex-col items-center gap-2">
            {new Array(height).fill(null).map((_, i) => {
                return (
                    <div className="flex gap-1.5">
                        {new Array(width).fill(null).map((_, j) => {
                            let ch = "";
                            if (activeRowIndex === i) {
                                ch = activeWord[j];
                            } else if (pastTries.length > i) {
                                ch = pastTries[i][j];
                            }

                            let animate = false;
                            if (currentLetterIndex === j +1 && activeRowIndex === i) {
                                animate = true;
                            }
                            return (
                                <Cell
                                    ch={ch}
                                    hiGreen={false}
                                    hiYellow={false}
                                    hiNotFound={false}
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
    hiGreen: boolean;
    hiYellow: boolean;
    hiNotFound: boolean;
    animate: boolean;
};

// 52px,60px
// dark:bg-zinc-400 bg-zinc-300
const Cell = ({ ch, hiGreen, hiYellow, hiNotFound, animate }: CellProps) => {
    return (
        <div
            className={cn(
                "size-[52px] sm:size-[60px] flex select-none items-center justify-center border-[2px] border-zinc-300  dark:border-zinc-700",
                animate && "border-red-500"
            )}
        >
            <p
                className={cn(
                    "text-3xl font-semibold  uppercase",
                    animate && "animate-scale"
                )}
            >
                {ch}
            </p>
        </div>
    );
};
