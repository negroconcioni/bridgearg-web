import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAvailableCount } from "@/lib/api";

const heroIsotypeSrc = encodeURI("/assets/logos/BRIDGEARG - Exportacion logos-08.svg");
const heroBackgroundUrl = "/assets/ui/fondo_fabio.jpg";

export interface BrandHeroProps {
  logoWidth?: string;
}

export function BrandHeroSection({ logoWidth = "420px" }: BrandHeroProps) {
  const [availableCount, setAvailableCount] = useState<number | null>(null);

  useEffect(() => {
    getAvailableCount()
      .then(setAvailableCount)
      .catch(() => {});
  }, []);

  return (
    <section
      className="relative overflow-visible px-6 pb-0 pt-12 md:px-12 md:pt-16 lg:px-24"
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("${heroBackgroundUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-10 bg-[#1e1517]/30" />

      {availableCount !== null && (
        <div className="absolute right-6 top-6 z-20 text-right md:right-12 md:top-8 lg:right-24">
          <p className="font-display text-[15px] font-semibold uppercase tracking-[0.18em] text-white/80">
            Available works
          </p>
          <p className="font-display text-2xl font-bold text-white md:text-3xl">
            {availableCount}
          </p>
        </div>
      )}

      <motion.div
        className="relative z-20 mx-auto flex min-h-[calc(100vh-160px)] max-w-[1800px] flex-col items-center justify-start pt-16 text-center md:pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <img
          src={heroIsotypeSrc}
          alt="BridgeArg isotype"
          className="h-auto max-w-full"
          style={{
            /* ACA SE AJUSTA EL TAMAÑO */
            width: `min(${logoWidth}, 72vw)`,
          }}
        />

        <p className="mt-6 max-w-2xl font-display text-base font-light tracking-normal text-white sm:text-lg md:text-xl lg:text-2xl">
          Curating contemporary Argentine art to the world.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to="/artworks"
            className="font-display text-xs font-medium uppercase tracking-[0.18em] text-white border border-white/40 px-8 py-3 hover:bg-white/10 transition-colors"
          >
            View the Collection
          </Link>
          <Link
            to="/artists"
            className="font-display text-xs font-medium uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
          >
            Meet the Artists →
          </Link>
        </div>

        <div className="mt-10 h-20 w-px bg-white/20 md:mt-12 md:h-32" />
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end md:bottom-10 md:left-12 md:right-12 lg:left-24 lg:right-24">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 2xl:text-xs">
          ARGENTINA
        </p>
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 2xl:text-xs sm:text-right">
          UNITED STATES
        </p>
      </div>
    </section>
  );
}
