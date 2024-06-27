import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    LucideIcon,
    Volume1Icon,
    Volume2Icon,
    VolumeXIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";
import { Slider } from "./ui/slider";
import useSound from "use-sound";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

export function SoundControls() {
    const [open, setOpen] = useState<boolean>(false);
    const { volume, setVolume } = useConfig();
    const [playBeep] = useSound("/sounds/beep.mp3", { volume });

    const ref = useRef(null);
    useClickAway(ref, () => {
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
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <VolIcon className="size-[1.2rem]" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent ref={ref} className="py-2">
                <DropdownMenuLabel>Volume</DropdownMenuLabel>

                <DropdownMenuItem className="w-[200px] hover:bg-none">
                    <Slider
                        className="cursor-pointer"
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
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function resolveVolumeIcon(volume: number): LucideIcon {
    let volumeIcon: LucideIcon = Volume1Icon;
    if (volume === 0) {
        volumeIcon = VolumeXIcon;
    } else if (volume > 0.5) {
        volumeIcon = Volume2Icon;
    }
    return volumeIcon;
}
