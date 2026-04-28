import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import AdminApp from "@/features/admin/AdminApp";
import AdminObrasPage from "@/features/admin/pages/ObrasPage";
import AdminArtistasPage from "@/features/admin/pages/ArtistasPage";
import AdminResumenPage from "@/features/admin/pages/ResumenPage";
import { CustomCursor } from "@/components/CustomCursor";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/admin" element={<AdminApp />}>
              <Route index element={<Navigate to="obras" replace />} />
              <Route path="obras" element={<AdminObrasPage />} />
              <Route path="artistas" element={<AdminArtistasPage />} />
              <Route path="lotes/:id" element={<AdminObrasPage />} />
              <Route path="resumen" element={<AdminResumenPage />} />
              <Route path="*" element={<Navigate to="obras" replace />} />
            </Route>
            <Route path="/*" element={<AnimatedRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
