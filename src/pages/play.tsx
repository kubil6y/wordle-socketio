import { Wordle } from "@/components/wordle";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const PlayPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        async function hasGame() {
            const response = await socket.emitWithAck("has_game", {
                gameType: "singleplayer",
            });
            if (!response.ok) {
                toast.error("Game not found!");
                navigate("/");
            }
        }
        hasGame();
    }, []);
    return (
        <div>
            <Wordle />
        </div>
    );
};
