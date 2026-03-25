import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem("gramalert_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Theme logic is preserved via state but disabled visually to prevent UI breakage
        /*
        const root = document.documentElement;
        if (parsed.theme === "dark") {
          root.classList.add("dark");
        } else if (parsed.theme === "light") {
          root.classList.remove("dark");
        } else {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          root.classList.toggle("dark", prefersDark);
        }
        */
      } catch (e) {
        // console.error(e)
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ErrorBoundary>
  );
}