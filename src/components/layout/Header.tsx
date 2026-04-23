import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Artists", path: "/artists" },
  { label: "Collection", path: "/artworks" },
  { label: "About", path: "/nosotros" },
  { label: "Contact", path: "/contacto" },
];

const logoLightSrc = "/assets/logos/BRIDGEARG - Exportacion logos-02.svg";
const desktopLogoWidth = "clamp(140px, 32vw, 260px)";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10"
        style={{
          backgroundColor: isHome
            ? scrolled
              ? "rgba(30,21,23,0.25)"
              : "transparent"
            : "rgba(30,21,23,0.55)",
          backdropFilter: isHome ? (scrolled ? "blur(20px)" : "none") : "blur(16px)",
          WebkitBackdropFilter: isHome ? (scrolled ? "blur(20px)" : "none") : "blur(16px)",
          transition: "background-color 0.4s ease, backdrop-filter 0.4s ease",
          borderBottomColor: isHome && !scrolled ? "transparent" : "rgba(255,255,255,0.08)",
          height: "var(--header-h)",
        }}
      >
        <div className="flex h-full items-center px-4">
          <Link to="/" className="flex shrink-0 items-center" aria-label="BridgeArg home">
            <img
              src={logoLightSrc}
              alt="BridgeArg"
              className="block h-auto"
              style={{
                width: desktopLogoWidth,
                opacity: isHome ? (scrolled ? 1 : 0) : 1,
                transition: "opacity 0.4s ease",
              }}
            />
          </Link>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="ml-auto flex h-10 w-10 items-center justify-center"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-4 w-6">
              <span
                className="absolute left-0 top-0 h-[2px] w-full bg-[#fcf8ea]"
                style={{
                  transform: isOpen ? "translateY(7px) rotate(45deg)" : "none",
                  transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              <span
                className="absolute left-0 top-[7px] h-[2px] w-full bg-[#fcf8ea]"
                style={{
                  opacity: isOpen ? 0 : 1,
                  transition: "opacity 0.2s ease",
                }}
              />
              <span
                className="absolute left-0 top-[14px] h-[2px] w-full bg-[#fcf8ea]"
                style={{
                  transform: isOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                  transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-[55]"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      <aside
        className="fixed right-0 top-0 z-[60] h-[100svh] w-full max-w-[420px]"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "rgba(30,21,23,0.45)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="flex items-center justify-between px-5"
          style={{ height: "var(--header-h)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Link to="/" className="flex items-center">
            <img src={logoLightSrc} alt="BridgeArg" className="block h-auto" style={{ width: "min(180px, 50vw)" }} />
          </Link>
          <button onClick={() => setIsOpen(false)} className="relative h-8 w-8" aria-label="Close menu">
            <span
              className="absolute left-1/2 top-1/2 h-[2px] w-6 bg-[#fcf8ea]"
              style={{ transform: "translate(-50%, -50%) rotate(45deg)" }}
            />
            <span
              className="absolute left-1/2 top-1/2 h-[2px] w-6 bg-[#fcf8ea]"
              style={{ transform: "translate(-50%, -50%) rotate(-45deg)" }}
            />
          </button>
        </div>

        <nav className="px-8 pt-10">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="relative mb-6 block font-display text-lg uppercase tracking-[0.12em]"
                style={{
                  color: isActive ? "#fcf8ea" : "rgba(252,248,234,0.45)",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateX(0)" : "translateX(16px)",
                  transition: `opacity 0.35s ease ${index * 65}ms, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${index * 65}ms`,
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                    style={{ right: "-18px", backgroundColor: "#7FB2D1" }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/contacto"
            onClick={() => setIsOpen(false)}
            style={{
              fontFamily: '"Onest", sans-serif',
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              transform: "rotate(-7deg)",
              display: "inline-block",
              color: "#7FB2D1",
              textDecoration: "none",
              borderBottom: "1px solid #7FB2D1",
              paddingBottom: "2px",
              marginTop: "2rem",
            }}
          >
            I'm an Artist
          </Link>
        </nav>
      </aside>
    </>
  );
}
