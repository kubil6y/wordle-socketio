import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { socket } from "@/lib/socket";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { useHowToPlayModal } from "@/hooks/use-how-to-play-modal";
import { ModalFooter } from "./modal-footer";
import { ConnectionStatus } from "./connection-status";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { FormTitle } from "./form-title";
import { useJoinGameModal } from "@/hooks/use-join-game-modal";
import { AvatarSelection } from "./avatar-selection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLobbyModal } from "@/hooks/use-lobby-modal";

const DEFAULT_AVATAR = "avatar3";

const formSchema = z.object({
    username: z
        .string()
        .refine((value) => value.length >= 2 && value.length <= 16, {
            message: "Username must be between 2 and 16 characters long.",
        }),
    avatar: z.string(),
    code: z.string().min(1, { message: "Invitation code is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

type JoinGameModalProps = {
    isClosable?: boolean;
    showHomeButton?: boolean;
};

export const JoinGameModal = ({
    showHomeButton = true,
    isClosable = true,
}: JoinGameModalProps) => {
    const { isConnected } = useSocketStatus();
    const joinModal = useJoinGameModal();
    const lobbyModal = useLobbyModal();
    const { open: openHowToPlayModal } = useHowToPlayModal();
    const navigate = useNavigate();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            code: "",
            avatar: DEFAULT_AVATAR,
        },
    });

    async function onSubmit(values: FormSchema) {
        const { avatar, code, username } = values;
        if (!isConnected) {
            return;
        }
        const response = await socket.emitWithAck("mp_join_game", {
            code,
            avatar,
            username,
        });

        if (response.ok) {
            lobbyModal.open();
            navigate(`/lobby/${code}`);
        } else {
            if (response.error === "join_twice") {
                navigate(`/lobby/${code}`);
            }
        }
    }

    function onClose() {
        if (isClosable) {
            form.reset();
            joinModal.close();
        }
    }

    return (
        <Dialog open={joinModal.isOpen} onOpenChange={onClose}>
            <DialogContent
                className="flex h-full flex-col sm:h-auto"
                hideCloseButton={!isClosable}
            >
                <DialogHeader>
                    <div className="mb-2 flex items-center gap-4">
                        <Logo
                            onClick={() => {
                                form.reset();
                                joinModal.close();
                            }}
                        />
                        <ConnectionStatus />
                    </div>

                    <DialogTitle className="text-4xl font-semibold">
                        Join Party
                    </DialogTitle>

                    <DialogDescription className="text-start">
                        If you are unfamiliar with how to play, please click{" "}
                        <span
                            className="cursor-pointer underline"
                            onClick={(e) => {
                                e.preventDefault();
                                form.reset();
                                joinModal.close();
                                openHowToPlayModal();
                            }}
                        >
                            here
                        </span>{" "}
                        to learn more.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormTitle title="Username" />
                                    <FormControl>
                                        <Input
                                            placeholder="ex: kubilay"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mx-8">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <FormTitle title="Username" />
                                        <FormControl>
                                            <AvatarSelection
                                                selectedAvatar={field.value}
                                                onSelect={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormTitle title="Invitation Code" />
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                className="rounded-none placeholder:italic"
                                                placeholder="Enter invitation code"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                            <Button
                                                disabled={!isConnected}
                                                className="select-none rounded-none bg-red-600 font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                                                type="submit"
                                            >
                                                JOIN
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <ModalFooter />
            </DialogContent>
        </Dialog>
    );
};
