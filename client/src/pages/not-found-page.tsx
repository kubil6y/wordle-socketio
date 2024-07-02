import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        toast.error("Page not found!");
        navigate("/");
    }, [])
    return null;
}
