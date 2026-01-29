import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Artistas", path: "/artistas" },
  { label: "Obras", path: "/obras" },
  { label: "Nosotros", path: "/nosotros" },
  { label: "Contacto", path: "/contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-baseline gap-1 md:gap-1">
              <span className="text-display text-3xl md:text-3xl">bridge</span>
              <span className="text-display text-3xl md:text-3xl text-muted-foreground">arg</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-technical hover-underline py-1 ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* SOY ARTISTA Button */}
              <Button 
                variant="technical"
                className="ml-4"
                asChild
              >
                <Link to="/contacto">SOY ARTISTA</Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 hover:bg-muted transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="mobile-drawer open">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <Link to="/" className="flex items-baseline gap-1" onClick={() => setIsOpen(false)}>
                <span className="text-display text-2xl">bridge</span>
                <span className="text-display text-2xl text-muted-foreground">arg</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-6 space-y-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-technical text-base py-2 animate-fade-up animate-stagger-${index + 1} ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* SOY ARTISTA Button for Mobile */}
              <Button 
                variant="technical"
                className="mt-4 w-full"
                asChild
              >
                <Link to="/contacto" onClick={() => setIsOpen(false)}>SOY ARTISTA</Link>
              </Button>
            </nav>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}
