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
                            //className="pl-1 md:basis-1/2 lg:basis-1/3"
                            //className="pl-4 md:basis-1/5" // current
                            className="sm:pl-4 basis-1/4 sm:basis-1/5"
                        >
                            <div
                                className={cn(
                                    "size-[64px] flex cursor-pointer select-none items-center justify-center border p-1",
                                    //isSelected && "border-2 border-black"
                                    isSelected && "border-4 border-red-600"
                                )}
                                onClick={() => {
                                    onSelect(avatar);
                                }}
                            >
                                <img
                                    className=""
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
