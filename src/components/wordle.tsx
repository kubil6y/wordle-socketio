import { Keyboard } from "@/components/keyboard";
import { Board } from "@/components/board";
import { useCanSubmit, useHasBackspaced, useWordle } from "@/hooks/use-wordle";
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";

export const Wordle = () => {
    const {
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
    } = useWordle();
    const canSubmit = useCanSubmit();
    const hasBackspaced = useHasBackspaced();

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

    // Colored letters for keyboard
    const greenLetters = [];
    const yellowLetters = [];
    for (const item of coloredLetters) {
        if (item.color === "yellow") {
            yellowLetters.push(item.letter);
        } else if (item.color === "green") {
            greenLetters.push(item.letter);
        }
    }

    return (
        <div className="space-y-4 sm:space-y-12 mt-4 sm:mt-12">
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

            <div className="">
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
    );
};
