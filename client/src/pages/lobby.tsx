import {
    GameState,
    Player,
    useMPCanBackspace,
    useMPCanSubmit,
    useMPCanType,
    useMPHasBackspaced,
    useMultiWordle,
} from "@/hooks/use-multi-wordle";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LobbyModal } from "@/components/lobby-modal";
import { useLobbyModal } from "@/hooks/use-lobby-modal";
import { Board } from "@/components/board";
import { Keyboard } from "@/components/keyboard";

type LobbyParams = {
    code: string;
};

export const Lobby = () => {
    const multiWordle = useMultiWordle();
    const navigate = useNavigate();
    const params = useParams<LobbyParams>();

    const lobbyModal = useLobbyModal();
    const mpCanSubmit = useMPCanSubmit();
    const [hasAlreadyJoined, setHasAlreadyJoined] = useState<boolean>(false);

    const mpHasBackspaced = useMPHasBackspaced();
    const mpCanType= useMPCanType();
    const mpCanBackspace = useMPCanBackspace();

    useEffect(() => {
        async function checkHasGame() {
            const response = await socket.emitWithAck("mp_has_game", {
                code: params.code,
            });

            if (!response.ok) {
                navigate("/");
                toast.error("Game not found!");
            } else {
                // TODO this will cause issues!
                if (multiWordle.gameState !== GameState.GamePlaying) {
                    multiWordle.setLobbyData(response.data);
                    setHasAlreadyJoined(
                        response.data.hasAlreadyJoined ?? false
                    );
                }
            }
        }
        checkHasGame();
    }, [params]);

    useEffect(() => {
        function onPlayersChanged(players: Player[]) {
            multiWordle.setPlayersData(players);
        }

        function onStart(data: {
            width: number;
            height: number;
            secretWord: string;
            gameState: string;
            players: Player[];
        }) {
            multiWordle.setData(data);
            lobbyModal.close();
        }

        socket.on("mp_game_start", onStart);
        socket.on("mp_players_changed", onPlayersChanged);

        return () => {
            socket.off("mp_game_start", onStart);
            socket.off("mp_players_changed", onPlayersChanged);
        };
    }, []);

    async function onSubmit() {
        if (multiWordle.letters.length !== multiWordle.width) {
            return;
        }
        const word = multiWordle.letters.join("");
        console.log(word);
        //const response = await socket.emitWithAck("mp_try_word", {
        //word,
        //});
        //if (response.ok) {
        //multiWordle.setData(response.data);
        //multiWordle.clearLetters();
        //}
    }

    console.log(multiWordle.letters);

    return (
        <>
            <LobbyModal hasAlreadyJoined={hasAlreadyJoined} />
            {multiWordle.players.map((p) => (
                <p key={p.sessionId}>{p.username}</p>
            ))}
            {multiWordle.gameState}

            <div className="container mt-4 space-y-4 sm:mt-12 sm:space-y-4">
                <Board
                    width={multiWordle.width}
                    height={multiWordle.height}
                    letters={multiWordle.letters}
                    pastTries={multiWordle.pastTries}
                    pastTryResults={multiWordle.pastTryResults}
                    activeRowIndex={multiWordle.activeRowIndex}
                    hasBackspaced={mpHasBackspaced}
                />

                <Keyboard
                    language={multiWordle.language}
                    pastTries={multiWordle.pastTries}
                    pastTryResults={multiWordle.pastTryResults}
                    canSubmit={true}
                    //canSubmit={mpCanSubmit}
                    onEnter={onSubmit}
                    onBackspace={multiWordle.removeLetter}
                    onClick={multiWordle.pushLetter}
                    canType={mpCanType}
                    canBackspace={mpCanBackspace}
                />
            </div>
        </>
    );
};
