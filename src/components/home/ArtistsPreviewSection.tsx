import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { StampFrame } from "@/components/ui/stamp-frame";

const artists = [
  { name: "Artista Ejemplo 1", specialty: "Pintura Abstracta", slug: "artista-ejemplo-1" },
  { name: "Artista Ejemplo 2", specialty: "Arte Contemporáneo", slug: "artista-ejemplo-2" },
  { name: "Artista Ejemplo 3", specialty: "Escultura", slug: "artista-ejemplo-3" },
  { name: "Artista Ejemplo 4", specialty: "Técnica Mixta", slug: "artista-ejemplo-4" },
];

export function ArtistsPreviewSection() {
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

  return (
    <section ref={sectionRef} className="section-padded border-t border-border">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="text-label block mb-4">03 / Creadores</span>
            <h2 className="text-display text-4xl md:text-6xl">
              Artistas<br />Representados
            </h2>
          </div>
          <Button variant="technical" asChild>
            <Link to="/artistas" className="flex items-center gap-2">
              Ver todos
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Artists List - Mobile Stories Style */}
        <div className="md:border-t md:border-border">
          {/* Mobile: Cards Style */}
          <div className="md:hidden space-y-6">
            {artists.map((artist, index) => (
              <Link
                key={artist.slug}
                to={`/artistas/${artist.slug}`}
                className="group scroll-reveal stories-card block bg-background border-2 border-border rounded-3xl overflow-hidden"
              >
                <div className="p-8 h-full flex flex-col justify-center items-center text-center">
                  <span className="text-label mb-4">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">
                    {artist.name}
                  </h3>
                  <p className="text-label">{artist.specialty}</p>
                  <ArrowUpRight className="w-6 h-6 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: List Style */}
          <div className="hidden md:block">
            {artists.map((artist, index) => (
              <Link
                key={artist.slug}
                to={`/artistas/${artist.slug}`}
                className="group scroll-reveal flex items-center justify-between py-6 md:py-8 border-b border-border hover:bg-muted/30 transition-colors px-4 -mx-4"
              >
                <div className="flex items-center gap-6 md:gap-12">
                  <span className="text-label w-8">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold group-hover:translate-x-2 transition-transform">
                      {artist.name}
                    </h3>
                    <p className="text-label mt-1">{artist.specialty}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
