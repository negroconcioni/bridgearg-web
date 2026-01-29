import bridgeBrand from "@/assets/bridgearg-brand.jpg";

export function SentidoSection() {
  return (
    <section className="section-padded border-t border-border">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="text-label block mb-4">01 / Filosofía</span>
          <h2 className="text-display text-4xl md:text-6xl">
            Nuestro<br />Sentido
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="tech-box">
              <h3 className="text-technical text-foreground mb-4">Puente Cultural</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                BridgeArg nace como un puente entre el arte argentino y el mercado 
                estadounidense. Una marca que conecta talento, cultura y oportunidades, 
                acercando lo hecho a mano, lo auténtico y lo humano a un entorno 
                profesional, legal y sustentable.
              </p>
            </div>

            <div className="tech-box">
              <h3 className="text-technical text-foreground mb-4">Identidad Visual</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Una identidad inspirada en la idea de unión, confianza y acompañamiento: 
                entre países, disciplinas y personas. Un sistema visual sobrio y cálido 
                que pone al arte en el centro, y a BridgeArg como sostén silencioso del proceso.
              </p>
            </div>

            <div className="tech-box">
              <h3 className="text-technical text-foreground mb-4">Compromiso</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Un logotipo simple y confiable, que busca abrir puertas y tender puentes. 
                Una cromática inspirada en la materialidad y el origen. Tipografías 
                contemporáneas con sensibilidad humana.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="art-image-container aspect-[4/5] lg:aspect-auto lg:h-full">
            <img
              src={bridgeBrand}
              alt="BridgeARG Brand Identity"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
