import { Player, useMultiWordle } from "@/hooks/use-multi-wordle";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { LobbyWelcomeModal } from "@/components/lobby-welcome-modal";

type LobbyParams = {
    code: string;
};

export const Lobby = () => {
    const [welcomeModalOpen, setWelcomeModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const params = useParams<LobbyParams>();

    const { setData, hasUsedJoined, setPlayersData } = useMultiWordle();

    // TODO important it should only be possible to join from main menu
    // or on create
    // if i have the same code on client it means we get from join game!
    // it should only be possible to join game from main menu!
    // so client state if its empty than and has not have the code redirect
    useEffect(() => {
        async function checkHasGame() {
            const response = await socket.emitWithAck("mp_has_game", {
                code: params.code,
            });

            if (!response.ok) {
                toast.error("Game not found!");
                navigate("/");
            } else {
                setData(response.data);
                setWelcomeModalOpen(true);
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
                open={welcomeModalOpen}
                setOpen={setWelcomeModalOpen}
            />
        </>
    );
};
