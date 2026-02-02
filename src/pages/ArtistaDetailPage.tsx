import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import bridgeStudio from "@/assets/bridgearg-studio.jpg";
import { getWorks, createCheckoutSession, type WorkFromApi } from "@/lib/api";
import { getWorkImageUrl } from "@/lib/work-images";
import { toast } from "@/hooks/use-toast";

const artistsData: Record<string, { name: string; specialty: string; bio: string; statement: string; portrait: string }> = {
  "artista-ejemplo-1": {
    name: "Artista Ejemplo 1",
    specialty: "Pintura Abstracta",
    bio: "Nacido en Buenos Aires en 1985. Formación en la Escuela Nacional de Bellas Artes. Su trabajo explora la intersección entre lo orgánico y lo geométrico.",
    statement: "Mi práctica artística se centra en la exploración de texturas y formas que evocan paisajes interiores. Cada obra es un diálogo entre el caos y el orden.",
    portrait: bridgeStudio,
  },
  "artista-ejemplo-2": {
    name: "Artista Ejemplo 2",
    specialty: "Arte Contemporáneo",
    bio: "Radicada en Córdoba desde 2010. Su obra cuestiona las narrativas tradicionales del arte latinoamericano.",
    statement: "Busco crear puentes entre lo ancestral y lo contemporáneo, utilizando símbolos que trascienden fronteras culturales.",
    portrait: bridgeStudio,
  },
  "artista-ejemplo-3": {
    name: "Artista Ejemplo 3",
    specialty: "Escultura",
    bio: "Escultora con más de 20 años de trayectoria. Sus piezas han sido exhibidas en museos de América y Europa.",
    statement: "La escultura es mi forma de dialogar con el espacio y el tiempo. Cada pieza es una conversación silenciosa.",
    portrait: bridgeStudio,
  },
  "artista-ejemplo-4": {
    name: "Artista Ejemplo 4",
    specialty: "Técnica Mixta",
    bio: "Artista emergente que combina pintura, collage y elementos encontrados para crear obras que cuestionan el consumo.",
    statement: "Mi trabajo es una reflexión sobre la acumulación y el descarte en la sociedad contemporánea.",
    portrait: bridgeStudio,
  },
};

const ArtistaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const artist = slug ? artistsData[slug] : null;
  const [works, setWorks] = useState<WorkFromApi[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [acquiringId, setAcquiringId] = useState<number | null>(null);

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
        if (!cancelled) toast({ title: "Error", description: "No se pudieron cargar las obras.", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoadingWorks(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  const handleAcquire = async (workId: number) => {
    setAcquiringId(workId);
    try {
      const { url } = await createCheckoutSession(workId);
      if (url) window.location.href = url;
      else toast({ title: "Error", description: "No se pudo iniciar el pago.", variant: "destructive" });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Error al iniciar el pago.", variant: "destructive" });
    } finally {
      setAcquiringId(null);
    }
  };

  if (!artist) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="section-padded">
            <div className="container mx-auto text-center">
              <h1 className="text-display text-4xl mb-4">Artista no encontrado</h1>
              <Button variant="technical" asChild>
                <Link to="/artistas">Volver a Artistas</Link>
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
              Volver a Artistas
            </Link>
          </div>

          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="w-full overflow-hidden rounded-2xl bg-background shadow-sm">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <img src={artist.portrait} alt={artist.name} className="h-full w-full rounded-2xl object-cover" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-label block mb-4">{artist.specialty}</span>
                  <h1 className="text-display text-4xl md:text-6xl mb-6">{artist.name}</h1>
                  <div className="space-y-6">
                    <div className="tech-box">
                      <h3 className="text-technical text-foreground mb-3">Biografía</h3>
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
                <span className="text-label block mb-4">Obras disponibles</span>
                <h2 className="text-display text-3xl md:text-5xl">Colección</h2>
              </div>

              {loadingWorks ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {works.map((work, index) => (
                    <div key={work.id} className="group">
                      <div className="flex h-full flex-col border border-border bg-card">
                        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                          <img
                            src={getWorkImageUrl(work.imagenUrl)}
                            alt={work.titulo}
                            className="h-full w-full object-cover"
                          />
                          {!work.available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                              <span className="bg-foreground/80 px-4 py-2 text-background text-technical">
                                Vendida
                              </span>
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
                            <span className="font-display text-base font-semibold text-foreground">
                              {work.priceDisplay}
                            </span>
                            {work.available ? (
                              <Button
                                variant="acquire"
                                size="sm"
                                onClick={() => handleAcquire(work.id)}
                                disabled={acquiringId === work.id}
                                className="flex items-center gap-2 pointer-events-auto"
                              >
                                {acquiringId === work.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ShoppingBag className="h-4 w-4" />
                                )}
                                {acquiringId === work.id ? "Procesando…" : "Adquirir"}
                              </Button>
                            ) : (
                              <span className="pointer-events-none inline-flex items-center rounded border border-border bg-muted px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Vendido
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
