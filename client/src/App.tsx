import { Navbar } from "./components/navbar";
import { Outlet, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landing";
import { SocketIO } from "@/components/socket-io";
import { PlayPage } from "./pages/play";
import { HtmlLanguageMatcher } from "./components/html-language-matcher";
import { Lobby } from "./pages/lobby";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="play" element={<PlayPage />} />
                <Route path="lobby" element={<Lobby />} />
            </Route>
        </Routes>
    );
}

function Layout() {
    return (
        <>
            <SocketIO />
            <Navbar />
            <HtmlLanguageMatcher />
            <Outlet />
        </>
    );
}
