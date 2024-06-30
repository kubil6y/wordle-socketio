import { Logo } from "./logo";
import { Settings } from "./settings";
import { HowToPlayButton } from "./how-to-play";
import { ConnectionStatusIcon } from "./connection-status";
import { useWordle } from "@/hooks/use-wordle";

export const Navbar = () => {
    // TODO remove this later
    const {secretWord} = useWordle();
    return (
        <nav className="standard-shadow py-1.5">
            <div className="container flex w-full items-center justify-between">
                <div className="hidden sm:block sm:w-[120px]">{secretWord}</div>

                <Logo />

                <div className="flex items-center justify-end gap-1 sm:gap-2 sm:w-[120px]">
                    <ConnectionStatusIcon />
                    <HowToPlayButton />
                    <Settings />
                </div>
            </div>
        </nav>
    );
};
