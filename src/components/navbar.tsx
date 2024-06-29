import { Settings } from "./settings";
import { HowToPlayButton } from "./how-to-play";
import { Link } from "react-router-dom";
import { ConnectionStatusIcon } from "./connection-status";

export const Navbar = () => {
    return (
        <nav className="standard-shadow py-1.5">
            <div className="container flex w-full items-center justify-between">
                <div className="hidden sm:block sm:w-[120px]"></div>

                <Link to="/">
                    <p className="select-none text-center text-xl font-semibold sm:text-2xl">
                        WORDLE<span className="text-red-600">PARTY</span>
                    </p>
                </Link>

                <div className="flex items-center justify-end gap-1 sm:gap-2 sm:w-[120px]">
                    <ConnectionStatusIcon />
                    <HowToPlayButton />
                    <Settings />
                </div>
            </div>
        </nav>
    );
};
