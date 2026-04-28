import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getArtists, getWorks, type ArtistFromApi, type WorkFromApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * TODO - Base de datos:
 * Los artistas actuales son datos demo ("Artista Ejemplo 1-10").
 * Antes del lanzamiento, cargar artistas reales con:
 * - Nombres reales
 * - Slugs únicos (usados para routing en /artistas/:slug)
 * - Fotos de perfil individuales (image_url)
 * - Bio, origin, specialty, birthYear
 * - Foto del estudio (studio_image_url) y descripción (studio_description)
 */

type ArtistCard = {
  artist: ArtistFromApi;
  featuredWork: WorkFromApi | null;
};

const ArtistasPage = () => {
  const {
    data: artists = [],
    isLoading: loadingArtists,
    isError: artistsError,
  } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const {
    data: works = [],
    isLoading: loadingWorks,
    isError: worksError,
  } = useQuery({
    queryKey: ["works"],
    queryFn: () => getWorks(),
  });

  const loading = loadingArtists || loadingWorks;

  useEffect(() => {
    if (artistsError || worksError) {
      toast({ title: "Error", description: "Could not load artists.", variant: "destructive" });
    }
  }, [artistsError, worksError]);

  const artistCards = useMemo<ArtistCard[]>(() => {
    const featuredWorkByArtistSlug = new Map<string, WorkFromApi>();

    for (const work of works) {
      if (!featuredWorkByArtistSlug.has(work.artistSlug)) {
        featuredWorkByArtistSlug.set(work.artistSlug, work);
      }
    }

    return artists.map((artist) => ({
      artist,
      featuredWork: featuredWorkByArtistSlug.get(artist.slug) ?? null,
    }));
  }, [artists, works]);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedArtistCards = useMemo(() => {
    return [...artistCards].sort((a, b) => {
      const nameA = a.artist.name.trim();
      const nameB = b.artist.name.trim();
      const cmp = nameA.localeCompare(nameB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [artistCards, sortOrder]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEO
          title="Artists"
          description="Discover contemporary Argentine artists represented by BridgeArg."
          url="/artists"
        />
        <Header />
        <main>
          <section
            className="bg-background py-20 md:py-24 lg:py-32"
            style={{ paddingLeft: "clamp(24px, 5vw, 80px)", paddingRight: "clamp(24px, 5vw, 80px)" }}
          >
            <div className="relative mx-auto max-w-[1800px]">
              <div className="mx-auto max-w-5xl text-center">
                <h1 className="font-display text-4xl font-semibold tracking-tight text-[#1e1517] md:text-5xl lg:text-[72px]">
                  Artists
                </h1>
                <p className="mx-auto mt-4 md:mt-6 max-w-2xl font-display text-base leading-8 text-[#1e1517]/72 md:text-lg">
                  A vanguard roster of contemporary voices shaping new dialogues between Argentina
                  and the global collector.
                </p>
              </div>

              {!loading && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    zIndex: 2,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSortOrder("asc")}
                    className={`px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                      sortOrder === "asc"
                        ? "text-[#1e1517] border border-[#1e1517]/40 bg-background"
                        : "text-[#1e1517]/45 border border-transparent hover:text-[#1e1517]"
                    }`}
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    A → Z
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder("desc")}
                    className={`px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                      sortOrder === "desc"
                        ? "text-[#1e1517] border border-[#1e1517]/40 bg-background"
                        : "text-[#1e1517]/45 border border-transparent hover:text-[#1e1517]"
                    }`}
                    style={{ fontFamily: "'Onest', sans-serif" }}
                  >
                    Z → A
                  </button>
                </div>
              )}
            </div>
          </section>

          <section
            className="bg-background pb-24 md:pb-32"
            style={{ paddingLeft: "clamp(24px, 5vw, 80px)", paddingRight: "clamp(24px, 5vw, 80px)" }}
          >
            <div className="mx-auto max-w-[1800px]">
              {!loading && filteredAndSortedArtistCards.length > 0 && (
                <div style={{ marginBottom: "clamp(48px, 8vh, 96px)" }}>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                    style={{ rowGap: "12px" }}
                  >
                    {filteredAndSortedArtistCards.map(({ artist }) => (
                      <Link
                        key={`list-${artist.id}`}
                        to={`/artistas/${artist.slug}`}
                        className="block w-full text-center text-[#1e1517] hover:text-[#7FB2D1] transition-colors duration-200"
                        style={{
                          fontFamily: '"Onest", sans-serif',
                          fontSize: "clamp(13px, 1vw, 16px)",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "4px 0",
                        }}
                      >
                        {artist.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[clamp(32px,5vw,80px)] gap-y-[clamp(48px,8vh,120px)]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-full max-w-[clamp(180px,60vw,260px)]">
                        <Skeleton className="aspect-[2/3] rounded-[24px] bg-[#e8e0d0]" />
                      </div>
                      <div className="flex flex-col items-center gap-3 pt-6">
                        <Skeleton className="h-8 w-40 bg-[#e8e0d0]" />
                        <Skeleton className="h-2 w-16 bg-[#e8e0d0]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[clamp(32px,5vw,80px)] gap-y-[clamp(48px,8vh,120px)] transition-opacity duration-300 ease-out">
                  {filteredAndSortedArtistCards.map(({ artist }) => (
                    <Link
                      key={artist.id}
                      to={`/artistas/${artist.slug}`}
                      className="group flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-full max-w-[clamp(180px,60vw,260px)]">
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "763 / 738",
                            maxWidth: "1500px",
                            margin: "0 auto",
                          }}
                        >
                          <img
                            src="/assets/BRIDGEARG - Asset-12.svg"
                            alt=""
                            aria-hidden
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              zIndex: 1,
                              pointerEvents: "none",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "29.45%",
                              left: "31.45%",
                              width: "39.5%",
                              aspectRatio: "1",
                              borderRadius: "50%",
                              overflow: "hidden",
                              zIndex: 2,
                            }}
                          >
                            <OptimizedImage
                              src={artist.imageUrl ?? ""}
                              alt={artist.name}
                              className="!h-full !w-full"
                              imageClassName="h-full w-full object-cover object-top"
                              logSrcOnError
                            />
                          </div>
                        </div>
                        <span
                          style={{
                            fontFamily: '"Onest", sans-serif',
                            fontWeight: 700,
                            color: "#1e1517",
                            letterSpacing: "0.08em",
                            fontSize: "clamp(16px, 1.5vw, 22px)",
                            marginTop: "clamp(16px, 2vh, 28px)",
                            display: "inline-block",
                            textTransform: "uppercase",
                          }}
                        >
                          {artist.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="bg-background px-6 pb-32 md:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <p
                className="font-display text-3xl md:text-4xl tracking-tight text-[#1e1517]"
                style={{ fontFamily: "'Onest', sans-serif", fontStyle: "normal" }}
              >
                Interested in acquiring a work?
              </p>
              <div className="mt-4">
                <Link
                  to="/contacto"
                  className="font-display text-xs font-medium uppercase tracking-[0.16em] text-[#1e1517] underline underline-offset-4"
                  style={{ fontFamily: "'Onest', sans-serif", fontStyle: "normal" }}
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ArtistasPage;
