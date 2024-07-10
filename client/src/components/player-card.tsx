import { Player } from "@/hooks/use-multi-wordle";
import { CrownIcon } from "lucide-react";

type PlayerCardProps = {
    showScore?: boolean;
    player: Player;
};

export function PlayerCard({ player, showScore = true }: PlayerCardProps) {
    const avatarPath = `/avatars/${player.avatarId}.png`;
    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <img src={avatarPath} className="size-[64px] aspect-square" />

                {player.isAdmin && (
                    <div className="absolute right-0 top-0">
                        <CrownIcon className="size-5 fill-yellow-600 text-white" />
                    </div>
                )}
            </div>

            <div className="px-2 py-1">
                <p className="text-center text-sm font-semibold">
                    {player.username} {showScore && <span>({player.score})</span>}
                </p>
            </div>
        </div>
    );
}
