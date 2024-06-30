import { Wordle } from "@/components/wordle";
import { useNewGameModal } from "@/hooks/use-new-game-modal";
import { useWordle } from "@/hooks/use-wordle";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PlayPage = () => {
    const newGameModal = useNewGameModal();
    const { setConfig, setData } = useWordle();

    useEffect(() => {
        async function hasGame() {
            const response = await socket.emitWithAck("has_game", {
                gameType: "singleplayer",
            });
            console.log(response);
            if (!response.ok) {
                newGameModal.open();
            } else {
                setConfig(response.config);
                setData(response.data);
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
