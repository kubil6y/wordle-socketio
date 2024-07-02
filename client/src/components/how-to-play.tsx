import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Cell } from "./board";
import { Button } from "@/components/ui/button";
import { CheckIcon, InfoIcon } from "lucide-react";
import { useHowToPlayModal } from "@/hooks/use-how-to-play-modal";
import { ModalFooter } from "./modal-footer";
import { useNewGameModal } from "@/hooks/use-new-game-modal";

export const HowToPlayModal = () => {
    const { isOpen, close } = useHowToPlayModal();
    const { open: openNewGameModal } = useNewGameModal();
    return (
        <Dialog onOpenChange={close} open={isOpen}>
            <DialogContent className="h-full sm:h-auto">
                <DialogHeader>
                    <DialogTitle className="text-start text-4xl font-semibold">
                        How to Play
                    </DialogTitle>
                    <DialogDescription className="text-start text-lg text-foreground">
                        Guess the Wordle in certain tries.
                    </DialogDescription>
                </DialogHeader>

                <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                        <CheckIcon className="size-4 mr-2 inline shrink-0 text-emerald-600" />
                        Each guess must be a valid 5-letter word.
                    </li>
                    <li className="flex items-baseline">
                        <CheckIcon className="size-4 mr-2 inline shrink-0 text-emerald-600" />
                        The color of the tiles will change to show how close
                        your guess was to the word.
                    </li>
                </ul>

                <p className="mt-2 text-start text-3xl font-semibold">
                    Examples
                </p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex gap-1.5">
                            <Cell
                                ch="W"
                                hiActive={false}
                                hiGreen={true}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="e"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="a"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="r"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="y"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                        </div>

                        <p>
                            <span className="font-semibold">W</span> is in the
                            word and in the correct spot.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-1.5">
                            <Cell
                                ch="p"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="i"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={true}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="l"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="l"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="s"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                        </div>

                        <p>
                            <span className="font-semibold">I</span> is in the
                            word but in the wrong spot.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-1">
                            <Cell
                                ch="v"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="a"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="g"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                            <Cell
                                ch="u"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={true}
                                animate={false}
                            />
                            <Cell
                                ch="e"
                                hiActive={false}
                                hiGreen={false}
                                hiYellow={false}
                                hiNotFound={false}
                                animate={false}
                            />
                        </div>

                        <p>
                            <span className="font-semibold">U</span> is not in
                            the word in any spot.{" "}
                        </p>
                    </div>

                    <Button
                        size="lg"
                        variant="outline"
                        className="mt-4 w-full select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                        onClick={() => {
                            close();
                            openNewGameModal();
                        }}
                    >
                        Play
                    </Button>
                </div>

                <ModalFooter />
            </DialogContent>
        </Dialog>
    );
};

export const HowToPlayButton = () => {
    const { open } = useHowToPlayModal();
    return (
        <Button variant="outline" size="icon" onClick={open}>
            <InfoIcon className="size-[1.2rem]" />
        </Button>
    );
};