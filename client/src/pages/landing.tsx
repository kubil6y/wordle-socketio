import { Button } from "@/components/ui/button";
import { MyWordCloud } from "@/components/my-word-cloud";
import { useNewGameModal } from "@/hooks/use-new-game-modal";
import { NewGameModal } from "@/components/new-game-modal";
import { useJoinGameModal } from "@/hooks/use-join-game-modal";
import { JoinGameModal } from "@/components/join-game-modal";
import { useConnectedUserCount } from "@/hooks/use-connect-user-count";

export const LandingPage = () => {
    return (
        <div>
            <NewGameModal showHomeButton={false} />
            <JoinGameModal />
            <MyWordCloud />

            <div className="mt-8 space-y-2 sm:-mt-4">
                <div className="flex items-center justify-center gap-2">
                    <PlayButton />
                    <JoinButton />
                </div>
                <TotalOnlineUsers />
            </div>
        </div>
    );
};

function PlayButton() {
    const newGameModal = useNewGameModal();
    return (
        <Button
            size="lg"
            variant="outline"
            className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            onClick={newGameModal.open}
        >
            PLAY
        </Button>
    );
}

function JoinButton() {
    const joinGameModal = useJoinGameModal();
    return (
        <Button
            size="lg"
            variant="outline"
            className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            onClick={joinGameModal.open}
        >
            JOIN
        </Button>
    );
}

function TotalOnlineUsers() {
    const { count } = useConnectedUserCount();
    if (count === 0) {
        return null;
    }
    return (
        <p className="text-center text-sm text-muted-foreground">
            {count} online users
        </p>
    );
}
