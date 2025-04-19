
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";
import { createContext, useState, useContext } from "react";

// Create a context for the view mode
export type ViewMode = "creator" | "viewer";
interface ViewModeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

export const ViewModeContext = createContext<ViewModeContextType>({
  viewMode: "viewer",
  toggleViewMode: () => {},
});

export const useViewMode = () => useContext(ViewModeContext);

const queryClient = new QueryClient();

const App = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Try to get the saved view mode from localStorage
    const savedMode = localStorage.getItem("viewMode") as ViewMode;
    return savedMode === "creator" ? "creator" : "viewer";
  });

  const toggleViewMode = () => {
    const newMode = viewMode === "creator" ? "viewer" : "creator";
    setViewMode(newMode);
    localStorage.setItem("viewMode", newMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ViewModeContext.Provider value={{ viewMode, toggleViewMode }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ViewModeContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
