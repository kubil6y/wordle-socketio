import { cn } from "@/lib/utils";
import { PlayerData } from "@/hooks/use-multi-wordle";
import { CrownIcon, PenToolIcon } from "lucide-react";

type PlayerCardProps = {
    player: PlayerData;
    showScore?: boolean;
    selected?: boolean;
    hiGrayscale?: boolean;
    bordered?: boolean;
};

export function PlayerCard({
    player,
    showScore = true,
    hiGrayscale = false,
    selected = false,
    bordered = false,
}: PlayerCardProps) {
    const avatarPath = `/avatars/${player.avatarId}.png`;
    return (
        <div className="flex select-none flex-col items-center justify-center">
            <div
                className={cn(
                    "relative",
                    bordered && "border-4 border-red-600",
                    bordered && !selected && "border-red-400",
                )}
            >
                <img
                    src={avatarPath}
                    className={cn(
                        "size-[64px] aspect-square",
                        hiGrayscale && "opacity-75 grayscale",
                    )}
                />

                {player.isAdmin && (
                    <div className="absolute right-0 top-0">
                        <CrownIcon className="size-5 fill-yellow-500 text-white" />
                    </div>
                )}
            </div>

            <div className="px-2 py-1">
                <p
                    className={cn(
                        "text-center text-sm",
                        selected && "font-semibold",
                    )}
                >
                    {selected && (
                        <PenToolIcon
                            className="size-5 mr-[1px] inline animate-pulse text-yellow-600"
                            style={{
                                transform: "scale(-1,1)",
                            }}
                        />
                    )}{" "}
                    {player.username}{" "}
                    {showScore && <span>({player.score})</span>}
                </p>
            </div>
        </div>
    );
}
