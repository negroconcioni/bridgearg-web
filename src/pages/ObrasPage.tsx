import { useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { StampFrame } from "@/components/ui/stamp-frame";
import bridgeWork1 from "@/assets/bridgearg-work1.jpg";
import bridgeWork2 from "@/assets/bridgearg-work2.jpg";
import bridgeWork3 from "@/assets/bridgearg-work3.jpg";
import bridgeWork4 from "@/assets/bridgearg-work4.jpg";

const allWorks = [
  { id: 1, title: "Sin Título I", artist: "Artista Ejemplo 1", year: "2024", medium: "Óleo sobre lienzo", price: "USD 4,500", image: bridgeWork1, available: true },
  { id: 2, title: "Diálogo I", artist: "Artista Ejemplo 2", year: "2024", medium: "Instalación", price: "USD 8,000", image: bridgeWork2, available: true },
  { id: 3, title: "Volumen I", artist: "Artista Ejemplo 3", year: "2024", medium: "Bronce", price: "USD 12,000", image: bridgeWork3, available: true },
  { id: 4, title: "Acumulación", artist: "Artista Ejemplo 4", year: "2024", medium: "Técnica mixta", price: "USD 1,800", image: bridgeWork4, available: true },
  { id: 5, title: "Composición en Azul", artist: "Artista Ejemplo 1", year: "2024", medium: "Acrílico sobre lienzo", price: "USD 3,200", image: bridgeWork2, available: false },
  { id: 6, title: "Resonancias", artist: "Artista Ejemplo 2", year: "2024", medium: "Video arte", price: "USD 5,500", image: bridgeWork3, available: true },
];

const ObrasPage = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
  }, []);

  const handleAcquire = (workTitle: string) => {
    alert(`Próximamente: Checkout de Stripe para "${workTitle}"`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Page Header */}
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

          {/* Works Grid */}
          <section ref={sectionRef} className="section-padded relative">
            {/* Lateral text "AMBASSADORS OF ARGENTINE ART" */}
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center z-10">
              <p className="text-technical text-muted-foreground whitespace-nowrap text-xs tracking-[0.3em]">
                AMBASSADORS OF ARGENTINE ART
              </p>
            </div>

            <div className="container mx-auto lg:pl-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {allWorks.map((work, index) => (
                  <div key={work.id} className="scroll-reveal group">
                    {index % 4 === 0 ? (
                      <StampFrame variant="rounded" className="w-full">
                        <div className="art-image-container aspect-[4/5] relative">
                          <img
                            src={work.image}
                            alt={work.title}
                            className="w-full h-full object-cover"
                          />
                          {!work.available && (
                            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                              <span className="text-technical text-background bg-foreground/80 px-4 py-2">
                                Vendida
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="text-label bg-background/90 px-2 py-1">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </StampFrame>
                    ) : (
                      <div className={index % 4 === 1 ? "rounded-2xl overflow-hidden" : ""}>
                        <div className="art-image-container aspect-[4/5] relative">
                          <img
                            src={work.image}
                            alt={work.title}
                            className="w-full h-full object-cover"
                          />
                          {!work.available && (
                            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                              <span className="text-technical text-background bg-foreground/80 px-4 py-2">
                                Vendida
                              </span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="text-label bg-background/90 px-2 py-1">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    <div className="p-6 border-t border-border">
                      <p className="text-label mb-1">{work.artist}</p>
                      <h3 className="font-display font-medium text-lg mb-2">{work.title}</h3>
                      <div className="space-y-1 mb-4">
                        <p className="text-label">{work.year} · {work.medium}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-semibold text-lg">{work.price}</span>
                        {work.available && (
                          <Button
                            variant="acquire"
                            size="sm"
                            onClick={() => handleAcquire(work.title)}
                            className="flex items-center gap-2"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Adquirir
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ObrasPage;
