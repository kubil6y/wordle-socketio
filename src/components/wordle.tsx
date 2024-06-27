import { Keyboard } from "@/components/keyboard";
import { Board } from "@/components/board";
import { useCanSubmit, useWordle } from "@/hooks/use-wordle";
import { Button } from "./ui/button";

export const Wordle = () => {
    const {
        greenLetters,
        yellowLetters,
        notFoundLetters,
        pushLetter,
        removeLetter,
        submitWord,
        reset,
    } = useWordle();
    const canSubmit = useCanSubmit();

    return (
        <div className="space-y-4 sm:space-y-12">
            <Board />

            <div className="">
                <Keyboard
                    language="en"
                    canSubmit={canSubmit}
                    onEnter={submitWord}
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
