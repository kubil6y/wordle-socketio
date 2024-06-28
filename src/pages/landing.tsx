import { Button } from "@/components/ui/button";
import { MyWordCloud } from "@/components/my-word-cloud";

export const LandingPage = () => {
    return (
        <div>
            <MyWordCloud />

            <div className="mt-8 sm:-mt-4 flex items-center justify-center">
                <Button
                    size="lg"
                    variant="outline"
                    className="select-none rounded-none bg-red-600 text-2xl font-semibold uppercase text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    onClick={() => console.log("hello")}
                >
                    Play
                </Button>
            </div>
        </div>
    );
};
