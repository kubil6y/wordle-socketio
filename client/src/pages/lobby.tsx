import {
    convertGameStateStringToEnum,
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
import { Language, LetterColor } from "@/hooks/use-wordle";
import { MPGameOverModal } from "@/components/mp-game-over-modal";
import { useMPGameOverModal } from "@/hooks/use-mp-game-over-modal";
import { useConfirm } from "@/hooks/use-confirm";

type OnGameData = {
    gameId: string;
    success: boolean;
    language: Language;
    gameState: string;
    duration: string;
    secretWord: string;
    serverActiveWord: string;
    isAdmin: boolean;
    isOwnTurn: boolean;
    activeRowIndex: number;
    players: PlayerData[];
    pastTries: string[];
    pastTryResults: LetterColor[][];
    invitationCode: string;
    hasAlreadyJoined: boolean;
};

type LobbyParams = {
    code: string;
};

export const Lobby = () => {
    const navigate = useNavigate();
    const params = useParams<LobbyParams>();
    const lobbyModal = useLobbyModal();
    const mpGameOverModal = useMPGameOverModal();
    const multiWordle = useMultiWordle();

    const { isConnected } = useSocketStatus();
    const mpCanSubmit = useMPCanSubmit();
    const mpHasBackspaced = useMPHasBackspaced();
    const mpCanType = useMPCanType();
    const mpCanBackspace = useMPCanBackspace();

    const [hasAlreadyJoined, setHasAlreadyJoined] = useState<boolean>(false);
    const [shakeRowIndex, setShakeRowIndex] = useState<number>(-1);

    const [GiveUpConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to give up.",
    );

    function onGameData(data: OnGameData) {
        multiWordle.setGameData(data);

        const serverGameState = convertGameStateStringToEnum(data.gameState);
        switch (serverGameState) {
            case GameState.GameEnd:
                lobbyModal.close();
                mpGameOverModal.open();
                break;
            default:
            case GameState.Unknown:
                break;
        }
    }

    // Handle general game
    useEffect(() => {
        function onPlayersChanged(data: {
            players: PlayerData[];
            isAdmin: boolean;
            isOwnTurn: boolean;
        }) {
            multiWordle.setPlayersData(data);
        }

        function onStart(data: OnGameData) {
            onGameData(data);
            lobbyModal.close();
        }

        function onNotValidWord(rowIndex: number) {
            setShakeRowIndex(rowIndex);
            setTimeout(() => {
                setShakeRowIndex(-1);
            }, 1000);
        }

        function onActiveWord(data: { serverActiveWord: string }) {
            let newActiveLetters = [];
            if (data.serverActiveWord) {
                newActiveLetters = data.serverActiveWord.split("");
            }
            multiWordle.setServerActiveLetters(newActiveLetters);
        }

        function onTryWord(data: OnGameData) {
            onGameData(data);
        }

        function onGameOver(data: OnGameData) {
            onGameData(data);
        }

        function onReplay(data: OnGameData) {
            multiWordle.reset();
            onGameData(data);
            mpGameOverModal.close();
        }

        socket.on("mp_game_start", onStart);
        socket.on("mp_players_changed", onPlayersChanged);
        socket.on("mp_active_word", onActiveWord);
        socket.on("mp_not_valid_word", onNotValidWord);
        socket.on("mp_try_word", onTryWord);
        socket.on("mp_game_over", onGameOver);
        socket.on("mp_replay", onReplay);

        return () => {
            socket.off("mp_game_start", onStart);
            socket.off("mp_players_changed", onPlayersChanged);
            socket.off("mp_active_word", onActiveWord);
            socket.off("mp_not_valid_word", onNotValidWord);
            socket.off("mp_try_word", onTryWord);
            socket.off("mp_game_over", onGameOver);
            socket.off("mp_replay", onReplay);
        };
    }, []);

    // Handle initial game information
    useEffect(() => {
        async function checkHasGame() {
            const response = await socket.emitWithAck("mp_has_game", {
                code: params.code,
            });
            if (!response.ok) {
                navigate("/");
                toast.error("Game not found!");
            } else {
                onGameData(response.data);
                const serverGameState = convertGameStateStringToEnum(
                    response.data.gameState,
                );
                switch (serverGameState) {
                    case GameState.WaitingToStart:
                    case GameState.GamePlaying:
                        if (!lobbyModal.isOpen) {
                            lobbyModal.open();
                        }
                        if (mpGameOverModal.isOpen) {
                            mpGameOverModal.close();
                        }
                        break;
                    case GameState.GameEnd:
                        lobbyModal.close();
                        mpGameOverModal.open();
                        break;
                    default:
                    case GameState.Unknown:
                        console.log("unknown game state!");
                }
                multiWordle.setGameData(response.data);
                setHasAlreadyJoined(response.data.hasAlreadyJoined ?? false);
            }
        }
        checkHasGame();
    }, [params]);

    // Handle server active word
    useEffect(() => {
        function onLettersChange() {
            if (multiWordle.isOwnTurn) {
                socket.emit("mp_active_word", {
                    gameId: multiWordle.gameId,
                    word: multiWordle.letters.join(""),
                });
            }
        }
        onLettersChange();
    }, [multiWordle.letters, multiWordle.isOwnTurn]);

    function onKeyboardClick(ch: string) {
        if (mpCanType) {
            multiWordle.pushLetter(ch);
        }
    }

    function onKeyboardBackspace() {
        if (mpCanBackspace) {
        }
        multiWordle.removeLetter();
    }

    function onKeyboardSubmit() {
        if (mpCanSubmit) {
            socket.emit("mp_try_word", {
                gameId: multiWordle.gameId,
                word: multiWordle.letters.join(""),
            });
        }
    }

    async function onGiveUp() {
        const ok = await confirm();
        if (ok) {
            socket.emit("mp_give_up", {
                gameId: multiWordle.gameId,
            });
        }
    }

    const LanguageIcon = getLanguageIcon(multiWordle.language);

    const letters = multiWordle.isOwnTurn
        ? multiWordle.letters
        : multiWordle.serverActiveLetters;

    return (
        <>
            <GiveUpConfirmDialog />
            <MPGameOverModal />
            <LobbyModal hasAlreadyJoined={hasAlreadyJoined} />

            <div className="container mt-4 space-y-4 sm:mt-12 sm:space-y-4">
                <Board
                    width={multiWordle.width}
                    height={multiWordle.height}
                    letters={letters}
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
                    canSubmit={mpCanSubmit}
                    onEnter={onKeyboardSubmit}
                    onBackspace={onKeyboardBackspace}
                    onClick={onKeyboardClick}
                    canType={mpCanType}
                    isOwnTurn={multiWordle.isOwnTurn}
                    canBackspace={mpCanBackspace}
                />
            </div>
        </>
    );
};
