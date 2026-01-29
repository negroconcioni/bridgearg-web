import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import bridgeWork1 from "@/assets/bridgearg-work1.jpg";
import bridgeWork2 from "@/assets/bridgearg-work2.jpg";
import bridgeWork3 from "@/assets/bridgearg-work3.jpg";
import bridgeWork4 from "@/assets/bridgearg-work4.jpg";

const selectedWorks = [
  {
    id: 1,
    title: "Sin Título I",
    artist: "Artista Ejemplo 1",
    year: "2024",
    image: bridgeWork1,
    slug: "artista-ejemplo-1",
  },
  {
    id: 2,
    title: "Composición Abstracta",
    artist: "Artista Ejemplo 2",
    year: "2024",
    image: bridgeWork2,
    slug: "artista-ejemplo-2",
  },
  {
    id: 3,
    title: "Paisaje Interior",
    artist: "Artista Ejemplo 3",
    year: "2023",
    image: bridgeWork3,
    slug: "artista-ejemplo-3",
  },
  {
    id: 4,
    title: "Fragmentos",
    artist: "Artista Ejemplo 4",
    year: "2024",
    image: bridgeWork4,
    slug: "artista-ejemplo-4",
  },
];

export function SelectedWorksSection() {
  return (
    <section className="section-padded border-t border-border relative">

      <div className="container mx-auto lg:pl-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="text-label block mb-4">02 / Colección</span>
            <h2 className="text-display text-4xl md:text-6xl">
              Selected<br />Works
            </h2>
          </div>
          <Button variant="technical" asChild>
            <Link to="/obras" className="flex items-center gap-2">
              Ver todas las obras
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {selectedWorks.map((work, index) => (
            <Link
              key={work.id}
              to={`/artistas/${work.slug}`}
              className="group"
            >
              <div className="relative w-full overflow-hidden rounded-2xl bg-background shadow-sm transition-transform duration-300 ease-out group-hover:scale-[1.01] group-hover:shadow-lg">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="h-full w-full rounded-2xl object-cover"
                  />

                  {/* Overlay Content - Simple fade on hover with rounded corners */}
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-foreground/80 to-transparent p-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="text-background">
                      <p className="mb-1 text-sm font-semibold uppercase tracking-[0.16em] text-background/80">
                        {work.artist}
                      </p>
                      <h3 className="font-display text-lg font-medium">{work.title}</h3>
                      <p className="mt-2 text-technical text-background/50">{work.year}</p>
                    </div>
                  </div>

                  {/* Index Number */}
                  <div className="absolute left-4 top-4">
                    <span className="bg-background/90 px-2 py-1 text-label">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
