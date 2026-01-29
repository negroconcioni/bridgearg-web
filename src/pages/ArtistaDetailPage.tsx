import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import bridgeWork1 from "@/assets/bridgearg-work1.jpg";
import bridgeWork2 from "@/assets/bridgearg-work2.jpg";
import bridgeWork3 from "@/assets/bridgearg-work3.jpg";
import bridgeWork4 from "@/assets/bridgearg-work4.jpg";
import bridgeStudio from "@/assets/bridgearg-studio.jpg";

// Mock data - in production this would come from an API
const artistsData: Record<string, {
  name: string;
  specialty: string;
  bio: string;
  statement: string;
  portrait: string;
  works: Array<{
    id: number;
    title: string;
    year: string;
    medium: string;
    dimensions: string;
    price: string;
    image: string;
    available: boolean;
  }>;
}> = {
  "artista-ejemplo-1": {
    name: "Artista Ejemplo 1",
    specialty: "Pintura Abstracta",
    bio: "Nacido en Buenos Aires en 1985. Formación en la Escuela Nacional de Bellas Artes. Su trabajo explora la intersección entre lo orgánico y lo geométrico.",
    statement: "Mi práctica artística se centra en la exploración de texturas y formas que evocan paisajes interiores. Cada obra es un diálogo entre el caos y el orden.",
    portrait: bridgeStudio,
    works: [
      { id: 1, title: "Sin Título I", year: "2024", medium: "Óleo sobre lienzo", dimensions: "120 x 150 cm", price: "USD 4,500", image: bridgeWork1, available: true },
      { id: 2, title: "Composición en Azul", year: "2024", medium: "Acrílico sobre lienzo", dimensions: "100 x 100 cm", price: "USD 3,200", image: bridgeWork2, available: true },
      { id: 3, title: "Fragmentos de Memoria", year: "2023", medium: "Técnica mixta", dimensions: "80 x 120 cm", price: "USD 2,800", image: bridgeWork3, available: false },
      { id: 4, title: "Horizonte Interior", year: "2023", medium: "Óleo sobre lienzo", dimensions: "150 x 200 cm", price: "USD 6,000", image: bridgeWork4, available: true },
    ],
  },
  "artista-ejemplo-2": {
    name: "Artista Ejemplo 2",
    specialty: "Arte Contemporáneo",
    bio: "Radicada en Córdoba desde 2010. Su obra cuestiona las narrativas tradicionales del arte latinoamericano.",
    statement: "Busco crear puentes entre lo ancestral y lo contemporáneo, utilizando símbolos que trascienden fronteras culturales.",
    portrait: bridgeStudio,
    works: [
      { id: 1, title: "Diálogo I", year: "2024", medium: "Instalación", dimensions: "Variable", price: "USD 8,000", image: bridgeWork2, available: true },
      { id: 2, title: "Resonancias", year: "2024", medium: "Video arte", dimensions: "12 min loop", price: "USD 5,500", image: bridgeWork3, available: true },
    ],
  },
  "artista-ejemplo-3": {
    name: "Artista Ejemplo 3",
    specialty: "Escultura",
    bio: "Escultora con más de 20 años de trayectoria. Sus piezas han sido exhibidas en museos de América y Europa.",
    statement: "La escultura es mi forma de dialogar con el espacio y el tiempo. Cada pieza es una conversación silenciosa.",
    portrait: bridgeStudio,
    works: [
      { id: 1, title: "Volumen I", year: "2024", medium: "Bronce", dimensions: "45 x 30 x 30 cm", price: "USD 12,000", image: bridgeWork3, available: true },
      { id: 2, title: "Tensiones", year: "2023", medium: "Acero corten", dimensions: "200 x 80 x 80 cm", price: "USD 25,000", image: bridgeWork4, available: true },
    ],
  },
  "artista-ejemplo-4": {
    name: "Artista Ejemplo 4",
    specialty: "Técnica Mixta",
    bio: "Artista emergente que combina pintura, collage y elementos encontrados para crear obras que cuestionan el consumo.",
    statement: "Mi trabajo es una reflexión sobre la acumulación y el descarte en la sociedad contemporánea.",
    portrait: bridgeStudio,
    works: [
      { id: 1, title: "Acumulación", year: "2024", medium: "Técnica mixta", dimensions: "60 x 80 cm", price: "USD 1,800", image: bridgeWork4, available: true },
      { id: 2, title: "Capas", year: "2024", medium: "Collage", dimensions: "40 x 60 cm", price: "USD 1,200", image: bridgeWork1, available: true },
    ],
  },
};

const ArtistaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const artist = slug ? artistsData[slug] : null;

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

  const handleAcquire = (workTitle: string) => {
    // This will be replaced with Stripe Checkout integration
    alert(`Próximamente: Checkout de Stripe para "${workTitle}"`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Back Link */}
          <div className="container mx-auto pt-8">
            <Link
              to="/artistas"
              className="inline-flex items-center gap-2 text-label hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Artistas
            </Link>
          </div>

          {/* Artist Header */}
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Portrait */}
                <div className="w-full overflow-hidden rounded-2xl bg-background shadow-sm">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <img
                      src={artist.portrait}
                      alt={artist.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                  <span className="text-label block mb-4">{artist.specialty}</span>
                  <h1 className="text-display text-4xl md:text-6xl mb-6">
                    {artist.name}
                  </h1>
                  <div className="space-y-6">
                    <div className="tech-box">
                      <h3 className="text-technical text-foreground mb-3">Biografía</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {artist.bio}
                      </p>
                    </div>
                    <div className="tech-box">
                      <h3 className="text-technical text-foreground mb-3">Statement</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        "{artist.statement}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Works Grid */}
          <section className="section-padded">
            <div className="container mx-auto">
              <div className="mb-12">
                <span className="text-label block mb-4">Obras disponibles</span>
                <h2 className="text-display text-3xl md:text-5xl">Colección</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                {artist.works.map((work, index) => (
                  <div key={work.id} className="group">
                    <div className="flex h-full flex-col border border-border bg-card">
                      {/* Image */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                        <img
                          src={work.image}
                          alt={work.title}
                          className="h-full w-full object-cover"
                        />
                        {!work.available && (
                          <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
                            <span className="bg-foreground/80 px-4 py-2 text-background text-technical">
                              Vendida
                            </span>
                          </div>
                        )}
                        {/* Index */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-background/90 px-2 py-1 text-label">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between border-t border-border/80 bg-card px-6 py-5">
                        <div>
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {artist.name}
                          </p>
                          <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                            {work.title}
                          </h3>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>{work.year}</p>
                            <p>{work.medium}</p>
                            <p>{work.dimensions}</p>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                          <span className="font-display text-base font-semibold text-foreground">
                            {work.price}
                          </span>
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

export default ArtistaDetailPage;
