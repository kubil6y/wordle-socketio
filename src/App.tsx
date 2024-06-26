import { Keyboard } from "@/components/keyboard";
import { useState } from "react";
import { ThemeSwitcher } from "./components/theme-switcher";
import { Board } from "./components/board";

const MAX_CHAR_LENGTH = 5;

export function App() {
    const [letters, setLetters] = useState<string[]>([]);
    const [pastTries, setPastTries] = useState<string[]>([]);
    const [activeRowIndex, setActiveRowIndex] = useState<number>(0);

    function onEnter(): void {
        if (!letters.length || letters.length !== MAX_CHAR_LENGTH) {
            return;
        }
        setPastTries((prev) => {
            return [...prev, letters.join("")];
        });
        setActiveRowIndex((prev) => prev + 1);
        setLetters([]);
    }

    function onBackspace(): void {
        if (letters.length === 0) {
            return;
        }
        const copied = [...letters];
        copied.pop();
        setLetters(copied);
    }

    function onClick(ch: string): void {
        if (letters.length >= MAX_CHAR_LENGTH) {
            return;
        }
        const copied = [...letters];
        copied.push(ch);
        setLetters(copied);
    }

    return (
        <div className="container px-1 py-8">
            <ThemeSwitcher />
            <Board
                width={5}
                height={6}
                activeWord={letters.join("")}
                activeRowIndex={activeRowIndex}
                pastTries={pastTries}
                currentLetterIndex={letters.length}
            />
            <div className="mt-10">
                <Keyboard
                    language="en"
                    onEnter={onEnter}
                    onBackspace={onBackspace}
                    onClick={onClick}
                    greenLetters={["x", "y", "a"]}
                    yellowLetters={["b", "j", "k", "o"]}
                    notFoundLetters={["a", "u", "g"]}
                />
            </div>
        </div>
    );
}
