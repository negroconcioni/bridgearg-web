import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] md:min-h-[90vh] flex items-center bg-background overflow-hidden">
      {/* Mobile: Centered Logo */}
      <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="flex items-baseline gap-1 justify-center">
          <span className="text-display text-6xl">bridge</span>
          <span className="text-display text-6xl text-muted-foreground">arg</span>
        </div>
      </div>
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-border opacity-50" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-border opacity-50" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-border opacity-50" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-border opacity-50" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-border opacity-50" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl">
          {/* Label */}
          <div className="mb-8 animate-fade-up hidden md:block">
            <span className="text-label">Galería de Arte Contemporáneo</span>
          </div>

          {/* Main Title - Hidden on mobile, shown on desktop */}
          <h1 className="hero-title mb-8 animate-fade-up animate-stagger-1 hidden md:block">
            bridge
            <span className="text-muted-foreground">arg</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12 animate-fade-up animate-stagger-2 font-light leading-relaxed">
            Conectamos el arte argentino con el mundo. 
            Una plataforma que tiende puentes entre artistas emergentes 
            y coleccionistas internacionales.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animate-stagger-3">
            <Button variant="hero" asChild>
              <Link to="/artistas">Explorar Artistas</Link>
            </Button>
            <Button variant="technical" asChild>
              <Link to="/obras">Ver Obras</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-up animate-stagger-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-label">Scroll</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 right-8 hidden md:block">
        <div className="tech-box w-20 h-20 flex items-center justify-center">
          <span className="text-technical text-[10px]">Est. 2026</span>
        </div>
      </div>
    </section>
  );
}
