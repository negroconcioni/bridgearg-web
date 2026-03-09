import { motion } from "framer-motion";

const heroIsotypeSrc = encodeURI("/assets/logos/BRIDGEARG - Exportacion logos-11.svg");
const heroBackgroundUrl = "/assets/ui/new-hero-bg.jpg";

export interface BrandHeroProps {
  logoWidth?: string;
}

export function BrandHeroSection({ logoWidth = "700px" }: BrandHeroProps) {
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
      <div className="absolute inset-0 z-10 bg-[#1e1517]/80" />

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

        <p className="-mt-12 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
          Art travels when it finds a bridge.
        </p>
        <p className="mt-8 max-w-4xl font-display text-lg font-light tracking-normal text-white sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
          Curating contemporary Argentine art from Córdoba to the world.
        </p>

        <div className="mt-10 h-20 w-px bg-white/20 md:mt-12 md:h-32" />
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-20 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end md:bottom-10 md:left-12 md:right-12 lg:left-24 lg:right-24">
        <p className="font-display text-[10px] uppercase tracking-[0.18em] text-white/60 2xl:text-xs">
          EST. 2026 / CÓRDOBA, ARG
        </p>
        <p className="font-display text-[10px] uppercase tracking-[0.18em] text-white/60 2xl:text-xs sm:text-right">
          USA / PLANTATION, FL
        </p>
      </div>
    </section>
  );
}
