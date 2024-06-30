import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { ThemeProvider } from "@/providers/theme-provider.tsx";
import { ModalProvider } from "./providers/modal-provider.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    richColors
                    theme="light"
                    closeButton
                    toastOptions={{
                    }}
                />
                <ModalProvider />
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
