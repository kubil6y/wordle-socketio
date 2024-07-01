import { Keyboard } from "@/components/keyboard";
import { Board } from "@/components/board";
import { useCanSubmit, useHasBackspaced, useWordle } from "@/hooks/use-wordle";
import { useEffect, useMemo } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { FlagIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useConfirm } from "@/hooks/use-confirm";

export const Wordle = () => {
    const {
        active,
        width,
        height,
        secretWord,
        letters,
        language,
        activeRowIndex,
        pastTries,
        coloredLetters,
        notFoundLetters,
        clearLetters,
        pushLetter,
        removeLetter,
        setData,
        setActive,
    } = useWordle();
    const canSubmit = useCanSubmit();
    const hasBackspaced = useHasBackspaced();

    const [GiveUpConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to give up."
    );

    useEffect(() => {
        function onGameOver(summary: {
            success: boolean;
            secretWord: string;
            duration: string;
        }) {
            if (summary.success) {
                toast.success("Congratz!");
            } else {
                toast.error(`'${summary.secretWord}' was the correct answer!`);
            }
            setActive(false);
        }

        socket.on("sp_game_over", onGameOver);

        return () => {
            socket.off("sp_game_over", onGameOver);
        };
    }, []);

    async function onSubmit() {
        if (letters.length !== width) {
            return;
        }
        const word = letters.join("");
        const response = await socket.emitWithAck("sp_try_word", {
            word,
        });
        if (response.ok) {
            setData(response.data);
            clearLetters();
        }
    }

    async function onGiveUp() {
        const ok = await confirm();
        if (ok) {
            clearLetters();
            socket.emit("sp_give_up");
        }
    }

    // Colored letters for keyboard
    const [greenLetters, yellowLetters] = useMemo(() => {
        const greenLetters = [];
        const yellowLetters = [];
        for (const item of coloredLetters) {
            if (item.color === "yellow") {
                yellowLetters.push(item.letter);
            } else if (item.color === "green") {
                greenLetters.push(item.letter);
            }
        }
        return [greenLetters, yellowLetters];
    }, [coloredLetters]);

    return (
        <>
            <GiveUpConfirmDialog />
            <div className="container mt-4 space-y-4 sm:mt-12 sm:space-y-4">
                <Board
                    width={width}
                    height={height}
                    letters={letters}
                    pastTries={pastTries}
                    activeRowIndex={activeRowIndex}
                    coloredLetters={coloredLetters}
                    notFoundLetters={notFoundLetters}
                    hasBackspaced={hasBackspaced}
                />

                <div className="mx-auto flex max-w-[600px] items-center justify-end">
                    {active && (
                        <Button variant="outline" onClick={onGiveUp}>
                            <FlagIcon className="size-4 mr-2 fill-primary" />
                            Give up
                        </Button>
                    )}
                </div>

                <div>
                    <Keyboard
                        language={language}
                        canSubmit={canSubmit}
                        onEnter={onSubmit}
                        onBackspace={removeLetter}
                        onClick={pushLetter}
                        greenLetters={greenLetters}
                        yellowLetters={yellowLetters}
                        notFoundLetters={notFoundLetters}
                    />
                </div>
            </div>
        </>
    );
};
