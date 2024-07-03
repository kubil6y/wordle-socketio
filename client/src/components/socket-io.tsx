import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { useSocketStatus } from "@/hooks/use-socket-connection";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { showConnectionLostToast } from "@/lib/utils";

const socket_errors = {
    game_not_found: "game_not_found",
    not_valid_word: "not_valid_word",
};

export const SocketIO = () => {
    const location = useLocation();
    const { setIsConnected, setTransport } = useSocketStatus();
    const navigate = useNavigate();

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name || "N/A");
            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");

            const isHome = location.pathname === "/";
            showConnectionLostToast(isHome, () => {
                navigate("/");
            });
        }

        function onAlert({
            type,
            message,
            code,
        }: {
            type: string;
            message: string;
            code: string;
        }) {
            switch (type) {
                case "error":
                    toast.error(message);
                    if (code === socket_errors.game_not_found) {
                        navigate("/");
                    }
                    break;
                case "warning":
                    toast.warning(message);
                    break;
                default:
                case "info":
                    toast.info(message);
                    break;
            }
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("alert", onAlert);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("alert", onAlert);
        };
    }, []);

    return null;
};
