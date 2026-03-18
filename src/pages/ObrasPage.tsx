import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { FALLBACK_ARTIST_NAME, getWorks, type WorkFromApi } from "@/lib/api";
import { WorkImage } from "@/components/WorkImage";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * TODO - Base de datos:
 * Las obras actuales tienen títulos duplicados (datos demo).
 * Antes del lanzamiento, cargar obras reales con:
 * - Títulos únicos y descriptivos
 * - Campo 'medium' completado (para el filtro de Medium)
 * - Campo 'year' completado (para el filtro de Newest/Oldest)
 * - Campo 'dimensions' completado o precio (para Details en ObraDetailPage)
 * - Imágenes reales (no las mismas fotos repetidas)
 */

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
  const [mediumFilter, setMediumFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "sold">("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "newest" | "oldest"
  >("default");

  const priceBounds = useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    works.forEach((work) => {
      if (!work.available) return;
      const p = work.price_usd;
      if (typeof p === "number" && !Number.isNaN(p)) {
        if (p < min) min = p;
        if (p > max) max = p;
      }
    });
    if (!Number.isFinite(min)) {
      min = 0;
    }
    if (max < min) {
      max = min;
    }
    // Clamp to sensible gallery defaults
    const clampedMin = 0;
    const clampedMax = Math.max(max, 8000);
    return { min: clampedMin, max: clampedMax };
  }, [works]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 8000]);

  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max]);
  }, [priceBounds.min, priceBounds.max]);

  const artistOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        works.map((work) => (work.artistName?.trim() || FALLBACK_ARTIST_NAME))
      )
    );
    names.sort((a, b) => a.localeCompare(b));
    return names;
  }, [works]);

  const mediumOptions = useMemo(() => {
    const mediums = Array.from(
      new Set(
        works
          .map((work) => work.medium?.trim())
          .filter((m): m is string => !!m && m.length > 0)
      )
    );
    mediums.sort((a, b) => a.localeCompare(b));
    return mediums;
  }, [works]);

  const filteredWorks = useMemo(() => {
    const [rangeMin, rangeMax] = priceRange;

    return works.filter((work) => {
      const artistName = work.artistName?.trim() || FALLBACK_ARTIST_NAME;
      const medium = work.medium?.trim() || "";

      const matchesArtist = !artistFilter || artistName === artistFilter;
      const matchesMedium = !mediumFilter || medium === mediumFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "available"
          ? work.available
          : !work.available;

      const price = work.price_usd;
      const matchesPrice =
        !work.available ||
        typeof price !== "number" ||
        Number.isNaN(price) ||
        (price >= rangeMin && price <= rangeMax);

      return matchesArtist && matchesMedium && matchesStatus && matchesPrice;
    });
  }, [works, artistFilter, mediumFilter, statusFilter, priceRange]);

  const sortedWorks = useMemo(() => {
    const list = [...filteredWorks];

    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => {
          // Private collection works always go to the end
          if (!a.available && !b.available) return 0;
          if (!a.available) return 1;
          if (!b.available) return -1;

          const paRaw = a.price_usd;
          const pbRaw = b.price_usd;
          const pa =
            typeof paRaw !== "number" || Number.isNaN(paRaw)
              ? Number.POSITIVE_INFINITY
              : paRaw;
          const pb =
            typeof pbRaw !== "number" || Number.isNaN(pbRaw)
              ? Number.POSITIVE_INFINITY
              : pbRaw;
          return pa - pb;
        });
      case "price-desc":
        return list.sort((a, b) => {
          // Private collection works always go to the end
          if (!a.available && !b.available) return 0;
          if (!a.available) return 1;
          if (!b.available) return -1;

          const paRaw = a.price_usd;
          const pbRaw = b.price_usd;
          const pa =
            typeof paRaw !== "number" || Number.isNaN(paRaw)
              ? Number.NEGATIVE_INFINITY
              : paRaw;
          const pb =
            typeof pbRaw !== "number" || Number.isNaN(pbRaw)
              ? Number.NEGATIVE_INFINITY
              : pbRaw;
          return pb - pa;
        });
      case "newest":
        return list.sort((a, b) => {
          const yaRaw = a.year;
          const ybRaw = b.year;
          const ya = typeof yaRaw !== "number" || Number.isNaN(yaRaw) ? 0 : yaRaw;
          const yb = typeof ybRaw !== "number" || Number.isNaN(ybRaw) ? 0 : ybRaw;
          return yb - ya;
        });
      case "oldest":
        return list.sort((a, b) => {
          const yaRaw = a.year;
          const ybRaw = b.year;
          const ya = typeof yaRaw !== "number" || Number.isNaN(yaRaw) ? 0 : yaRaw;
          const yb = typeof ybRaw !== "number" || Number.isNaN(ybRaw) ? 0 : ybRaw;
          return ya - yb;
        });
      case "default":
      default:
        return list;
    }
  }, [filteredWorks, sortBy]);

  const hasActiveFilters =
    !!artistFilter ||
    !!mediumFilter ||
    statusFilter !== "all" ||
    priceRange[0] > priceBounds.min ||
    priceRange[1] < priceBounds.max;

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
          title="Collection"
          description="Explore our collection of works by contemporary Argentine artists."
          url="/artworks"
        />
        <Header />
        <main>
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label block mb-4">Curated Collection</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Collection
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
                    <div className="w-full md:w-1/4">
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Artist
                      </label>
                      <select
                        value={artistFilter}
                        onChange={(e) => setArtistFilter(e.target.value)}
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">All artists</option>
                        {artistOptions.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full md:w-1/4">
                      {/* Medium options populate automatically from Supabase. Add 'medium' field to artworks records. */}
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Medium
                      </label>
                      <select
                        value={mediumFilter}
                        onChange={(e) => setMediumFilter(e.target.value)}
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">All mediums</option>
                        {mediumOptions.map((medium) => (
                          <option key={medium} value={medium}>
                            {medium}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full md:w-1/4">
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Availability
                      </label>
                      <div className="inline-flex rounded-full border border-border bg-background p-1 text-xs">
                        {(["all", "available", "sold"] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setStatusFilter(option)}
                            className={`rounded-full px-4 py-2 min-h-[44px] flex items-center text-xs font-medium capitalize transition-colors ${
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

                    <div className="w-full md:w-1/4">
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Price range (USD)
                      </label>
                      <div className="space-y-3">
                        <div className="relative h-8">
                          {/* Track */}
                          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-border" />
                          {/* Range highlight */}
                          <div
                            className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-foreground"
                            style={{
                              left: `${((priceRange[0] - priceBounds.min) /
                                (priceBounds.max - priceBounds.min || 1)) *
                                100}%`,
                              right: `${100 -
                                ((priceRange[1] - priceBounds.min) /
                                  (priceBounds.max - priceBounds.min || 1)) *
                                  100}%`,
                            }}
                          />
                          {/* Min handle */}
                          <input
                            type="range"
                            min={priceBounds.min}
                            max={priceBounds.max}
                            value={priceRange[0]}
                            onChange={(e) => {
                              const newMin = Math.min(
                                Number(e.target.value),
                                priceRange[1]
                              );
                              setPriceRange([newMin, priceRange[1]]);
                            }}
                            className="pointer-events-auto absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground"
                          />
                          {/* Max handle */}
                          <input
                            type="range"
                            min={priceBounds.min}
                            max={priceBounds.max}
                            value={priceRange[1]}
                            onChange={(e) => {
                              const newMax = Math.max(
                                Number(e.target.value),
                                priceRange[0]
                              );
                              setPriceRange([priceRange[0], newMax]);
                            }}
                            className="pointer-events-auto absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground"
                          />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          USD{" "}
                          {Math.round(priceRange[0] / 100) * 100} – USD{" "}
                          {Math.round(priceRange[1] / 100) * 100}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:w-60">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Sort by
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(
                            e.target.value as
                              | "default"
                              | "price-asc"
                              | "price-desc"
                              | "newest"
                              | "oldest"
                          )
                        }
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="default">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                      </select>
                    </div>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          setArtistFilter("");
                          setStatusFilter("all");
                          setPriceRange([priceBounds.min, priceBounds.max]);
                          setSortBy("default");
                        }}
                        className="self-start text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:underline md:self-auto"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col border border-border bg-card md:col-span-1"
                    >
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
                  <div className="mb-4 text-left">
                    <p className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {hasActiveFilters
                        ? `Showing ${sortedWorks.length} of ${works.length} works`
                        : `${works.length} works`}
                    </p>
                  </div>

                  {sortedWorks.length === 0 ? (
                    <div className="py-24 text-center">
                      <p className="text-sm text-muted-foreground">
                        No works match your current filters.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setArtistFilter("");
                          setStatusFilter("all");
                          setPriceRange([priceBounds.min, priceBounds.max]);
                          setSortBy("default");
                        }}
                        className="mt-4 inline-flex items-center border border-border bg-card px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground hover:bg-foreground hover:text-background transition-colors"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                      {sortedWorks.map((work, index) => {
                        const artistName = work.artistName?.trim() || FALLBACK_ARTIST_NAME;

                        return (
                          <div
                            key={work.id}
                        className="block h-full md:col-span-1"
                          >
                            <div className="flex h-full flex-col border border-border bg-card transition-shadow hover:shadow-md">
                              <Link to={`/artworks/${work.id}`} className="block">
                                <div className="group relative aspect-[4/5] overflow-hidden bg-muted">
                                  <WorkImage
                                    imagenUrl={work.imagenUrl}
                                    title={work.title}
                                    artistName={artistName}
                                    className="h-full w-full"
                                  />
                                  {!work.available && (
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/50 group-hover:opacity-0 transition-opacity duration-300">
                                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1517]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#1e1517]/60">
                                        ● Private Collection
                                      </span>
                                    </div>
                                  )}
                                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-[#1e1517]/65 p-4 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                                    <div>
                                      <p className="font-display text-sm font-medium text-white">
                                        {work.title}
                                      </p>
                                      <p className="mt-1 text-xs text-white/70">{artistName}</p>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/60">
                                      View work →
                                    </p>
                                  </div>
                                </div>
                              </Link>

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
                                <div className="mt-6 flex flex-col gap-3">
                                  <div className="flex items-center justify-between">
                                    {!work.available ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1517]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#1e1517]/60">
                                        ● Private Collection
                                      </span>
                                    ) : (
                                      <span className="font-display text-base font-semibold text-foreground">
                                        {work.priceDisplay}
                                      </span>
                                    )}
                                  </div>
                                  {work.available ? (
                                    <Link
                                      to={`/contacto?obra=${encodeURIComponent(
                                        work.title
                                      )}&artista=${encodeURIComponent(artistName)}`}
                                      className="border border-[#1e1517]/30 px-4 py-1.5 text-[10px] font-display uppercase tracking-[0.18em] text-[#1e1517]"
                                    >
                                      Inquire
                                    </Link>
                                  ) : (
                                    <Link
                                      to={`/contacto?obra=${encodeURIComponent(
                                        work.title
                                      )}&tipo=private-collection`}
                                      className="text-[10px] font-display uppercase tracking-[0.18em] text-[#1e1517]/50 underline underline-offset-2"
                                    >
                                      Inquire about availability
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
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
