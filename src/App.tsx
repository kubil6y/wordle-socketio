import { Navbar } from "./components/navbar";
import { Outlet, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landing";
import { SocketIO } from "@/components/socket-io";
import { PlayPage } from "./pages/play";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="play" element={<PlayPage />} />
                <Route path="mp" element={<div>multi player</div>} />
            </Route>
        </Routes>
    );
}

function Layout() {
    return (
        <>
            <SocketIO />
            <Navbar />
            <Outlet />
        </>
    );
}

/*
<div className="h-screen w-screen">
    <Navbar />
    <div className="mt-4 sm:mt-12">
        <Wordle />
    </div>
</div>
*/
