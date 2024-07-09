import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Player, useMultiWordle } from "@/hooks/use-multi-wordle";
import { LobbyWelcomeModal } from "@/components/lobby-welcome-modal";
import { useLobbyModal } from "@/hooks/use-lobby-modal";

type LobbyParams = {
    code: string;
};

export const Lobby = () => {
    const { setPlayersData, setLobbyData } = useMultiWordle();
    const navigate = useNavigate();
    const params = useParams<LobbyParams>();

    const lobbyModal = useLobbyModal();
    const [hasAlreadyJoined, setHasAlreadyJoined] = useState<boolean>(false);

    useEffect(() => {
        async function checkHasGame() {
            const response = await socket.emitWithAck("mp_has_game2", {
                code: params.code,
            });

            if (!response.ok) {
                toast.error("Game not found!");
                navigate("/");
            } else {
                setLobbyData(response.data);
                setHasAlreadyJoined(response.data.hasAlreadyJoined ?? false);
                lobbyModal.open();
            }
        }
        checkHasGame();
    }, [params]);

    useEffect(() => {
        function onPlayersChanged(players: Player[]) {
            setPlayersData(players);
        }

        socket.on("players_changed", onPlayersChanged);

        return () => {
            socket.off("players_changed", onPlayersChanged);
        };
    }, []);

    return (
        <>
            <LobbyWelcomeModal
                hasAlreadyJoined={hasAlreadyJoined}
            />
        </>
    );
};
