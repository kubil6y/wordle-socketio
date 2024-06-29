import { Wordle } from "@/components/wordle";
import { socket } from "@/lib/socket";
import { useEffect } from "react";

export const PlayPage = () => {
    useEffect(() => {
        // TODO
        socket.emit("has_game");
        return () => {
            socket.off("has_game");
        }
    }, [])
    return (
        <div>
            <Wordle />
        </div>
    )
}
