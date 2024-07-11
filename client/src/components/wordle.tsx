import { Board } from "@/components/board";
import { socket } from "@/lib/socket";
import { Keyboard } from "@/components/keyboard";
import { useEffect } from "react";
import { FlagIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { SPGameOverModal } from "./sp-game-over-modal";
import { useSPGameOverModal } from "@/hooks/use-sp-game-over-modal";
import { getLanguageIcon } from "@/lib/utils";
import { useCanSubmit, useHasBackspaced, useWordle } from "@/hooks/use-wordle";

export const Wordle = () => {
    const {
        active,
        width,
        height,
        letters,
        language,
        activeRowIndex,
        pastTries,
        pastTryResults,
        clearLetters,
        pushLetter,
        removeLetter,
        setData,
        setGameOver,
    } = useWordle();
    const canSubmit = useCanSubmit();
    const hasBackspaced = useHasBackspaced();
    const spGameOverModal = useSPGameOverModal();

    const [GiveUpConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to give up."
    );

    useEffect(() => {
        function onGameOver({
            success,
            secretWord,
            duration,
        }: {
            success: boolean;
            secretWord: string;
            duration: string;
            tries: number;
        }) {
            setGameOver({
                success,
                duration,
                secretWord,
            });
            spGameOverModal.open();
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

    const LanguageIcon = getLanguageIcon(language);

    return (
        <>
            <SPGameOverModal />
            <GiveUpConfirmDialog />

            <div className="container mt-4 space-y-4 sm:mt-12 sm:space-y-4">
                <Board
                    width={width}
                    height={height}
                    letters={letters}
                    pastTries={pastTries}
                    pastTryResults={pastTryResults}
                    activeRowIndex={activeRowIndex}
                    hasBackspaced={hasBackspaced}
                />

                {active && (
                    <div className="mx-auto flex max-w-[600px] items-center justify-end">
                        <div className="flex items-center gap-2">
                            <LanguageIcon className="size-5" />
                            <Button variant="outline" onClick={onGiveUp}>
                                <FlagIcon className="size-4 mr-2 fill-primary" />
                                Give up
                            </Button>
                        </div>
                    </div>
                )}

                <div>
                    <Keyboard
                        language={language}
                        pastTries={pastTries}
                        pastTryResults={pastTryResults}
                        canSubmit={canSubmit}
                        onEnter={onSubmit}
                        onBackspace={removeLetter}
                        onClick={pushLetter}
                    />
                </div>
            </div>
        </>
    );
};
