import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArtists, type ArtistFromApi } from "@/lib/api";

export function ArtistsSection() {
  const [artists, setArtists] = useState<ArtistFromApi[]>([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    getArtists()
      .then((artistsData) => {
        if (cancelled) return;
        setArtists(artistsData);
      })
      .catch(() => {
        if (cancelled) return;
        setArtists([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Mobile carousel auto-rotation
  useEffect(() => {
    if (artists.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % artists.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [artists.length]);

  const getVisibleArtists = () => {
    const total = artists.length;
    if (total === 0) return [];
    if (total === 1) return [artists[0]];
    if (total === 2) return [artists[0], artists[0], artists[1], artists[1]];

    return [
      artists[(index - 1 + total) % total],
      artists[index % total],
      artists[(index + 1) % total],
      artists[(index + 2) % total],
    ];
  };

  if (artists.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#fcf8ea] px-6 py-20 md:px-12 lg:px-24 md:py-24 2xl:py-28">
      <div className="mx-auto max-w-[1800px]">
        {/* Desktop: 4-column grid (≥768px) */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-12">
          {artists.slice(0, 8).map((artist) => (
            <div
              key={artist.id}
              className="flex cursor-pointer flex-col items-center group"
              onClick={() => navigate(`/artists/${artist.slug}`)}
            >
              <div className="w-full max-w-[200px] aspect-square overflow-hidden rounded-full border border-[#1e1517]/10 transition-transform duration-500 group-hover:scale-105">
                <img
                  src={artist.imageUrl ?? ""}
                  alt={artist.name}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              </div>
              <p className="mt-4 font-display text-[10px] uppercase tracking-[0.22em] text-[#1e1517] text-center md:text-xs">
                {artist.name}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="flex md:hidden items-center justify-center gap-2 sm:gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {getVisibleArtists().map((artist, i) => {
              const isCenter = i === 1 || i === 2;

              return (
                <motion.div
                  key={`${artist.id}-${i}`}
                  layout
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{
                    opacity: isCenter ? 1 : 0.2,
                    x: 0,
                    scale: isCenter ? 1 : 0.7,
                  }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
                  className="flex cursor-pointer flex-col items-center"
                  onClick={() => navigate(`/artists/${artist.slug}`)}
                >
                  <div
                    className={`overflow-hidden rounded-full border border-[#1e1517]/10 transition-all duration-500 ${
                      isCenter
                        ? "aspect-square w-24 grayscale hover:scale-105 hover:grayscale-0 sm:w-36"
                        : "aspect-square w-12 grayscale sm:w-20"
                    }`}
                  >
                    <img
                      src={artist.imageUrl ?? ""}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {isCenter && (
                    <p className="mt-4 font-display text-[10px] uppercase tracking-[0.22em] text-[#1e1517] sm:mt-5">
                      {artist.name}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Mobile carousel controls */}
        {artists.length > 1 && (
          <>
            <button
              onClick={() => setIndex((prev) => (prev - 1 + artists.length) % artists.length)}
              className="absolute left-1 top-1/2 -translate-y-1/2 text-base text-[#1e1517] md:hidden"
              aria-label="Previous artists"
            >
              ←
            </button>
            <button
              onClick={() => setIndex((prev) => (prev + 1) % artists.length)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-base text-[#1e1517] md:hidden"
              aria-label="Next artists"
            >
              →
            </button>
          </>
        )}
      </div>
    </section>
  );
}
