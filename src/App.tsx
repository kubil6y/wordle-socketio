import { Navbar } from "./components/navbar";
import { Wordle } from "./components/wordle";

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
