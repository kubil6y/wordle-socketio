import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { DialogFooter } from "./ui/dialog";

export const ModalFooter = ({ className }: { className?: string }) => {
    return (
        <DialogFooter
            className={cn(
                "mr-auto mt-auto flex items-center justify-center text-sm text-muted-foreground sm:mt-4",
                className
            )}
        >
            <p>
                This project is open source! You can check it out on
                <a
                    href="https://github.com/kubil6y/wordle-socketio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-inline ml-1 items-center gap-1 hover:underline"
                >
                    <span>GitHub</span>
                    <Icons.github className="size-4 sm:size-5 ml-1.5 inline animate-bounce fill-muted-foreground duration-500" />
                </a>
            </p>
        </DialogFooter>
    );
};
