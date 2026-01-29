import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import bridgeHero from "@/assets/bridgearg-hero.jpg";

const NosotrosPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Page Header */}
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label block mb-4">Sobre nosotros</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Nosotros
              </h1>
            </div>
          </section>

          {/* Content */}
          <section className="section-padded">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Image */}
                <div className="tech-box p-0 overflow-hidden">
                  <div className="aspect-[4/5]">
                    <img
                      src={bridgeHero}
                      alt="BridgeARG"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-8">
                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Nuestra Misión</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      BridgeArg nace como un puente entre el arte argentino y el mercado 
                      estadounidense. Una marca que conecta talento, cultura y oportunidades, 
                      acercando lo hecho a mano, lo auténtico y lo humano a un entorno 
                      profesional, legal y sustentable.
                    </p>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Identidad</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Una identidad inspirada en la idea de unión, confianza y acompañamiento: 
                      entre países, disciplinas y personas. Un sistema visual sobrio y cálido 
                      que pone al arte en el centro, y a BridgeArg como sostén silencioso del proceso.
                    </p>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Valores</h2>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Autenticidad en cada obra
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Transparencia en las transacciones
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Apoyo integral a los artistas
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Conexión cultural genuina
                      </li>
                    </ul>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Ubicaciones</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-label mb-1">Buenos Aires</p>
                        <p className="text-muted-foreground text-xs">Argentina</p>
                      </div>
                      <div>
                        <p className="text-label mb-1">New York</p>
                        <p className="text-muted-foreground text-xs">Estados Unidos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default NosotrosPage;
