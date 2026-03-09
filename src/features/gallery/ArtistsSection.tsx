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

  return (
    <section className="relative w-full overflow-hidden bg-[#fcf8ea] px-6 py-20 md:px-12 lg:px-24 md:py-24 2xl:py-28">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex items-center justify-center gap-5 sm:gap-8 md:gap-14 xl:gap-20 2xl:gap-28">
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
                onClick={() => navigate(`/artistas/${artist.slug}`)}
              >
                <div
                  className={`overflow-hidden rounded-full border border-[#1e1517]/10 transition-all duration-500 ${
                    isCenter
                      ? "aspect-square w-32 grayscale hover:scale-105 hover:grayscale-0 sm:w-40 md:w-52 lg:w-60 xl:w-64 2xl:w-72"
                      : "aspect-square w-20 grayscale sm:w-24 md:w-32 lg:w-36 xl:w-40 2xl:w-44"
                  }`}
                >
                  <img
                    src={artist.imageUrl ?? ""}
                    alt={artist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {isCenter && (
                  <p className="mt-4 font-display text-[10px] uppercase tracking-[0.22em] text-[#1e1517] sm:mt-5 md:mt-6 md:text-xs 2xl:text-sm">
                    {artist.name}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {artists.length > 1 && (
        <>
          <button
            onClick={() => setIndex((prev) => (prev - 1 + artists.length) % artists.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#1e1517] md:left-6 md:text-2xl lg:left-10"
            aria-label="Previous artists"
          >
            ←
          </button>
          <button
            onClick={() => setIndex((prev) => (prev + 1) % artists.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#1e1517] md:right-6 md:text-2xl lg:right-10"
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
