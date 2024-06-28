import { wordFreq } from "@/lib/utils";
import { scaleLog } from "@visx/scale";
import { Wordcloud } from "@visx/wordcloud";
import { Text } from "@visx/text";
import { Theme, useTheme } from "@/providers/theme-provider";
import { useMedia } from "react-use";
import { waspCharismaLyrics } from "@/data/wasp-charisma-lyrics";
import { useMemo } from "react";

export function MyWordCloud() {
    const { theme } = useTheme();
    const colors = getTextColors(theme);
    const [width, height] = getCloudDimensions();

    const words = useMemo(() => {
        return wordFreq(waspCharismaLyrics);
    }, [waspCharismaLyrics]);

    const fontScale = useMemo(() => {
        return scaleLog({
            domain: [
                Math.min(...words.map((w) => w.value)),
                Math.max(...words.map((w) => w.value)),
            ],
            range: [20, 100],
        });
    }, [words]);

    return (
        <div className="mx-auto mt-8 flex aspect-square max-w-xl select-none items-center justify-center sm:mt-4 md:mt-0">
            <Wordcloud
                words={words}
                width={width}
                height={height}
                fontSize={(data) => fontScale(data.value)}
                font={"Impact"}
                padding={2}
                spiral="rectangular"
                rotate={0}
                random={() => 0.5}
            >
                {(cloudWords) =>
                    cloudWords.map((w, i) => (
                        <Text
                            key={w.text}
                            fill={colors[i % colors.length]}
                            textAnchor="middle"
                            transform={`translate(${w.x}, ${w.y})`}
                            fontSize={w.size}
                            fontFamily={w.font}
                        >
                            {w.text}
                        </Text>
                    ))
                }
            </Wordcloud>
        </div>
    );
}

function getTextColors(theme: Theme) {
    switch (theme) {
        case "light":
            return ["#131313", "#7f1d1d", "#b91c1c"];
        default:
        case "dark":
            return ["#f8fafc", "#b91c1c", "#fca5a5"];
    }
}

function getCloudDimensions(): [number, number] {
    const isMobile = useMedia("(max-width: 480px)");
    if (isMobile) {
        return [320, 320];
    }
    return [480, 480];
}
