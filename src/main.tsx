import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { ThemeProvider } from "@/providers/theme-provider.tsx";
import { ModalProvider } from "./providers/modal-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.tsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <HelmetProvider>
                <BrowserRouter>
                    <Toaster
                        position="top-center"
                        richColors
                        theme="light"
                        closeButton
                        toastOptions={{
                            classNames: {
                                title: "text-lg"
                            }
                        }}
                    />
                    <ModalProvider />
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </ThemeProvider>
    </React.StrictMode>
);
