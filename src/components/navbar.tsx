import { Settings } from "./settings";
import { HowToPlay } from "./how-to-play";

export const Navbar = () => {
    return (
        <nav className="standard-shadow flex items-center justify-between px-8 py-1.5 ">
            <div className="hidden sm:block sm:w-[120px]"></div>

            <p className="select-none text-center text-xl font-semibold sm:text-2xl">
                WORDLE<span className="text-red-600">PARTY</span>
            </p>

            <div className="flex items-center justify-end gap-2 sm:w-[120px]">
                <HowToPlay />
                <Settings />
            </div>
        </nav>
    );
};
