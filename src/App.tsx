import { Navbar } from "./components/navbar";
import { Wordle } from "./components/wordle";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/landing";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="sp" element={<div>single player</div>} />
                    <Route path="mp" element={<div>multi player</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function Layout() {
    return (
        <>
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
