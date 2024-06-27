import { ArrowRightIcon, Clock9, HandshakeIcon, LightbulbIcon, MessageCircleMoreIcon, Share2Icon, UsersRoundIcon } from "lucide-react";
import OrbitingCircles from "./components/magicui/orbiting-circles";
import { Navbar } from "./components/navbar";
import { Wordle } from "./components/wordle";
import AnimatedShinyText from "./components/magicui/animated-shiny-text";

export function App() {
    return (
        <div className="h-screen w-screen">
            <Navbar />
           <div className="mt-4 sm:mt-12">
               <Wordle />
           </div>
        </div>
    );
}

/*
                <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                    <span className="text-foreground">WORDLE</span><span className="text-red-600">PARTY</span>
                </span>

*/

function Hello() {
    return (
        <div className="relative mx-auto flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden">
            <AnimatedShinyText className="inline-flex select-none items-center justify-center px-4 py-1 text-4xl transition ease-out">
                <span>WORDLEPARTY</span>
            </AnimatedShinyText>

            {/* Inner Circles */}
            <OrbitingCircles
                className="h-[50px] w-[50px] border-none bg-transparent"
                duration={20}
                delay={20}
                radius={80}
            >
                <LightbulbIcon />
            </OrbitingCircles>
            <OrbitingCircles
                className="h-[50px] w-[50px] border-none bg-transparent"
                duration={20}
                delay={10}
                radius={80}
            >
                <Share2Icon />
            </OrbitingCircles>

            {/* Outer Circles (reverse) */}
            <OrbitingCircles
                className="h-[50px] w-[50px] border-none bg-transparent"
                radius={190}
                duration={20}
                reverse
            >
                <UsersRoundIcon />
            </OrbitingCircles>
            <OrbitingCircles
                className="h-[50px] w-[50px] border-none bg-transparent"
                radius={190}
                duration={20}
                delay={20}
                reverse
            >
                <MessageCircleMoreIcon />
            </OrbitingCircles>
        </div>
    )
}
