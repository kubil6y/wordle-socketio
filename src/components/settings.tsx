import {
    CheckIcon,
    CogIcon,
    LucideIcon,
    MoonIcon,
    PaletteIcon,
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
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { Slider } from "./ui/slider";
import { useConfig } from "@/hooks/use-config";
import { useRef, useState } from "react";
import { useClickAways } from "@/hooks/use-click-aways";
import { useTheme } from "@/providers/theme-provider";
import useSound from "use-sound";

export const Settings = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { volume, setVolume } = useConfig();
    const { theme, setTheme } = useTheme();

    const [playBeep] = useSound("/sounds/beep.mp3", { volume });

    const dropdownRef = useRef(null);
    useClickAways([dropdownRef], () => {
        setOpen(false);
    });

    const VolIcon = resolveVolumeIcon(volume);

    return (
        <DropdownMenu
            open={open}
            onOpenChange={() => {
                setOpen(true);
            }}
        >
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <CogIcon className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" ref={dropdownRef}>
                <DropdownMenuItem className="">
                    <div className="flex w-full gap-2">
                        <VolIcon className="h-[1.2rem] w-[1.2rem]" />
                        <Slider
                            className="flex-grow cursor-pointer"
                            defaultValue={[volume]}
                            max={1}
                            min={0}
                            step={0.1}
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
                            <PaletteIcon className="size-4 mr-2" />
                            <span>Theme</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                            <DropdownMenuSubContent
                            >
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setTheme("light")}
                                >
                                    <SunIcon className="size-4 mr-2" />
                                    <span>Apollo</span>
                                    {theme === "light" && (
                                        <CheckIcon className="size-4 ml-auto" />
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setTheme("dark")}
                                >
                                    <MoonIcon className="size-4 mr-2" />
                                    <span>Artemis</span>
                                    {theme === "dark" && (
                                        <CheckIcon className="size-4 ml-auto" />
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
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
