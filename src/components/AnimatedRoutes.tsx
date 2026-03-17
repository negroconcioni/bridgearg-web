import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "@/pages/Index";
import ArtistasPage from "@/pages/ArtistasPage";
import ArtistaDetailPage from "@/pages/ArtistaDetailPage";
import ArtworksPage from "@/pages/ObrasPage";
import ArtworkDetailPage from "@/pages/ObraDetailPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import CheckoutCancelPage from "@/pages/CheckoutCancelPage";
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
        <Route path="/works" element={<Navigate to="/artworks" replace />} />
        <Route path="/artworks" element={<ArtworksPage />} />
        <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};
