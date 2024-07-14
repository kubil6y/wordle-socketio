import { Outlet, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landing";
import { PlayPage } from "./pages/play";
import { Lobby } from "./pages/lobby";
import { Navbar } from "./components/navbar";
import { SocketIO } from "@/components/socket-io";
import { HtmlLanguageMatcher } from "./components/html-language-matcher";
import { TestPage } from "./pages/test-page";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="play" element={<PlayPage />} />
                <Route path="lobby/:code" element={<Lobby />} />
                <Route path="test" element={<TestPage />} />
                {/*
                 * TODO remove this
                 *<Route path="*" element={<NotFoundPage />} />
                 */}
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
