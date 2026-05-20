import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { SEO } from "@/components/SEO";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

type LegalSectionId = "terms" | "privacy";

const NAV_ITEMS: Array<{ id: LegalSectionId; label: string }> = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
];

const LegalPage = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<LegalSectionId>("terms");

  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id as LegalSectionId);
        }
      },
      {
        threshold: [0.2, 0.4, 0.7],
        rootMargin: "-130px 0px -45% 0px",
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  const scrollToSection = (id: LegalSectionId) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveSection(id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/legal#${id}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#fcf8ea]">
        <SEO
          title="Terms & Privacy"
          description="Read BridgeArg legal terms and privacy policy."
          url="/legal"
        />
        <Header />
        <main>
          <section
            style={{
              padding: isMobile
                ? "44px 20px 36px"
                : "80px clamp(24px, 7vw, 120px) 64px",
              borderBottom: "1px solid rgba(30,21,23,0.16)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(30,21,23,0.62)",
                marginBottom: "22px",
                fontFamily: '"Onest", sans-serif',
              }}
            >
              Legal
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: '"Onest", sans-serif',
                fontWeight: 700,
                fontSize: isMobile ? "52px" : "clamp(64px, 9vw, 126px)",
                letterSpacing: "-0.06em",
                lineHeight: 0.9,
                color: "#1e1517",
              }}
            >
              <span style={{ display: "block" }}>Terms &</span>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: '"BestDB", "Caveat", cursive',
                  fontWeight: 400,
                  color: "#7FB2D1",
                  transform: "rotate(-7deg)",
                  transformOrigin: "left center",
                }}
              >
                Privacy
              </span>
            </h1>
          </section>

          <nav
            style={{
              position: isMobile ? "static" : "sticky",
              top: "80px",
              zIndex: 20,
              backgroundColor: "rgba(127,178,209,0.95)",
              borderBottom: "1px solid rgba(30,21,23,0.16)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                padding: isMobile ? "14px 20px" : "16px clamp(24px, 7vw, 120px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {NAV_ITEMS.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    style={{
                      border: "1px solid rgba(252,248,234,0.6)",
                      backgroundColor: active ? "#fcf8ea" : "transparent",
                      color: active ? "#7FB2D1" : "#fcf8ea",
                      padding: "10px 14px",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontFamily: '"Onest", sans-serif',
                      cursor: "pointer",
                      transition: "0.2s ease",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <section
            id="terms"
            style={{
              padding: isMobile ? "44px 20px" : "86px clamp(24px, 7vw, 120px)",
              scrollMarginTop: "150px",
            }}
          >
            <div className="mx-auto max-w-3xl">
              <h2
                style={{
                  margin: 0,
                  fontFamily: '"Onest", sans-serif',
                  fontSize: isMobile ? "36px" : "clamp(42px, 5vw, 62px)",
                  letterSpacing: "-0.04em",
                  color: "#1e1517",
                }}
              >
                Terms & Conditions
              </h2>
              <p
                style={{
                  margin: "14px 0 36px",
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(30,21,23,0.55)",
                  fontFamily: '"Onest", sans-serif',
                }}
              >
                Last updated: [PLACEHOLDER DATE]
              </p>

              {/* TODO: replace with final legal text */}
              <p className="mb-8 font-['Onest',sans-serif] text-base leading-8 text-[rgba(30,21,23,0.78)]">
                PLACEHOLDER_TERMS_CONTENT. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Proin suscipit, neque eu volutpat aliquam, est urna vulputate risus, vitae feugiat
                lacus erat id ipsum. Donec ac tortor urna. Curabitur non sem vitae tortor vehicula
                feugiat sed quis justo. Aliquam sed ligula id sapien vulputate molestie.
              </p>

              {[
                "1. Acceptance of Terms",
                "2. Use of the Site",
                "3. Intellectual Property",
                "4. Limitation of Liability",
                "5. Governing Law",
              ].map((title) => (
                <div key={title} style={{ marginBottom: "28px" }}>
                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontFamily: '"Onest", sans-serif',
                      fontSize: "23px",
                      fontWeight: 600,
                      color: "#1e1517",
                    }}
                  >
                    {title}
                  </h3>
                  <p className="font-['Onest',sans-serif] text-base leading-8 text-[rgba(30,21,23,0.78)]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis sem nec
                    luctus pretium. Praesent semper, massa vel lacinia feugiat, velit purus suscipit
                    nulla, eu ullamcorper lorem ligula nec lacus.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(30,21,23,0.18)",
              margin: isMobile ? "0 20px" : "0 clamp(24px, 7vw, 120px)",
            }}
          />

          <section
            id="privacy"
            style={{
              padding: isMobile ? "44px 20px 70px" : "86px clamp(24px, 7vw, 120px) 100px",
              scrollMarginTop: "150px",
            }}
          >
            <div className="mx-auto max-w-3xl">
              <h2
                style={{
                  margin: 0,
                  fontFamily: '"Onest", sans-serif',
                  fontSize: isMobile ? "36px" : "clamp(42px, 5vw, 62px)",
                  letterSpacing: "-0.04em",
                  color: "#1e1517",
                }}
              >
                Privacy Policy
              </h2>
              <p
                style={{
                  margin: "14px 0 36px",
                  fontSize: "12px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(30,21,23,0.55)",
                  fontFamily: '"Onest", sans-serif',
                }}
              >
                Last updated: [PLACEHOLDER DATE]
              </p>

              {/* TODO: replace with final legal text */}
              <p className="mb-8 font-['Onest',sans-serif] text-base leading-8 text-[rgba(30,21,23,0.78)]">
                PLACEHOLDER_PRIVACY_CONTENT. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse potenti. Integer viverra lacus ut feugiat finibus. Mauris accumsan magna
                sit amet neque convallis, at tristique nulla hendrerit. Nulla facilisi.
              </p>

              {[
                "1. Information We Collect",
                "2. How We Use Your Information",
                "3. Cookies",
                "4. Third-Party Services",
                "5. Your Rights",
                "6. Contact Us",
              ].map((title) => (
                <div key={title} style={{ marginBottom: "28px" }}>
                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontFamily: '"Onest", sans-serif',
                      fontSize: "23px",
                      fontWeight: 600,
                      color: "#1e1517",
                    }}
                  >
                    {title}
                  </h3>
                  <p className="font-['Onest',sans-serif] text-base leading-8 text-[rgba(30,21,23,0.78)]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non nisi ac
                    ipsum cursus gravida. Sed vel ligula massa. Duis feugiat, sem et vulputate
                    pulvinar, ante lorem ultrices mauris, in elementum nisi nisl non urna.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              backgroundColor: "#1e1517",
              backgroundImage:
                "radial-gradient(circle at 84% 22%, rgba(127,178,209,0.16), transparent 40%), linear-gradient(135deg, #1e1517 0%, #140e10 100%)",
              color: "#fcf8ea",
              padding: isMobile ? "56px 20px" : "80px clamp(24px, 7vw, 120px)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: '"Onest", sans-serif',
                fontSize: isMobile ? "36px" : "clamp(44px, 5vw, 62px)",
                letterSpacing: "-0.05em",
                lineHeight: 1,
              }}
            >
              Questions about our policies?
            </h2>
            <Link
              to="/contacto"
              className="inline-flex items-center border border-[#fcf8ea] text-[#fcf8ea] transition-colors duration-300 hover:bg-[#fcf8ea] hover:text-[#1e1517]"
              style={{
                marginTop: "30px",
                textDecoration: "none",
                padding: "13px 22px",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: "11px",
                fontFamily: '"Onest", sans-serif',
              }}
            >
              Contact us
            </Link>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LegalPage;
