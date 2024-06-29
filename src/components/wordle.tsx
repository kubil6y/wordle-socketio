import { Keyboard } from "@/components/keyboard";
import { Board } from "@/components/board";
import { useCanSubmit, useHasBackspaced, useWordle } from "@/hooks/use-wordle";

export const Wordle = () => {
    const {
        width,
        height,
        letters,
        language,
        activeRowIndex,
        pastTries,
        greenLetters,
        yellowLetters,
        notFoundLetters,
        pushLetter,
        removeLetter,
        submitWord,
        reset,
    } = useWordle();
    const canSubmit = useCanSubmit();
    const hasBackspaced = useHasBackspaced();

    return (
        <div className="space-y-4 sm:space-y-12">
            <Board
                width={width}
                height={height}
                letters={letters}
                pastTries={pastTries}
                activeRowIndex={activeRowIndex}
                greenLetters={greenLetters}
                yellowLetters={yellowLetters}
                notFoundLetters={notFoundLetters}
                hasBackspaced={hasBackspaced}
            />

            <div className="">
                <Keyboard
                    language={language}
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
