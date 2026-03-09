import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { OptimizedImage } from "@/components/OptimizedImage";
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
              <span className="text-label block mb-4">About us</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                About
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
                    <OptimizedImage
                      src={bridgeHero}
                      alt="BridgeARG"
                      className="h-full w-full"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-8">
                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Our Mission</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      BridgeArg was born as a bridge between Argentine art and the US market.
                      A brand that connects talent, culture, and opportunity—bringing the handmade,
                      the authentic, and the human into a professional, legal, and sustainable context.
                    </p>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Identity</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      An identity inspired by connection, trust, and accompaniment: between countries,
                      disciplines, and people. A restrained yet warm visual system that places art
                      at the center, with BridgeArg as the silent support of the process.
                    </p>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Values</h2>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Authenticity in every work
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Transparency in transactions
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Full support for artists
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-foreground rounded-full" />
                        Genuine cultural connection
                      </li>
                    </ul>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Locations</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-label mb-1">Buenos Aires</p>
                        <p className="text-muted-foreground text-xs">Argentina</p>
                      </div>
                      <div>
                        <p className="text-label mb-1">New York</p>
                        <p className="text-muted-foreground text-xs">United States</p>
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
