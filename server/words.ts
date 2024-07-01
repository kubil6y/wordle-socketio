import fs from "fs";
import { Language } from "./wordle";

export class Words {
    private _en: string[];
    private _tur: string[];

    public constructor() {
        this.load();
    }

    private load() {
        this._tur = fs
            .readFileSync("data/tur_wordlist.txt", "utf8")
            .split("\n")
            .filter((word) => word.trim() !== "");

        this._en = fs
            .readFileSync("data/en_wordlist.txt", "utf8")
            .split("\n")
            .filter((word) => word.trim() !== "");
    }

    public getRandomWord(language: Language): string {
        switch (language) {
            case "tr":
                return this._tur[Math.floor(Math.random() * this._tur.length)];
            default:
            case "en":
                return this._en[Math.floor(Math.random() * this._en.length)];
        }
    }

    public includes(word: string, language: Language): boolean {
        switch (language) {
            case "tr":
                return this._tur.includes(word.toLowerCase());
            default:
            case "en":
                return this._en.includes(word.toLowerCase());
        }
    }
}

export const words = new Words();
