import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "@/pages/Index";
import ArtistasPage from "@/pages/ArtistasPage";
import ArtistaDetailPage from "@/pages/ArtistaDetailPage";
import ObrasPage from "@/pages/ObrasPage";
import NosotrosPage from "@/pages/NosotrosPage";
import ContactoPage from "@/pages/ContactoPage";
import NotFound from "@/pages/NotFound";

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/artistas" element={<ArtistasPage />} />
        <Route path="/artistas/:slug" element={<ArtistaDetailPage />} />
        <Route path="/obras" element={<ObrasPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};
