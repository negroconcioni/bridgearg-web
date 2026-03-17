import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { FALLBACK_ARTIST_NAME, getWorks, type WorkFromApi } from "@/lib/api";
import { WorkImage } from "@/components/WorkImage";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

const ArtworksPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    data: works = [],
    isLoading: loading,
    isError,
  } = useQuery<WorkFromApi[]>({
    queryKey: ["works"],
    queryFn: () => getWorks(),
  });

  const [artistFilter, setArtistFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "sold">("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [debouncedMin, setDebouncedMin] = useState<string>("");
  const [debouncedMax, setDebouncedMax] = useState<string>("");

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedMin(minPrice);
      setDebouncedMax(maxPrice);
    }, 400);

    return () => {
      window.clearTimeout(handle);
    };
  }, [minPrice, maxPrice]);

  const artistOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        works.map((work) => (work.artistName?.trim() || FALLBACK_ARTIST_NAME))
      )
    );
    names.sort((a, b) => a.localeCompare(b));
    return names;
  }, [works]);

  const filteredWorks = useMemo(() => {
    const min =
      debouncedMin.trim() === "" || Number.isNaN(Number(debouncedMin))
        ? null
        : Number(debouncedMin);
    const max =
      debouncedMax.trim() === "" || Number.isNaN(Number(debouncedMax))
        ? null
        : Number(debouncedMax);

    return works.filter((work) => {
      const artistName = work.artistName?.trim() || FALLBACK_ARTIST_NAME;

      const matchesArtist = !artistFilter || artistName === artistFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "available"
          ? work.available
          : !work.available;

      const matchesMin = min == null || !work.available || work.price_usd >= min;
      const matchesMax = max == null || !work.available || work.price_usd <= max;

      return matchesArtist && matchesStatus && matchesMin && matchesMax;
    });
  }, [works, artistFilter, statusFilter, debouncedMin, debouncedMax]);

  const hasActiveFilters =
    !!artistFilter ||
    statusFilter !== "all" ||
    minPrice.trim() !== "" ||
    maxPrice.trim() !== "";

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
  }, [filteredWorks]);

  useEffect(() => {
    if (isError) {
      toast({ title: "Error", description: "Could not load works.", variant: "destructive" });
    }
  }, [isError]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEO
          title="Works"
          description="Explore our collection of works by contemporary Argentine artists."
          url="/artworks"
        />
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
              <div className="mb-8 rounded-lg border border-border bg-card/40 p-4 backdrop-blur-sm md:mb-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-end md:gap-4">
                    <div className="w-full md:w-1/3">
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Artist
                      </label>
                      <select
                        value={artistFilter}
                        onChange={(e) => setArtistFilter(e.target.value)}
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">All artists</option>
                        {artistOptions.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full md:w-1/3">
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Availability
                      </label>
                      <div className="inline-flex rounded-full border border-border bg-background p-1 text-xs">
                        {(["all", "available", "sold"] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setStatusFilter(option)}
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                              statusFilter === option
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {option === "all" ? "All" : option === "available" ? "Available" : "Sold"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-full md:w-1/3">
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Price range (USD)
                      </label>
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="h-10 flex-1"
                        />
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="h-10 flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setArtistFilter("");
                        setStatusFilter("all");
                        setMinPrice("");
                        setMaxPrice("");
                        setDebouncedMin("");
                        setDebouncedMax("");
                      }}
                      className="self-start text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:underline md:self-auto"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col border border-border bg-card">
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                        <Skeleton className="h-full w-full" />
                      </div>
                      <div className="border-t border-border/80 bg-card px-6 py-5">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="mt-3 h-5 w-3/4" />
                        <Skeleton className="mt-3 h-3 w-1/2" />
                        <Skeleton className="mt-6 h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {filteredWorks.length === 0 ? (
                    <div className="py-16 text-center">
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        No works match your filters
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                      {filteredWorks.map((work, index) => {
                        const artistName = work.artistName?.trim() || FALLBACK_ARTIST_NAME;

                        return (
                          <Link
                            key={work.id}
                            to={`/artworks/${work.id}`}
                            className="group block h-full"
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
                </>
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
