import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getWorks, isSoldStatus, type WorkFromApi } from "@/lib/api";

function shuffleWorks(works: WorkFromApi[]): WorkFromApi[] {
  const shuffled = [...works];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function SelectedWorksSection() {
  const [works, setWorks] = useState<WorkFromApi[]>([]);

  useEffect(() => {
    let cancelled = false;

    getWorks()
      .then((allWorks) => {
        if (cancelled) return;
        const randomSelection = shuffleWorks(allWorks).slice(0, 4);
        setWorks(randomSelection);
      })
      .catch(() => {
        if (!cancelled) setWorks([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (works.length === 0) return null;

  return (
    <section className="border-t border-[#1e1517]/10 bg-[#fcf8ea] px-6 py-24 md:px-12 md:py-28 lg:px-24 2xl:py-32">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-14 md:mb-16">
          <p className="font-display text-[10px] font-normal uppercase tracking-[0.2em] text-[#1e1517]/68 md:text-xs 2xl:text-sm">
            Selected Works
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8 xl:grid-cols-4 2xl:gap-10">
          {works.map((work) => {
            const sold = isSoldStatus(work.status);

            return (
              <Link key={work.id} to={`/artworks/${work.id}`} className="group block">
                <article className="space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#efe6d5]">
                    <OptimizedImage
                      src={work.imagenUrl}
                      title={work.title}
                      artistName={work.artistName}
                      variant="artwork"
                      className="h-full w-full"
                      imageClassName="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                    />

                    {sold ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 p-6">
                        <p className="max-w-[22ch] text-center font-display text-[11px] italic leading-relaxed tracking-[0.02em] text-[#fcf8ea]/92 md:text-[10px] xl:text-[11px] 2xl:text-xs">
                          This piece is now part of a private collection
                        </p>
                      </div>
                    ) : null}
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
                      <p className="font-display text-xs italic text-[#1e1517]/58 2xl:text-sm">
                        This piece is now part of a private collection
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 flex justify-start">
          <Link
            to="/works"
            className="inline-flex items-center border-b border-[#1e1517]/30 pb-1 font-display text-xs uppercase tracking-[0.18em] text-[#1e1517] transition-colors hover:border-[#1e1517] hover:text-[#1e1517]/72 2xl:text-sm"
          >
            Explore the Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
