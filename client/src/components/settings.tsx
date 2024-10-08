import {
    CheckIcon,
    CogIcon,
    LucideIcon,
    MoonIcon,
    SunIcon,
    Volume1Icon,
    Volume2Icon,
    VolumeXIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from "./ui/dropdown-menu";
import { Slider } from "./ui/slider";
import { useConfig } from "@/hooks/use-config";
import { useTheme } from "@/providers/theme-provider";
import useSound from "use-sound";
import { Icons } from "./icons";

export const Settings = () => {
    const { volume, setVolume } = useConfig();
    const { theme, setTheme } = useTheme();

    const [playBeep] = useSound("/sounds/beep.mp3", { volume });

    const VolIcon = resolveVolumeIcon(volume);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <CogIcon className="size-[1.2rem]" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                    <div className="flex w-full gap-2">
                        <VolIcon
                            className="size-[1.2rem] cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                setVolume(0);
                            }}
                        />
                        <Slider
                            className="flex-grow cursor-pointer"
                            defaultValue={[volume]}
                            max={1}
                            min={0}
                            step={0.1}
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            value={[volume]}
                            onValueChange={(values) => {
                                const [vol] = values;
                                setVolume(vol);
                                playBeep();
                            }}
                        />
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            {theme === "light" ? (
                                <SunIcon className="size-4 mr-2" />
                            ) : (
                                <MoonIcon className="size-4 mr-2" />
                            )}

                            <span>Theme</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setTheme("light");
                                    }}
                                >
                                    <SunIcon className="size-4 mr-2" />
                                    <span>Apollo</span>
                                    {theme === "light" && (
                                        <CheckIcon className="size-4 ml-auto" />
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setTheme("dark");
                                    }}
                                >
                                    <MoonIcon className="size-4 mr-2" />
                                    <span>Diana</span>
                                    {theme === "dark" && (
                                        <CheckIcon className="size-4 ml-auto" />
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <a
                        href="https://github.com/kubil6y/wordle-socketio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full gap-2"
                    >
                        <Icons.github className="size-4 dark:fill-foreground" />
                        <span>GitHub</span>
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

function resolveVolumeIcon(volume: number): LucideIcon {
    let volumeIcon: LucideIcon = Volume1Icon;
    if (volume === 0) {
        volumeIcon = VolumeXIcon;
    } else if (volume > 0.5) {
        volumeIcon = Volume2Icon;
    }
    return volumeIcon;
}
