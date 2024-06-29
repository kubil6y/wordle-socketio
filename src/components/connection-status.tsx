import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { Badge } from "@/components/ui/badge";
import {
    CircleIcon,
    FlameIcon,
    MonitorCheckIcon,
    MonitorOffIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export const ConnectionStatus = () => {
    const { isConnected } = useSocketStatus();
    return isConnected ? (
        <Badge className="bg-emerald-600 hover:bg-emerald-600 select-none dark:text-white">
            <MonitorCheckIcon className="text-white size-4 mr-2" />
            Online
        </Badge>
    ) : (
        <Badge className="bg-red-600 hover:bg-red-600 select-none dark:text-white">
            <MonitorOffIcon className="text-white size-4 mr-2" />
            Offline
        </Badge>
    );
};

export const ConnectionStatusIcon = () => {
    const { isConnected } = useSocketStatus();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                        <CircleIcon
                            className={cn(
                                "size-[1.2rem] text-transparent",
                                isConnected
                                    ? "fill-emerald-500"
                                    : "fill-red-600"
                            )}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    {isConnected
                        ? "Live updates on!"
                        : "Disconnected! Reconnecting..."}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
