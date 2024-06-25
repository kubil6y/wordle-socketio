import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";

export const Deneme = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [transport, setTransport] = useState<string>("N/A");
    const [msg, setMsg] = useState<string>("");

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
        }

        function onFoo(msg: string) {
            setMsg(msg);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("foo", onFoo);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("foo", onFoo);
        };
    }, []);

    return (
        <div>
            <p>{msg}</p>
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
        </div>
    );
}
