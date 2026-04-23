import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAvailableCount } from "@/lib/api";

const heroImages = [
  "/assets/ui/fondo_jose.jpg",
  "/assets/ui/fondo_mariano_2.jpg",
  "/assets/ui/fondo_tulio.jpg",
  "/assets/ui/fondo_ale_2.jpg",
  "/assets/ui/fondo_caro_2.jpg",
  "/assets/ui/fondo_boyo_3.jpg",
  "/assets/ui/fondo_fabio_2.jpg",
  "/assets/ui/fondo_roger_2.jpeg",
];
const heroArtists = [
  "Jose Benito",
  "Mariano Castañeda",
  "Tulio Romano",
  "Alejandra Espinosa",
  "Carolina Caeiro",
  "Boyo Quintana",
  "Fabio Egea",
  "Roger Mantegani",
];
const SLIDE_DURATION = 9000; // milisegundos

export interface BrandHeroProps {
  logoWidth?: string;
}

export function BrandHeroSection({ logoWidth = "420px" }: BrandHeroProps) {
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressRunId, setProgressRunId] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const firstTickTimeoutRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const slideStartedAtRef = useRef<number>(Date.now());
  const elapsedOnCurrentSlideRef = useRef<number>(0);

  useEffect(() => {
    getAvailableCount()
      .then(setAvailableCount)
      .catch(() => {});
  }, []);

  const clearSlideInterval = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const clearFirstTickTimeout = () => {
    if (firstTickTimeoutRef.current !== null) {
      window.clearTimeout(firstTickTimeoutRef.current);
      firstTickTimeoutRef.current = null;
    }
  };

  const clearSlideTimers = () => {
    clearSlideInterval();
    clearFirstTickTimeout();
  };

  const startSlideInterval = (startWithRemaining = false) => {
    clearSlideTimers();
    clearSlideInterval();
    if (!isPlaying) return;
    const startRegularInterval = () => {
      slideStartedAtRef.current = Date.now();
      elapsedOnCurrentSlideRef.current = 0;
      intervalRef.current = window.setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
        setProgressRunId((prev) => prev + 1);
        slideStartedAtRef.current = Date.now();
        elapsedOnCurrentSlideRef.current = 0;
      }, SLIDE_DURATION);
    };

    if (startWithRemaining) {
      const remaining = Math.max(
        0,
        Math.min(SLIDE_DURATION, SLIDE_DURATION - elapsedOnCurrentSlideRef.current),
      );
      slideStartedAtRef.current = Date.now() - elapsedOnCurrentSlideRef.current;
      firstTickTimeoutRef.current = window.setTimeout(() => {
        setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
        setProgressRunId((prev) => prev + 1);
        startRegularInterval();
      }, remaining);
      return;
    }

    startRegularInterval();
  };

  useEffect(() => {
    if (isPlaying) {
      startSlideInterval(true);
    } else {
      if (slideStartedAtRef.current > 0) {
        elapsedOnCurrentSlideRef.current = Math.min(
          SLIDE_DURATION,
          Date.now() - slideStartedAtRef.current,
        );
      }
      clearSlideTimers();
    }
    return () => clearSlideTimers();
  }, [isPlaying]);

  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const resetProgressAnimationFromZero = () => {
    requestAnimationFrame(() => {
      const el = progressBarRef.current;
      if (!el) return;
      el.style.animation = "none";
      void el.offsetWidth;
      requestAnimationFrame(() => {
        const current = progressBarRef.current;
        if (!current) return;
        current.style.animation = `hero-progress-fill ${SLIDE_DURATION}ms linear forwards`;
        current.style.animationPlayState = isPlaying ? "running" : "paused";
      });
    });
  };

  const resetSlideClock = () => {
    slideStartedAtRef.current = Date.now();
    elapsedOnCurrentSlideRef.current = 0;
  };

  const goToIndex = (index: number) => {
    setActiveImageIndex(index);
    setProgressRunId((prev) => prev + 1);
    resetSlideClock();
    startSlideInterval(false);
    resetProgressAnimationFromZero();
  };

  const goToPrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setProgressRunId((prev) => prev + 1);
    resetSlideClock();
    startSlideInterval(false);
    resetProgressAnimationFromZero();
  };

  const goToNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
    setProgressRunId((prev) => prev + 1);
    resetSlideClock();
    startSlideInterval(false);
    resetProgressAnimationFromZero();
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  void logoWidth;

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${src}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: activeImageIndex === index ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#1e1517]/20 via-[#1e1517]/65 to-[#1e1517]/85" />
      <div className="absolute z-20" style={{ top: "0px", left: "50%", transform: "translateX(-50%)", width: "600px" }}>
        <img
          src="/assets/logos/BRIDGEARG - Exportacion logos-02.svg"
          alt="BridgeArg"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* availableCount !== null && (
          <div className="absolute right-6 top-24 z-20 text-right md:right-12 md:top-28 lg:right-24">
          <p className="font-display text-base font-semibold uppercase tracking-[0.18em] text-white/80">
            Available works
          </p>
          <p className="font-display text-6xl font-bold text-white">
            {availableCount}
          </p>
        </div>
      ) */}


      <motion.div
        className="relative z-20 w-full px-6 pt-6 md:px-12 md:pt-8 lg:px-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
      >
        <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "40px" }}>
          <div className="max-w-2xl" style={{ maxWidth: "700px", flex: "1", marginTop: "120px" }}>
            <span style={{
              fontFamily: '"Onest", sans-serif',
              fontSize: "clamp(14px, 1.5vw, 20px)",
              color: "#7FB2D1",
                display: "block",
                marginBottom: "16px",
                fontWeight: 300,
                letterSpacing: "0.2em",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              Ambassadors of Argentine Art
            </span>
            <h1 style={{ lineHeight: 1.05, marginBottom: "0" }}>
              <span
                style={{
                  fontFamily: '"Onest", sans-serif',
                  fontWeight: 900,
                  fontSize: "clamp(40px, 6vw, 80px)",
                  color: "#ffffff",
                  display: "block",
                  letterSpacing: "-0.03em",
                }}
              >
                Curating the art
              </span>
              <span
                style={{
                  fontFamily: '"BestDB", "Caveat", cursive',
                  fontWeight: 400,
                  fontSize: "clamp(40px, 6vw, 70px)",
                  color: "#7FB2D1",
                  display: "block",
                  letterSpacing: "-0.01em",
                  transform: "rotate(-7deg)",
                  transformOrigin: "left center",
                  marginTop: "25px",
                  whiteSpace: "nowrap",
                }}
              >
                from the End of the World.
              </span>
            </h1>
            <p className="font-display text-2xl font-light text-white/90 leading-relaxed mt-7" style={{ maxWidth: "660px", fontSize: "clamp(16px, 1.8vw, 26px)" }}>
              Connecting extraordinary Argentine contemporary art with global collectors — professionally, legally,
              and sustainably.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
                flexShrink: 0,
                marginTop: "80px",
              }}
            >
              <Link
                to="/artworks"
                style={{
                  fontFamily: '"Onest", sans-serif',
                  fontSize: "15px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  padding: "8px 0",
                  display: "inline-block",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s ease, borderColor 0.3s ease, letterSpacing 0.3s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.color = "#7FB2D1";
                  el.style.borderBottomColor = "#7FB2D1";
                  el.style.letterSpacing = "0.35em";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.color = "#ffffff";
                  el.style.borderBottomColor = "rgba(255,255,255,0.4)";
                  el.style.letterSpacing = "0.25em";
                }}
              >
                View the Collection
              </Link>
              <Link
                to="/artists"
                style={{
                  fontFamily: '"Onest", sans-serif',
                  fontSize: "15px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  padding: "8px 0",
                  display: "inline-block",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s ease, borderColor 0.3s ease, letterSpacing 0.3s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.color = "#7FB2D1";
                  el.style.borderBottomColor = "#7FB2D1";
                  el.style.letterSpacing = "0.35em";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.color = "#ffffff";
                  el.style.borderBottomColor = "rgba(255,255,255,0.4)";
                  el.style.letterSpacing = "0.25em";
                }}
              >
                Meet the Artists
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-16 z-20 w-full px-6 md:bottom-20 md:px-12 lg:px-24">
        <div className="flex justify-end">
          <motion.span
            key={activeImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              color: "#fcf8ea",
              fontFamily: '"Onest", sans-serif',
              fontSize: "1.3rem",
              lineHeight: 1,
            }}
          >
            {heroArtists[activeImageIndex]}
          </motion.span>
        </div>
      </div>

      <div className="absolute bottom-6 z-20 w-full px-6 md:bottom-8 md:px-12 lg:px-24">
        <div className="flex items-center gap-5">
          <button
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            className="flex h-8 w-8 items-center justify-center"
            style={{ color: "#fcf8ea" }}
          >
            {isPlaying ? (
              <span className="flex items-center gap-[5px]">
                <span className="h-4 w-[2px] bg-[#fcf8ea]" />
                <span className="h-4 w-[2px] bg-[#fcf8ea]" />
              </span>
            ) : (
              <span
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "12px solid #fcf8ea",
                  marginLeft: "2px",
                }}
              />
            )}
          </button>

          <div className="flex flex-1 items-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="relative h-[3px] flex-1 overflow-hidden"
                style={{ backgroundColor: "rgba(252,248,234,0.25)" }}
              >
                {index < activeImageIndex && (
                  <span
                    className="absolute inset-y-0 left-0"
                    style={{ width: "100%", backgroundColor: "#fcf8ea" }}
                  />
                )}
                {index === activeImageIndex && (
                  <span
                    key={`${activeImageIndex}-${progressRunId}`}
                    ref={progressBarRef}
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: "0%",
                      backgroundColor: "#fcf8ea",
                      animation: `hero-progress-fill ${SLIDE_DURATION}ms linear forwards`,
                      animationPlayState: isPlaying ? "running" : "paused",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="ml-3 flex items-center gap-4">
            <span
              className="font-display text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "rgba(252,248,234,0.6)" }}
            >
              {activeImageIndex + 1} / {heroImages.length}
            </span>
            <div className="flex items-center gap-2 text-[#fcf8ea]">
              <button onClick={goToPrev} aria-label="Previous slide" className="text-lg leading-none">
                ←
              </button>
              <button onClick={goToNext} aria-label="Next slide" className="text-lg leading-none">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
