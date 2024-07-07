import { Logger } from "./logger";
import { Words } from "./words";
import { formatTimestamps } from "./utils";

export const GAME_WIDTH = 5;
export const GAME_HEIGHT = 6;

export type Language = "en" | "tr";
export type GameType = "singleplayer" | "multiplayer";

type LetterColor = "green" | "yellow" | "black";

export class Wordle {
    private _ownerSessionId: string;

    private _words: Words;
    private _active: boolean;
    private _success: boolean;
    private _secretWord: string;
    private _activeRowIndex: number;
    private _language: Language;

    private _pastTries: string[];
    private _pastTryResults: LetterColor[][];

    private _startTimestamp: number;
    private _endTimestamp: number;

    public constructor(
        ownerSessionId: string,
        words: Words,
        language: Language
    ) {
        this._words = words;
        this._language = language;
        this._ownerSessionId = ownerSessionId;
        this._activeRowIndex = 0;
        this._pastTries = [];
        this._pastTryResults = [];
        this._startTimestamp = Date.now();
        this._endTimestamp = 0;
        this._active = true;
        this._success = false;
        this.generateRandomWord();
    }

    public processWord(word: string) {
        if (!this._active) {
            return;
        }

        const result: LetterColor[] = new Array(this._secretWord.length).fill("");
        const chMap = new Map<string, number>();
        for (const letter of this._secretWord) {
            const letterCount = chMap.get(letter) ?? 0;
            chMap.set(letter, letterCount + 1);
        }

        // greens
        for (let i = 0; i < word.length; i++) {
            const ch = word[i];
            if (this._secretWord[i] === ch) {
                result[i] = "green";
                chMap.set(ch, chMap.get(ch)! - 1);
            }
        }

        // yellows and blacks
        for (let i = 0; i < word.length; i++) {
            const ch = word[i];
            const letterCount = chMap.get(ch) ?? 0;
            if (this._secretWord[i] !== ch && this._secretWord.includes(ch)) {
                if (letterCount > 0) {
                    result[i] = "yellow";
                } else {
                    result[i] = "black";
                }
            }
        }

        // blacks
        for (let i = 0; i < word.length; i++) {
            const ch = word[i];
            if (!this._secretWord.includes(ch)) {
                result[i] = "black";
            }
        }

        this._pastTryResults.push(result);
        this._pastTries.push(word);
        this._activeRowIndex++;

        if (this._secretWord === word) {
            this._success = true;
            this._active = false;
            this._endTimestamp = Date.now();
        } else if (this._pastTries.length === GAME_HEIGHT) {
            this._success = false;
            this._active = false;
            this._endTimestamp = Date.now();
        }

        console.log(this._pastTryResults); // TODO
    }

    public getData() {
        return {
            active: this._active,
            activeRowIndex: this._activeRowIndex,
            pastTries: this._pastTries,
            pastTryResults: this._pastTryResults,
        };
    }

    public getConfig() {
        return {
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            secretWord: this._secretWord,
            language: this._language,
        };
    }

    public getSummary() {
        return {
            success: this._success,
            secretWord: this._secretWord,
            duration: formatTimestamps(
                this._startTimestamp,
                this._endTimestamp
            ),
            tries: this._pastTries.length,
        };
    }

    public getActiveRowIndex(): number {
        return this._activeRowIndex;
    }

    public getSecretWord(): string {
        return this._secretWord;
    }

    public giveUp() {
        this._active = false;
        this._success = false;
        this._endTimestamp = Date.now();
    }

    public isOver(): boolean {
        return !this._active;
    }

    public isValidWord(word: string): boolean {
        return this._words.includes(word, this._language);
    }

    public generateRandomWord() {
        const secretWord = this._words.getRandomWord(this._language);
        this._secretWord = secretWord;
        Logger.debug(
            `Wordle.generateRandomWord "${secretWord}" sessionId ${this._ownerSessionId}`
        );
    }

    public replay() {
        this.generateRandomWord();
        this._active = true;
        this._success = false;
        this._activeRowIndex = 0;
        this._pastTries = [];
        this._pastTryResults = [];
        this._startTimestamp = Date.now();
    }
}
