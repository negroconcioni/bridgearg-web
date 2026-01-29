import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { ArrowUpRight } from "lucide-react";
import { StampFrame } from "@/components/ui/stamp-frame";
import bridgeWork1 from "@/assets/bridgearg-work1.jpg";
import bridgeWork2 from "@/assets/bridgearg-work2.jpg";
import bridgeWork3 from "@/assets/bridgearg-work3.jpg";
import bridgeWork4 from "@/assets/bridgearg-work4.jpg";

const artists = [
  {
    id: 1,
    name: "Artista Ejemplo 1",
    specialty: "Pintura Abstracta",
    bio: "Artista contemporáneo especializado en pintura abstracta con influencias del expresionismo argentino.",
    image: bridgeWork1,
    slug: "artista-ejemplo-1",
  },
  {
    id: 2,
    name: "Artista Ejemplo 2",
    specialty: "Arte Contemporáneo",
    bio: "Explorador de nuevas narrativas visuales que combinan técnicas tradicionales con medios digitales.",
    image: bridgeWork2,
    slug: "artista-ejemplo-2",
  },
  {
    id: 3,
    name: "Artista Ejemplo 3",
    specialty: "Escultura",
    bio: "Escultora que trabaja con materiales orgánicos y metales, creando piezas que dialogan con el espacio.",
    image: bridgeWork3,
    slug: "artista-ejemplo-3",
  },
  {
    id: 4,
    name: "Artista Ejemplo 4",
    specialty: "Técnica Mixta",
    bio: "Artista multidisciplinario que fusiona pintura, collage y elementos tridimensionales.",
    image: bridgeWork4,
    slug: "artista-ejemplo-4",
  },
];

const ArtistasPage = () => {
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
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Page Header */}
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label block mb-4">Colección</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Artistas
              </h1>
              <p className="text-muted-foreground text-lg mt-6 max-w-xl">
                Conocé a los artistas que forman parte de nuestra galería. 
                Cada uno aporta una visión única del arte contemporáneo argentino.
              </p>
            </div>
          </section>

          {/* Artists Grid */}
          <section ref={sectionRef} className="section-padded">
            <div className="container mx-auto">
              {/* Mobile: Stories Style */}
              <div className="md:hidden space-y-8">
                {artists.map((artist, index) => (
                  <Link
                    key={artist.id}
                    to={`/artistas/${artist.slug}`}
                    className="group scroll-reveal stories-card block overflow-hidden"
                  >
                    <StampFrame variant="rounded" className="w-full">
                      <div className="aspect-[4/5] relative">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent">
                          <p className="text-background text-label mb-1">{artist.specialty}</p>
                          <h2 className="font-display text-3xl font-bold text-background">
                            {artist.name}
                          </h2>
                        </div>
                      </div>
                    </StampFrame>
                  </Link>
                ))}
              </div>

              {/* Desktop: Grid Style */}
              <div className="hidden md:grid grid-cols-2 gap-6">
                {artists.map((artist, index) => (
                  <Link
                    key={artist.id}
                    to={`/artistas/${artist.slug}`}
                    className="group scroll-reveal overflow-hidden"
                  >
                    <StampFrame variant="rounded" className="w-full">
                      <div className="art-image-container aspect-[4/5] relative">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/80 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-6">
                            <p className="text-background text-label mb-2">{artist.specialty}</p>
                            <h2 className="text-handwriting text-3xl font-bold text-background mb-4">
                              {artist.name}
                            </h2>
                            <p className="text-background/70 text-sm max-w-xs mx-auto">
                              {artist.bio}
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-background">
                              <span className="text-technical">Ver obras</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </StampFrame>
                  </Link>
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

export default ArtistasPage;
