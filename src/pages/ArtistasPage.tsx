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

const bridgeDividerSrc = encodeURI("/assets/BRIDGEARG - Exportacion logos - PNG-21.png");

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

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedArtistCards = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let list = artistCards;
    if (term) {
      list = list.filter(({ artist }) => artist.name.toLowerCase().includes(term));
    }

    return [...list].sort((a, b) => {
      const nameA = a.artist.name.trim();
      const nameB = b.artist.name.trim();
      const cmp = nameA.localeCompare(nameB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [artistCards, searchTerm, sortOrder]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#fcf8ea]">
        <SEO
          title="Artists"
          description="Discover contemporary Argentine artists represented by BridgeArg."
          url="/artists"
        />
        <Header />
        <main>
          <section className="bg-[#fcf8ea] px-6 py-20 md:px-10 md:py-24 lg:py-32">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-[#1e1517] md:text-5xl lg:text-[72px]">
                Artists
              </h1>
              <p className="mx-auto mt-4 md:mt-6 max-w-2xl font-display text-base leading-8 text-[#1e1517]/72 md:text-lg">
                A vanguard roster of contemporary voices shaping new dialogues between Argentina
                and the global collector.
              </p>
            </div>
          </section>

          <section className="bg-[#fcf8ea] px-6 pb-24 md:px-10 md:pb-32">
            <div className="mx-auto max-w-7xl">
              {!loading && (
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="w-full md:w-2/3">
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1e1517]/60">
                      Search artists
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Type a name…"
                      className="w-full border-b border-[#1e1517]/20 bg-transparent pb-2 font-sans text-sm text-[#1e1517] outline-none transition-colors placeholder:text-[#1e1517]/35 focus:border-[#1e1517]"
                      style={{ fontFamily: "'Onest', sans-serif" }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSortOrder("asc")}
                      className={`px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                        sortOrder === "asc"
                          ? "text-[#1e1517] border border-[#1e1517]/40 bg-[#fcf8ea]"
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
                          ? "text-[#1e1517] border border-[#1e1517]/40 bg-[#fcf8ea]"
                          : "text-[#1e1517]/45 border border-transparent hover:text-[#1e1517]"
                      }`}
                      style={{ fontFamily: "'Onest', sans-serif" }}
                    >
                      Z → A
                    </button>
                  </div>
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-20">
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
                <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-20 transition-opacity duration-300 ease-out">
                  {filteredAndSortedArtistCards.map(({ artist, featuredWork }) => (
                    <Link
                      key={artist.id}
                      to={`/artistas/${artist.slug}`}
                      className="group flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-full max-w-[clamp(180px,60vw,260px)]">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] bg-[#e8e4d8] transition-transform duration-300 ease-out group-hover:scale-[1.03]">
                          <OptimizedImage
                            src={artist.imageUrl ?? ""}
                            alt={artist.name}
                            className="h-full w-full"
                            imageClassName="h-full w-full object-cover object-[50%_0%] grayscale transition-all duration-300 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                            logSrcOnError
                          />

                          {featuredWork ? (
                            <OptimizedImage
                              src={featuredWork.imagenUrl}
                              title={featuredWork.title}
                              artistName={artist.name}
                              variant="artwork"
                              className="absolute inset-0 h-full w-full"
                              imageClassName="h-full w-full object-cover object-[50%_0%] opacity-0 transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                            />
                          ) : null}

                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity duration-300 ease-out group-hover:bg-black/35 group-hover:opacity-100">
                            <span className="px-4 py-1 font-display text-xs uppercase tracking-[0.16em] text-white">
                              {artist.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 text-center">
                        <p
                          className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[#1e1517] text-center"
                          style={{ fontFamily: "'Onest', sans-serif", fontStyle: "normal" }}
                        >
                          {artist.name}
                        </p>
                        <img
                          src={bridgeDividerSrc}
                          alt=""
                          className="mx-auto mt-3 h-3 w-auto object-contain opacity-25"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="bg-[#fcf8ea] px-6 pb-32 md:px-10">
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
