import {
    GameState,
    PlayerData,
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
import { getLanguageIcon } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FlagIcon } from "lucide-react";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { PlayerCard } from "@/components/player-card";

type LobbyParams = {
    code: string;
};

export const Lobby = () => {
    const navigate = useNavigate();
    const params = useParams<LobbyParams>();
    const lobbyModal = useLobbyModal();
    const multiWordle = useMultiWordle();

    const { isConnected } = useSocketStatus();
    const mpCanSubmit = useMPCanSubmit();
    const mpHasBackspaced = useMPHasBackspaced();
    const mpCanType = useMPCanType();
    const mpCanBackspace = useMPCanBackspace();

    const [hasAlreadyJoined, setHasAlreadyJoined] = useState<boolean>(false);
    const [shakeRowIndex, setShakeRowIndex] = useState<number>(-1);

    useEffect(() => {
        function onPlayersChanged(data: {
            players: PlayerData[];
            isAdmin: boolean;
            isOwnTurn: boolean;
        }) {
            multiWordle.setPlayersData(data);
        }

        function onStart(data: {
            width: number;
            height: number;
            secretWord: string;
            gameState: string;
            players: PlayerData[];
        }) {
            multiWordle.setData(data);
            lobbyModal.close();
        }

        // TODO check later
        function onNotValidWord(rowIndex: number) {
            setShakeRowIndex(rowIndex);
            setTimeout(() => {
                setShakeRowIndex(-1);
            }, 1000);
        }

        socket.on("mp_game_start", onStart);
        socket.on("mp_players_changed", onPlayersChanged);
        socket.on("mp_not_valid_word", onNotValidWord);

        return () => {
            socket.off("mp_game_start", onStart);
            socket.off("mp_players_changed", onPlayersChanged);
            socket.off("mp_not_valid_word", onNotValidWord);
        };
    }, []);

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
                // on refresh some data will be lost
                // i should be sending the whole game state from server
                if (multiWordle.gameState !== GameState.GamePlaying) {
                    multiWordle.setLobbyData(response.data);
                    setHasAlreadyJoined(
                        response.data.hasAlreadyJoined ?? false,
                    );
                }
            }
        }
        checkHasGame();
    }, [params]);

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

    function onGiveUp() {
        console.log("onGiveUp()");
    }

    const LanguageIcon = getLanguageIcon(multiWordle.language);

    return (
        <>
            <LobbyModal hasAlreadyJoined={hasAlreadyJoined} />

            <div className="container mt-4 space-y-4 sm:mt-12 sm:space-y-4">
                <Board
                    width={multiWordle.width}
                    height={multiWordle.height}
                    letters={multiWordle.letters}
                    pastTries={multiWordle.pastTries}
                    pastTryResults={multiWordle.pastTryResults}
                    activeRowIndex={multiWordle.activeRowIndex}
                    hasBackspaced={mpHasBackspaced}
                    shakeRowIndex={shakeRowIndex}
                />

                <div className="mx-auto flex max-w-[600px] items-start justify-between">
                    <div className="w-[120px]"></div>

                    <div className="flex items-center gap-4">
                        {multiWordle.players.map((player) => {
                            return (
                                <PlayerCard
                                    selected={player.isOwnTurn}
                                    player={player}
                                    key={player.sessionId}
                                    hiGrayscale={!player.isOwnTurn}
                                    bordered
                                />
                            );
                        })}
                    </div>

                    <div className="flex min-w-[120px] items-center gap-2">
                        <LanguageIcon className="size-5 inline" />

                        {multiWordle.isAdmin && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={onGiveUp}
                                    disabled={!isConnected}
                                >
                                    <FlagIcon className="size-4 mr-2 fill-primary" />
                                    Give up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <Keyboard
                    language={multiWordle.language}
                    pastTries={multiWordle.pastTries}
                    pastTryResults={multiWordle.pastTryResults}
                    canSubmit={mpCanSubmit} // TODO
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
