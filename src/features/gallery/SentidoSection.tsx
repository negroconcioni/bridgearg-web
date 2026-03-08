import { OptimizedImage } from "@/components/OptimizedImage";
import bridgeBrand from "@/assets/bridgearg-brand.jpg";

export function SentidoSection() {
  return (
    <section className="section-padded border-t border-border">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="text-label block mb-4">01 / Philosophy</span>
          <h2 className="text-display text-4xl md:text-6xl">
            Our<br />Approach
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="tech-box">
              <h3 className="text-technical text-foreground mb-4">Cultural Bridge</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                BridgeArg was born as a bridge between Argentine art and the US market.
                A brand that connects talent, culture, and opportunity—bringing the handmade,
                the authentic, and the human into a professional, legal, and sustainable context.
              </p>
            </div>

            <div className="tech-box">
              <h3 className="text-technical text-foreground mb-4">Visual Identity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                An identity inspired by connection, trust, and accompaniment: between countries,
                disciplines, and people. A restrained yet warm visual system that places art
                at the center, with BridgeArg as the silent support of the process.
              </p>
            </div>

            <div className="tech-box">
              <h3 className="text-technical text-foreground mb-4">Commitment</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A simple, trustworthy mark that aims to open doors and build bridges.
                A palette inspired by materiality and origin. Contemporary type with a human sensibility.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="art-image-container aspect-[4/5] lg:aspect-auto lg:h-full">
            <OptimizedImage
              src={bridgeBrand}
              alt="BridgeARG Brand Identity"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
