import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { ThemeProvider } from "@/providers/theme-provider.tsx";
import { ModalProvider } from "./providers/modal-provider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModalProvider />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
