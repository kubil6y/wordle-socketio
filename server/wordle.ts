import { Logger } from "./logger";
import { formatTimestamps } from "./utils";
import { Words, words } from "./words";
import { createId } from "@paralleldrive/cuid2";

export const GAME_WIDTH = 5;
export const GAME_HEIGHT = 6;

export type Language = "en" | "tr";
export type GameType = "singleplayer" | "multiplayer";

type LetterData = {
    index: number;
    color: string;
    letter: string;
};

export class Wordle {
    private _gameId: string;
    private _ownerSessionId: string;

    private _words: Words;
    private _active: boolean;
    private _success: boolean;
    private _secretWord: string;
    private _activeRowIndex: number;
    private _language: Language;
    private _pastTries: string[];
    private _coloredLetters: LetterData[];
    private _notFoundLetters: Set<string>;

    private _startTimestamp: number;
    private _endTimestamp: number;

    public constructor(
        ownerSessionId: string,
        words: Words,
        language: Language,
    ) {
        this._gameId = createId();
        this._words = words;
        this._language = language;
        this._ownerSessionId = ownerSessionId;
        this._activeRowIndex = 0;
        this._coloredLetters = [];
        this._pastTries = [];
        this._notFoundLetters = new Set<string>();
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

        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            // letter not found
            if (!this._secretWord.includes(letter)) {
                this._notFoundLetters.add(letter);
            } else {
                // has letter
                // same position
                if (this._secretWord[i] === letter) {
                    this._coloredLetters.push({
                        index: i,
                        letter,
                        color: "green",
                    });
                } else {
                    this._coloredLetters.push({
                        index: i,
                        letter,
                        color: "yellow",
                    });
                }
            }
        }

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
    }

    public getData() {
        return {
            active: this._active,
            coloredLetters: this._coloredLetters,
            notFoundLetters: Array.from(this._notFoundLetters),
            activeRowIndex: this._activeRowIndex,
            pastTries: this._pastTries,
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
        //const secretWord = this._words.getRandomWord(this._language);
        const secretWord = "düşeş";
        Logger.debug(`Wordle.generateRandomWord "${secretWord}" sessionId ${this._ownerSessionId}`);
        this._secretWord = secretWord;
    }

    public replay() {
        this.generateRandomWord();
        this._startTimestamp = Date.now();
        this._active = true;
        this._success = false;
        this._pastTries = [];
        this._coloredLetters = [];
        this._notFoundLetters.clear();
        this._activeRowIndex = 0;
    }
}

