import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Loader2 } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getArtists, getWorks, type ArtistFromApi, type WorkFromApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type ArtistCard = {
  artist: ArtistFromApi;
  featuredWork: WorkFromApi | null;
};

const bridgeDividerSrc = encodeURI("/assets/BRIDGEARG - Exportacion logos - PNG-21.png");

const ArtistasPage = () => {
  const [artists, setArtists] = useState<ArtistFromApi[]>([]);
  const [works, setWorks] = useState<WorkFromApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getArtists(), getWorks()])
      .then(([artistsData, worksData]) => {
        if (cancelled) return;
        setArtists(artistsData);
        setWorks(worksData);
      })
      .catch(() => {
        if (!cancelled) {
          toast({ title: "Error", description: "Could not load artists.", variant: "destructive" });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#fcf8ea]">
        <Header />
        <main>
          <section className="bg-[#fcf8ea] px-6 py-32 md:px-10">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="font-display text-5xl font-semibold tracking-tight text-[#1e1517] md:text-7xl">
                Artists
              </h1>
              <p className="mx-auto mt-6 max-w-2xl font-display text-base leading-8 text-[#1e1517]/72 md:text-lg">
                A vanguard roster of contemporary voices shaping new dialogues between Argentina
                and the global collector.
              </p>
            </div>
          </section>

          <section className="bg-[#fcf8ea] px-6 pb-32 md:px-10">
            <div className="mx-auto max-w-7xl">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1e1517]/50" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-20">
                  {artistCards.map(({ artist, featuredWork }) => (
                    <Link
                      key={artist.id}
                      to={`/artistas/${artist.slug}`}
                      className="group flex flex-col items-center"
                    >
                      <div className="w-full max-w-[260px]">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-full bg-[#f3ecdd] transition-transform duration-500 ease-out group-hover:scale-105">
                          <OptimizedImage
                            src={artist.imageUrl ?? ""}
                            alt={artist.name}
                            className="h-full w-full"
                            imageClassName="object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                            logSrcOnError
                          />

                          {featuredWork ? (
                            <OptimizedImage
                              src={featuredWork.imagenUrl}
                              title={featuredWork.title}
                              artistName={artist.name}
                              variant="artwork"
                              className="absolute inset-0 h-full w-full"
                              imageClassName="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="pt-6 text-center">
                        <p
                          className="text-4xl text-[#1e1517]/90 md:text-5xl"
                          style={{ fontFamily: "BestDB, serif" }}
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
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ArtistasPage;
