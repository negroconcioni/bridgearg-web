import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Loader2 } from "lucide-react";
import { FALLBACK_ARTIST_NAME, getWorks, type WorkFromApi } from "@/lib/api";
import { WorkImage } from "@/components/WorkImage";
import { toast } from "@/hooks/use-toast";

const ArtworksPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [works, setWorks] = useState<WorkFromApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".scroll-reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [works]);

  useEffect(() => {
    let cancelled = false;
    getWorks()
      .then((data) => {
        if (!cancelled) setWorks(data);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Error", description: "Could not load works.", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label block mb-4">Curated Collection</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Works
              </h1>
              <p className="text-muted-foreground text-lg mt-6 max-w-xl">
                Explore our collection of works by contemporary Argentine artists.
                Each piece has been selected for its artistic quality and cultural relevance.
              </p>
            </div>
          </section>

          <section ref={sectionRef} className="section-padded relative">
            <div className="container mx-auto lg:pl-16">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {works.map((work, index) => {
                    const artistName = work.artistName?.trim() || FALLBACK_ARTIST_NAME;

                    return (
                      <Link
                        key={work.id}
                        to={`/artworks/${work.id}`}
                        className="scroll-reveal group block h-full"
                      >
                        <div className="flex h-full flex-col border border-border bg-card transition-shadow hover:shadow-md">
                          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                            <WorkImage
                              imagenUrl={work.imagenUrl}
                              title={work.title}
                              artistName={artistName}
                              className="h-full w-full"
                            />
                            {!work.available && (
                              <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                                <p className="px-4 py-2 text-center text-background/95 text-sm font-light italic max-w-[80%]">
                                  This piece is now part of a private collection
                                </p>
                              </div>
                            )}
                            <div className="absolute left-4 top-4">
                              <span className="bg-background/90 px-2 py-1 text-label">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-1 flex-col justify-between border-t border-border/80 bg-card px-6 py-5">
                            <div>
                              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {artistName}
                              </p>
                              <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                                {work.title}
                              </h3>
                              <div className="space-y-1 text-xs text-muted-foreground">
                                {work.year && <p>{work.year}</p>}
                                {work.medium && <p>{work.medium}</p>}
                              </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                              {!work.available ? (
                                <p className="text-muted-foreground text-sm font-light italic">
                                  This piece is now part of a private collection
                                </p>
                              ) : (
                                <span className="font-display text-base font-semibold text-foreground">
                                  {work.priceDisplay}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ArtworksPage;
