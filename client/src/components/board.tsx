import { cn } from "@/lib/utils";
import { LetterColor } from "@/hooks/use-wordle";

type BoardProps = {
    width: number;
    height: number;
    letters: string[];
    pastTries: string[];
    pastTryResults: LetterColor[][];
    activeRowIndex: number;
    hasBackspaced: boolean;
};

export const Board = ({
    width,
    height,
    letters,
    pastTries,
    pastTryResults,
    activeRowIndex,
    hasBackspaced,
}: BoardProps) => {
    return (
        <div className="flex flex-col items-center gap-2">
            {new Array(height).fill(null).map((_, rowIndex) => {
                return (
                    <div className="flex gap-1.5" key={rowIndex}>
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
                                )

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

type BoardCellColor = LetterColor | "none";
type BoardCellProps = {
    ch?: string;
    hiActive: boolean;
    hiColor: BoardCellColor;
    animate: boolean;
};

export const BoardCell = ({
    ch,
    hiActive,
    hiColor,
    animate,
}: BoardCellProps) => {
    return (
        <div
            className={cn(
                "size-[52px] sm:size-[60px] flex select-none items-center justify-center border-[2px] border-zinc-300  dark:border-zinc-700",
                animate && "animate-scale border-red-500",
                getBoardCellStyles(hiActive, hiColor),
                //hiYellow && "bg-amber-500 text-white dark:bg-amber-500",
                //hiGreen && "bg-emerald-500 text-white dark:bg-emerald-500",
                //hiNotFound && "bg-zinc-600 text-white dark:bg-zinc-600",
                //hiActive && "border-zinc-600 dark:border-zinc-300",
                //(hiYellow || hiGreen || hiNotFound) && "border-none"
            )}
        >
            <p className="text-3xl font-semibold  uppercase">{ch}</p>
        </div>
    );
};

function getBoardCellStyles(active: boolean, color: BoardCellColor) {
    if (active) {
        return "border-zinc-600 dark:border-zinc-300"
    }
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

//const hiActive =
//activeRowIndex === rowIndex &&
//letters.length > i;

/*
{new Array(width).fill(null).map((_, i) => {
                            let ch = "";
                            if (letters[i]) {
                                ch = letters[i];
                            }
                            const hiActive =
                                activeRowIndex === rowIndex &&
                                letters.length > i;

                            const animate =
                                letters.length === i + 1 &&
                                activeRowIndex === rowIndex &&
                                !hasBackspaced;

                            if (pastTries.length === 0) {
                                return (
                                    <BoardCell
                                        key={`${rowIndex}:${i}`}
                                        ch={ch}
                                        hiActive={hiActive}
                                        hiColor={"none"}
                                        animate={false}
                                    />
                                );
                            }

                            const isPastTryRow =
                                pastTryResults.length > rowIndex;
                            if (isPastTryRow) {
                                const ch = pastTries[rowIndex][i];
                                const hiColor: BoardCellColor =
                                    pastTryResults[rowIndex][i];

                                return (
                                    <BoardCell
                                        key={`${rowIndex}:${i}`}
                                        ch={ch}
                                        hiActive={hiActive}
                                        hiColor={hiColor}
                                        animate={false}
                                    />
                                );
                            }
                            if (activeRowIndex === rowIndex) {
                                let ch = "";
                                if (letters[i]) {
                                    ch = letters[i];
                                }
                                const hiColor: BoardCellColor = "none";
                                const animate =
                                    letters.length === i + 1 &&
                                    activeRowIndex === rowIndex &&
                                    !hasBackspaced;
                                return (
                                    <BoardCell
                                        key={`${rowIndex}:${i}`}
                                        ch={ch}
                                        hiActive={hiActive}
                                        hiColor={hiColor}
                                        animate={animate}
                                    />
                                );
                            } else {
                                let ch = "";
                                //if (pastTries[rowIndex][i]) {
                                //ch = pastTries[rowIndex][i];
                                //}
                                const hiColor = pastTryResults[rowIndex][i];
                                //let hiColor = "none"
                                const animate =
                                    letters.length === i + 1 &&
                                    activeRowIndex === rowIndex &&
                                    !hasBackspaced;
                                return (
                                    <BoardCell
                                        key={`${rowIndex}:${i}`}
                                        ch={ch}
                                        hiActive={hiActive}
                                        hiColor={hiColor}
                                        animate={animate}
                                    />
                                );
                            }
                        })}
*/
