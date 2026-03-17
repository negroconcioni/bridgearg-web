import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getWorks, isSoldStatus, type WorkFromApi } from "@/lib/api";

function shuffleArray(arr: WorkFromApi[]): WorkFromApi[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ROTATION_INTERVAL = 15000;
const CARD_DELAYS = [0, 6000, 3000, 9000];

export function SelectedWorksSection() {
  const [allWorks, setAllWorks] = useState<WorkFromApi[]>([]);
  const [cards, setCards] = useState<WorkFromApi[]>([]);
  const [fading, setFading] = useState<boolean[]>([false, false, false, false]);
  const allWorksRef = useRef<WorkFromApi[]>([]);
  const cardsRef = useRef<WorkFromApi[]>([]);

  useEffect(() => {
    let cancelled = false;
    getWorks()
      .then((works) => {
        if (cancelled || works.length === 0) return;
        allWorksRef.current = works;
        setAllWorks(works);
        // Pick 4 unique works for initial load
        const shuffled = shuffleArray(works);
        const initial: WorkFromApi[] = [];
        const usedIds = new Set<number>();
        for (const work of shuffled) {
          if (!usedIds.has(work.id)) {
            usedIds.add(work.id);
            initial.push(work);
          }
          if (initial.length === 4) break;
        }
        cardsRef.current = initial;
        setCards(initial);
      })
      .catch(() => { });
    return () => { cancelled = true; };
  }, []);

  const rotateCard = useCallback((cardIndex: number) => {
    setFading((prev) => {
      const next = [...prev];
      next[cardIndex] = true;
      return next;
    });

    setTimeout(() => {
      // Use cardsRef to get the latest state and avoid duplicates
      const currentCards = cardsRef.current;
      const currentIds = new Set(currentCards.map((w) => w.id));
      // Remove the card being replaced from forbidden set
      if (currentCards[cardIndex]) {
        currentIds.delete(currentCards[cardIndex].id);
      }
      const pool = allWorksRef.current.filter((w) => !currentIds.has(w.id));
      const safePool = pool.length > 0 ? pool : allWorksRef.current;
      const nextWork = safePool[Math.floor(Math.random() * safePool.length)];

      const updatedCards = [...currentCards];
      updatedCards[cardIndex] = nextWork;
      cardsRef.current = updatedCards;
      setCards(updatedCards);

      setFading((prev) => {
        const next = [...prev];
        next[cardIndex] = false;
        return next;
      });
    }, 400);
  }, []);

  useEffect(() => {
    if (cards.length < 4 || allWorks.length === 0) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    CARD_DELAYS.forEach((delay, cardIndex) => {
      const scheduleNext = () => {
        const timer = setTimeout(() => {
          rotateCard(cardIndex);
          scheduleNext();
        }, ROTATION_INTERVAL);
        timers.push(timer);
      };

      const initialDelay = setTimeout(() => {
        scheduleNext();
      }, delay);
      timers.push(initialDelay);
    });

    return () => timers.forEach(clearTimeout);
  }, [cards.length, allWorks.length, rotateCard]);

  if (cards.length === 0) return null;

  return (
    <section className="border-t border-[#1e1517]/10 bg-[#fcf8ea] px-6 py-24 md:px-12 md:py-28 lg:px-24 2xl:py-32">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-14 md:mb-16">
          <p className="font-display text-[10px] font-normal uppercase tracking-[0.2em] text-[#1e1517]/68 md:text-xs 2xl:text-sm">
            Selected Works
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 xl:gap-8">
          {cards.map((work, index) => {
            const sold = isSoldStatus(work.status);
            return (
              <Link
                key={`${work.id}-${index}`}
                to={`/artworks/${work.id}`}
                className="group block"
              >
                <article
                  className="space-y-4"
                  style={{
                    opacity: fading[index] ? 0 : 1,
                    transition: "opacity 0.4s ease-in-out",
                  }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#efe6d5]">
                    <OptimizedImage
                      src={work.imagenUrl}
                      title={work.title}
                      artistName={work.artistName}
                      variant="artwork"
                      className="h-full w-full"
                      imageClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                        sold ? "bg-black/35" : "bg-black/0 group-hover:bg-black/55"
                      }`}
                    >
                      {sold ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1517]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#1e1517]/60">
                          ● Private Collection
                        </span>
                      ) : (
                        <p className="font-display text-sm font-medium uppercase tracking-[0.3em] text-white opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                          View
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xs font-medium uppercase tracking-[0.08em] text-[#1e1517] md:text-sm 2xl:text-base">
                      {work.title}
                    </h3>
                    <p className="font-display text-xs uppercase tracking-[0.12em] text-[#1e1517]/68 2xl:text-sm">
                      {work.artistName}
                    </p>
                    {!sold ? (
                      <p className="font-display text-xs uppercase tracking-[0.08em] text-[#1e1517]/78 2xl:text-sm">
                        {work.priceDisplay}
                      </p>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1517]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#1e1517]/60">
                        ● Private Collection
                      </span>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        <div className="mt-14 flex justify-start">
          <Link
            to="/artworks"
            className="inline-flex items-center border-b border-[#1e1517]/30 pb-1 font-display text-xs uppercase tracking-[0.18em] text-[#1e1517] transition-colors hover:border-[#1e1517] hover:text-[#1e1517]/72 2xl:text-sm"
          >
            Explore the Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
