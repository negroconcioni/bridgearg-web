import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Artists", path: "/artists" },
  { label: "Collection", path: "/artworks" },
  { label: "About", path: "/nosotros" },
  { label: "Contact", path: "/contacto" },
];

const logoSrc = encodeURI("/assets/logos/BRIDGEARG - Exportacion logos-05.svg");
const cream = "#fcf8ea";
const headerBg = "#1e1517";
const desktopLogoWidth = "260px"; // TAMAÑO LOGO
const mobileLogoWidth = "200px"; // TAMAÑO LOGO

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavClassName = (path: string) =>
    `font-display text-xs font-medium uppercase tracking-[0.1em] transition-colors relative ${
      location.pathname === path
        ? "text-[#fcf8ea] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-[#fcf8ea]"
        : "text-[#fcf8ea]/60 hover:text-[#fcf8ea]"
    }`;

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 transition-colors duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(250, 249, 239, 0.85)" : headerBg,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          height: "80px",
        }}
      >
        <div
          className="flex h-full items-center pl-4 pr-4"
          style={{ justifyContent: "flex-start" }}
        >
          <Link to="/" className="mr-0 flex shrink-0 items-center" aria-label="BridgeArg home">
            <div className="logo-container flex items-center">
              <img
                src={logoSrc}
                alt="BridgeArg wordmark"
                className="block h-auto"
                style={{ width: desktopLogoWidth }}
              />
            </div>
          </Link>

          <div className="ml-auto hidden min-w-0 items-center gap-5 lg:flex lg:gap-7">
            <nav className="flex items-center gap-5 lg:gap-7">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={getNavClassName(item.path)}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="ml-auto p-2 transition-colors hover:bg-white/5 lg:hidden"
            style={{ color: cream }}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {isOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)} />
          <div className="mobile-drawer open">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <Link to="/" className="mr-0 flex items-center" onClick={() => setIsOpen(false)}>
                <div className="logo-container flex items-center">
                  <img
                    src={logoSrc}
                    alt="BridgeArg wordmark"
                    className="block h-auto"
                    style={{ width: mobileLogoWidth }}
                  />
                </div>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 transition-colors hover:bg-white/5"
                style={{ color: cream }}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="space-y-6 p-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 font-display text-base font-medium uppercase tracking-[0.1em] animate-fade-up animate-stagger-${index + 1} ${
                    location.pathname === item.path ? "text-[#fcf8ea] opacity-100" : "text-[#fcf8ea] opacity-80 hover:opacity-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      <div className="h-[80px]" />
    </>
  );
}
