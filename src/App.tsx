import { Keyboard } from "@/components/keyboard";
import { useState } from "react";
import { ThemeSwitcher } from "./components/theme-switcher";

const MAX_CHAR_LENGTH = 5;

export function App() {
    const [letters, setLetters] = useState<string[]>([]);

    function onEnter(): void {
        if (!letters.length) {
            return;
        }
        console.log(letters.join(""));
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
        <div className="px-1 py-8">
            <ThemeSwitcher />
            <Keyboard
                language="en"
                onEnter={onEnter}
                onBackspace={onBackspace}
                onClick={onClick}
                greenLetters={["x", "y", "a"]}
                yellowLetters={["b", "j", "k", "o"]}
                notFoundLetters={["a", "u", "g"]}
            />
            <div className="text-5xl">{letters.join("").toUpperCase()}</div>
        </div>
    );
}
