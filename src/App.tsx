import { Keyboard } from "@/components/keyboard";
import { ThemeSwitcher } from "./components/theme-switcher";
import { Board } from "./components/board";
import { useCanSubmit, useWordle } from "./hooks/use-wordle";
import { Button } from "./components/ui/button";
import { SoundControls } from "./components/sound-controls";

export function App() {
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
        <div className="container px-1 py-8">
            <div className="flex gap-2">
                <Button onClick={reset}>reset</Button>
                <ThemeSwitcher />
                <SoundControls />
            </div>

            <Board />

            <div className="mt-10">
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
}
