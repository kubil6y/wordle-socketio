import { Icons } from "@/components/icons";
import { Language } from "@/hooks/use-wordle";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// https://airbnb.io/visx/wordcloud
export interface WordData {
    text: string;
    value: number;
}

export function wordFreq(text: string): WordData[] {
    const words: string[] = text.replace(/\./g, "").split(/\s/);
    const freqMap: Record<string, number> = {};
    for (const w of words) {
        if (!freqMap[w]) freqMap[w] = 0;
        freqMap[w] += 1;
    }
    return Object.keys(freqMap).map((word) => ({
        text: word,
        value: freqMap[word],
    }));
}

export function showConnectionLostToast(isHome: boolean, actionCallback?: () => void): void {
    if (isHome) {
        toast.error("Connection lost!");
    } else {
        toast.error("Connection lost!", {
            description: "Reconnecting...",
            action: {
                label: "Home",
                onClick: () => {
                    if (actionCallback) {
                        actionCallback();
                    }
                }, 
            },
        });
    }
}

export function getLanguageIcon(language: Language) {
    switch (language) {
        case "en":
            return Icons.flag.en;
        case "tr":
            return Icons.flag.tr;
    }
}

