import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import AdminApp from "@/features/admin/AdminApp";
import AdminObrasPage from "@/features/admin/pages/ObrasPage";
import AdminArtistasPage from "@/features/admin/pages/ArtistasPage";
import AdminResumenPage from "@/features/admin/pages/ResumenPage";
import { CustomCursor } from "@/components/CustomCursor";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
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
