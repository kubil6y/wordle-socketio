import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type LogoProps = {
    className?: string;
    onClick?: () => void;
};

export const Logo = ({ className, onClick }: LogoProps) => {
    return (
        <Link
            to="/"
            onClick={() => {
                if (onClick) {
                    onClick();
                }
            }}
        >
            <p
                className={cn(
                    "select-none text-center text-xl font-semibold sm:text-2xl",
                    className
                )}
            >
                WORDLE<span className="text-red-600">PARTY</span>
            </p>
        </Link>
    );
};
