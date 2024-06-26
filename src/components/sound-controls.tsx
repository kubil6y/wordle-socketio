import { Volume1Icon, VolumeXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";

export function SoundControls() {
    const { sound, soundOn, soundOff } = useConfig();

    function toggleSound() {
        if (sound) {
            soundOff();
        } else {
            soundOn();
        }
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleSound}>
            {sound ? (
                <Volume1Icon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <VolumeXIcon className="h-[1.2rem] w-[1.2rem]" />
            )}
        </Button>
    );
}
