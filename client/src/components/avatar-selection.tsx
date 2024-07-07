import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const avatars = [
    "avatar1",
    "avatar2",
    "avatar3",
    "avatar4",
    "avatar5",
    "avatar6",
    "avatar7",
    "avatar8",
    "avatar9",
    "avatar10",
    "avatar11",
    "avatar12",
    "avatar13",
    "avatar14",
    "avatar15",
    "avatar16",
    "avatar17",
    "avatar18",
    "avatar19",
];

type AvatarSelectionProps = {
    selectedAvatar: string;
    className?: string;
    onSelect: (avatarName: string) => void;
};

export const AvatarSelection = ({
    selectedAvatar,
    className,
    onSelect,
}: AvatarSelectionProps) => {
    return (
        <Carousel className={cn("", className)}>
            <CarouselContent>
                {avatars.map((avatar, index) => {
                    const avatarPath = `/avatars/${avatar}.png`;
                    const isSelected = selectedAvatar === avatar;
                    return (
                        <CarouselItem
                            key={index}
                            className="basis-1/4 sm:basis-1/5 sm:pl-4"
                        >
                            <div
                                className={cn(
                                    "size-[64px] flex cursor-pointer select-none items-center justify-center overflow-hidden border p-1",
                                    isSelected && "border-[3px] border-red-600",
                                    !isSelected && "grayscale"
                                )}
                                onClick={() => {
                                    onSelect(avatar);
                                }}
                            >
                                <img
                                    className={cn(!isSelected && "transition hover:scale-90")}
                                    src={avatarPath}
                                    alt={avatar}
                                />
                            </div>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};
