import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import bridgeStudio from "@/assets/bridgearg-studio.jpg";
import { getWorks, type WorkFromApi } from "@/lib/api";
import { WorkImage } from "@/components/WorkImage";
import { OptimizedImage } from "@/components/OptimizedImage";
import { toast } from "@/hooks/use-toast";

const artistsData: Record<string, { name: string; specialty: string; bio: string; statement: string; portrait: string }> = {
  "artista-ejemplo-1": {
    name: "Artist Example 1",
    specialty: "Abstract Painting",
    bio: "Born in Buenos Aires, 1985. Trained at the National School of Fine Arts. His work explores the intersection of the organic and the geometric.",
    statement: "My practice centers on the exploration of textures and forms that evoke interior landscapes. Each work is a dialogue between chaos and order.",
    portrait: bridgeStudio,
  },
  "artista-ejemplo-2": {
    name: "Artist Example 2",
    specialty: "Contemporary Art",
    bio: "Based in Córdoba since 2010. Her work challenges traditional narratives of Latin American art.",
    statement: "I seek to create bridges between the ancestral and the contemporary, using symbols that transcend cultural boundaries.",
    portrait: bridgeStudio,
  },
  "artista-ejemplo-3": {
    name: "Artist Example 3",
    specialty: "Sculpture",
    bio: "Sculptor with over twenty years of practice. Her pieces have been exhibited in museums across the Americas and Europe.",
    statement: "Sculpture is my way of engaging with space and time. Each piece is a silent conversation.",
    portrait: bridgeStudio,
  },
  "artista-ejemplo-4": {
    name: "Artist Example 4",
    specialty: "Mixed Media",
    bio: "Emerging artist combining painting, collage, and found elements to create works that question consumption.",
    statement: "My work is a reflection on accumulation and discard in contemporary society.",
    portrait: bridgeStudio,
  },
};

const ArtistaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const artist = slug ? artistsData[slug] : null;
  const [works, setWorks] = useState<WorkFromApi[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoadingWorks(true);
    setWorks([]);
    let cancelled = false;
    getWorks(slug)
      .then((data) => {
        if (!cancelled) setWorks(data);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Error", description: "Could not load works.", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoadingWorks(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (!artist) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="section-padded">
            <div className="container mx-auto text-center">
              <h1 className="text-display text-4xl mb-4">Artist not found</h1>
              <Button variant="technical" asChild>
                <Link to="/artistas">Back to Artists</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto pt-8">
            <Link
              to="/artistas"
              className="inline-flex items-center gap-2 text-label hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Artists
            </Link>
          </div>

          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="w-full overflow-hidden rounded-2xl bg-background shadow-sm">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <OptimizedImage
                      src={artist.portrait}
                      alt={artist.name}
                      className="h-full w-full rounded-2xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-label block mb-4">{artist.specialty}</span>
                  <h1 className="text-display text-4xl md:text-6xl mb-6">{artist.name}</h1>
                  <div className="space-y-6">
                    <div className="tech-box">
                      <h3 className="text-technical text-foreground mb-3">Biography</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{artist.bio}</p>
                    </div>
                    <div className="tech-box">
                      <h3 className="text-technical text-foreground mb-3">Statement</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed italic">"{artist.statement}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-padded">
            <div className="container mx-auto">
              <div className="mb-12">
                <span className="text-label block mb-4">Available Works</span>
                <h2 className="text-display text-3xl md:text-5xl">Curated Collection</h2>
              </div>

              {loadingWorks ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {works.map((work, index) => (
                    <Link
                      key={work.id}
                      to={`/obras/${work.id}`}
                      className="group block h-full"
                    >
                      <div className="flex h-full flex-col border border-border bg-card transition-shadow hover:shadow-md">
                        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                          <WorkImage
                            imagenUrl={work.imagenUrl}
                            title={work.titulo}
                            artistName={artist.name}
                            className="h-full w-full"
                          />
                          {!work.available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                              <p className="px-4 py-2 text-center text-background/95 text-sm font-light italic max-w-[80%]">
                                This piece is now part of a private collection
                              </p>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-background/90 px-2 py-1 text-label">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between border-t border-border/80 bg-card px-6 py-5">
                          <div>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              {artist.name}
                            </p>
                            <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                              {work.titulo}
                            </h3>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              {work.year && <p>{work.year}</p>}
                              {work.medium && <p>{work.medium}</p>}
                              {work.dimensions && <p>{work.dimensions}</p>}
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

export default ArtistaDetailPage;
