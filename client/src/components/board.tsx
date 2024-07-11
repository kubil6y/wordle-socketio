import { cn } from "@/lib/utils";
import { LetterCellColor, LetterColor } from "@/hooks/use-wordle";

type BoardProps = {
    width: number;
    height: number;
    letters: string[];
    pastTries: string[];
    pastTryResults: LetterColor[][];
    activeRowIndex: number;
    hasBackspaced: boolean;
    shakeRowIndex: number;
};

export const Board = ({
    width,
    height,
    letters,
    pastTries,
    pastTryResults,
    activeRowIndex,
    hasBackspaced,
    shakeRowIndex,
}: BoardProps) => {
    return (
        <div className="flex flex-col items-center gap-2">
            {new Array(height).fill(null).map((_, rowIndex) => {
                const shake = shakeRowIndex === rowIndex;
                return (
                    <div
                        className={cn("flex gap-1.5", shake && "animate-shake")}
                        key={rowIndex}
                    >
                        {new Array(width).fill(null).map((_, i) => {
                            // Active row
                            if (activeRowIndex === rowIndex) {
                                const animate =
                                    letters.length === i + 1 && !hasBackspaced;
                                return (
                                    <BoardCell
                                        key={`${rowIndex}:${i}`}
                                        ch={letters[i] ?? ""}
                                        hiActive={letters.length > i}
                                        hiColor={"none"}
                                        animate={animate}
                                    />
                                );
                            }

                            // Past tries
                            if (pastTries.length > rowIndex) {
                                const ch = pastTries[rowIndex][i];
                                const hiColor = pastTryResults[rowIndex][i];
                                return (
                                    <BoardCell
                                        key={`${rowIndex}:${i}`}
                                        ch={ch}
                                        hiActive={false}
                                        hiColor={hiColor}
                                        animate={false}
                                    />
                                );
                            }

                            // Empty rows
                            return (
                                <BoardCell
                                    key={`${rowIndex}:${i}`}
                                    hiColor={"none"}
                                    hiActive={false}
                                    animate={false}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

type BoardCellProps = {
    ch?: string;
    animate?: boolean;
    hiActive?: boolean;
    hiColor: LetterCellColor;
};

export const BoardCell = ({
    ch,
    hiColor,
    hiActive = false,
    animate = false,
}: BoardCellProps) => {
    return (
        <div
            className={cn(
                "size-[52px] sm:size-[60px] flex select-none items-center justify-center border-[2px] border-zinc-300  dark:border-zinc-700",
                animate && "animate-scale border-red-500",
                getBoardCellStyles(hiActive, hiColor)
            )}
        >
            <p className="text-3xl font-semibold  uppercase">{ch}</p>
        </div>
    );
};

function getBoardCellStyles(active: boolean, color: LetterCellColor) {
    if (active) {
        return "border-zinc-600 dark:border-zinc-300";
    }
    switch (color) {
        case "green":
            return "border-none bg-emerald-500 text-white dark:bg-emerald-500";
        case "yellow":
            return "border-none bg-amber-500 text-white dark:bg-amber-500";
        case "black":
            return "border-none bg-zinc-600 text-white dark:bg-zinc-600";
        case "none":
            return "";
    }
}
