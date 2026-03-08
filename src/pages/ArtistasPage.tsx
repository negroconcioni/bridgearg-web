import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { ArrowUpRight } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import bridgeWork1 from "@/assets/bridgearg-work1.jpg";
import bridgeWork2 from "@/assets/bridgearg-work2.jpg";
import bridgeWork3 from "@/assets/bridgearg-work3.jpg";
import bridgeWork4 from "@/assets/bridgearg-work4.jpg";

const artists = [
  {
    id: 1,
    name: "Artist Example 1",
    specialty: "Abstract Painting",
    bio: "Contemporary artist specializing in abstract painting with influences from Argentine expressionism.",
    image: bridgeWork1,
    slug: "artista-ejemplo-1",
  },
  {
    id: 2,
    name: "Artist Example 2",
    specialty: "Contemporary Art",
    bio: "Explorer of new visual narratives combining traditional techniques with digital media.",
    image: bridgeWork2,
    slug: "artista-ejemplo-2",
  },
  {
    id: 3,
    name: "Artist Example 3",
    specialty: "Sculpture",
    bio: "Sculptor working with organic materials and metals, creating pieces in dialogue with space.",
    image: bridgeWork3,
    slug: "artista-ejemplo-3",
  },
  {
    id: 4,
    name: "Artist Example 4",
    specialty: "Mixed Media",
    bio: "Multidisciplinary artist fusing painting, collage, and three-dimensional elements.",
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
              <span className="text-label block mb-4">Curated Collection</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Artists
              </h1>
              <p className="text-muted-foreground text-lg mt-6 max-w-xl">
                Meet the artists represented by our gallery.
                Each brings a distinct vision of contemporary Argentine art.
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
                    <div className="relative w-full overflow-hidden rounded-2xl bg-background shadow-sm">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                        <OptimizedImage
                          src={artist.image}
                          alt={artist.name}
                          className="h-full w-full rounded-2xl"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-6">
                          <p className="mb-1 text-label text-background">{artist.specialty}</p>
                          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.16em] text-background">
                            {artist.name}
                          </h2>
                        </div>
                      </div>
                    </div>
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
                    <div className="relative w-full overflow-hidden rounded-2xl bg-background shadow-sm transition-transform duration-300 ease-out hover:scale-[1.01] hover:shadow-md">
                      <div className="art-image-container relative aspect-[4/5] rounded-2xl overflow-hidden">
                        <OptimizedImage
                          src={artist.image}
                          alt={artist.name}
                          className="h-full w-full rounded-2xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/80">
                          <div className="p-6 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="mb-2 text-background text-label">{artist.specialty}</p>
                            <h2 className="mb-4 font-display text-base md:text-lg font-semibold uppercase tracking-[0.16em] text-background">
                              {artist.name}
                            </h2>
                            <p className="mx-auto text-sm text-background/70 max-w-xs">
                              {artist.bio}
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-background">
                              <span className="text-technical">View Works</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
