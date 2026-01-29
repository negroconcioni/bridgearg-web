import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-baseline gap-1 mb-4">
              <span className="text-display text-3xl">bridge</span>
              <span className="text-display text-3xl text-muted-foreground">arg</span>
            </Link>
            <p className="text-label max-w-xs leading-relaxed">
              Conectando el arte argentino con el mercado internacional. 
              Una plataforma para artistas, coleccionistas y amantes del arte.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-technical text-foreground mb-4">Navegación</h4>
            <nav className="space-y-2">
              <Link to="/artistas" className="block text-label hover:text-foreground transition-colors">
                Artistas
              </Link>
              <Link to="/obras" className="block text-label hover:text-foreground transition-colors">
                Obras
              </Link>
              <Link to="/nosotros" className="block text-label hover:text-foreground transition-colors">
                Nosotros
              </Link>
              <Link to="/contacto" className="block text-label hover:text-foreground transition-colors">
                Contacto
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-technical text-foreground mb-4">Contacto</h4>
            <div className="space-y-2">
              <p className="text-label">info@bridgearg.com</p>
              <p className="text-label">Buenos Aires, Argentina</p>
              <p className="text-label">New York, Estados Unidos</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-label">
            © {new Date().getFullYear()} BridgeARG. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-label hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="text-label hover:text-foreground transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
