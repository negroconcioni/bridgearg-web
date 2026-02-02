import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import { getWorks, createCheckoutSession, type WorkFromApi } from "@/lib/api";
import { getWorkImageUrl } from "@/lib/work-images";
import { toast } from "@/hooks/use-toast";

const ObrasPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [works, setWorks] = useState<WorkFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [acquiringId, setAcquiringId] = useState<number | null>(null);

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
        if (!cancelled) toast({ title: "Error", description: "No se pudieron cargar las obras.", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label block mb-4">Catálogo</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Obras
              </h1>
              <p className="text-muted-foreground text-lg mt-6 max-w-xl">
                Explorá nuestra colección de obras de artistas contemporáneos argentinos.
                Cada pieza ha sido seleccionada por su calidad artística y relevancia cultural.
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
                  {works.map((work, index) => (
                    <div key={work.id} className="scroll-reveal group">
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
                          <div className="absolute left-4 top-4">
                            <span className="bg-background/90 px-2 py-1 text-label">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between border-t border-border/80 bg-card px-6 py-5">
                          <div>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              {work.artistName}
                            </p>
                            <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                              {work.titulo}
                            </h3>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              {work.year && <p>{work.year}</p>}
                              {work.medium && <p>{work.medium}</p>}
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

export default ObrasPage;
