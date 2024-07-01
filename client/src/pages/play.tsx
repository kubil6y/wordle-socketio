import { NewGameModal } from "@/components/new-game-modal";
import { Wordle } from "@/components/wordle";
import { useNewGameModal } from "@/hooks/use-new-game-modal";
import { useWordle } from "@/hooks/use-wordle";
import { socket } from "@/lib/socket";
import { useEffect } from "react";

export const PlayPage = () => {
    const newGameModal = useNewGameModal();
    const { setConfig, setData } = useWordle();

    useEffect(() => {
        async function hasGame() {
            const response = await socket.emitWithAck("sp_has_game");
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
            <NewGameModal isClosable={false} />
            <Wordle />
        </div>
    );
};
