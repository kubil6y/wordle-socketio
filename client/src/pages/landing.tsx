import { Button } from "@/components/ui/button";
import { MyWordCloud } from "@/components/my-word-cloud";
import { useNewGameModal } from "@/hooks/use-new-game-modal";
import { NewGameModal } from "@/components/new-game-modal";
import { useJoinGameModal } from "@/hooks/use-join-game-modal";
import { JoinGameModal } from "@/components/join-game-modal";

export const LandingPage = () => {
    return (
        <div>
            <NewGameModal showHomeButton={false} />
            <JoinGameModal />
            <MyWordCloud />

            <div className="mt-8 flex items-center justify-center gap-2 sm:-mt-4">
                <PlayButton />
                <JoinButton />
            </div>
        </div>
    );
};

function PlayButton() {
    const { open } = useNewGameModal();
    return (
        <Button
            size="lg"
            variant="outline"
            className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            onClick={open}
        >
            PLAY
        </Button>
    );
}

function JoinButton() {
    const { open } = useJoinGameModal();
    return (
        <Button
            size="lg"
            variant="outline"
            className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            onClick={open}
        >
            JOIN
        </Button>
    );
}
