import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const bridgeDividerSrc = encodeURI("/assets/BRIDGEARG - Exportacion logos - PNG-21.png");
const logoSrc = encodeURI("/assets/logos/BRIDGEARG - Exportacion logos-05.svg");

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1e1517] text-[#fcf8ea]">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 md:px-10 md:pb-14">
        {/* Logo */}
        <div className="mb-10 border-b border-[#fcf8ea]/10 pb-10">
          <Link to="/" aria-label="BridgeArg home">
            <img
              src={logoSrc}
              alt="BridgeArg"
              className="block h-auto"
              style={{ width: "200px" }}
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {/* Navigation */}
          <div>
            <h4 className="mb-5 font-display text-xs font-medium uppercase tracking-[0.12em] text-[#fcf8ea]/72">
              Navigation
            </h4>
            <nav className="space-y-3">
              <Link
                to="/artists"
                className="block w-fit font-display text-sm text-[#fcf8ea] decoration-[#fcf8ea]/70 underline-offset-4 transition-all hover:underline"
              >
                Artists
              </Link>
              <Link
                to="/artworks"
                className="block w-fit font-display text-sm text-[#fcf8ea] decoration-[#fcf8ea]/70 underline-offset-4 transition-all hover:underline"
              >
                Collection
              </Link>
              <Link
                to="/about"
                className="block w-fit font-display text-sm text-[#fcf8ea] decoration-[#fcf8ea]/70 underline-offset-4 transition-all hover:underline"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block w-fit font-display text-sm text-[#fcf8ea] decoration-[#fcf8ea]/70 underline-offset-4 transition-all hover:underline"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 font-display text-xs font-medium uppercase tracking-[0.12em] text-[#fcf8ea]/72">
              Contact
            </h4>
            <div className="space-y-3 font-display text-sm text-[#fcf8ea]">
              <p>
                <a href="mailto:info@bridgearg.com" className="hover:underline underline-offset-4">
                  info@bridgearg.com
                </a>
              </p>
              <p>Buenos Aires, Argentina</p>
              <p>New York, United States</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-5 font-display text-xs font-medium uppercase tracking-[0.12em] text-[#fcf8ea]/72">
              Newsletter
            </h4>
            {subscribed ? (
              <p className="font-display text-sm text-[#fcf8ea]/80">
                Thank you for subscribing.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-9 flex-1 min-w-0 border border-[#fcf8ea]/20 bg-transparent px-3 font-display text-xs text-[#fcf8ea] placeholder-[#fcf8ea]/40 outline-none focus:border-[#fcf8ea]/50"
                />
                <button
                  type="submit"
                  className="h-9 shrink-0 border border-l-0 border-[#fcf8ea]/20 px-4 font-display text-xs uppercase tracking-[0.12em] text-[#fcf8ea]/80 transition-colors hover:bg-[#fcf8ea]/10 hover:text-[#fcf8ea]"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-14">
          <img
            src={bridgeDividerSrc}
            alt=""
            className="mx-auto block h-3 w-auto object-contain opacity-60"
          />
          <div className="mt-5 border-t border-[#fcf8ea]/12 pt-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="font-display text-xs uppercase tracking-[0.1em] text-[#fcf8ea]/72">
                © 2026 BridgeArg
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://instagram.com/bridgearg_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display text-xs text-[#fcf8ea]/72 transition-colors hover:text-[#fcf8ea]"
                >
                  <Instagram size={16} strokeWidth={1.5} />
                  <span className="font-display normal-case tracking-normal text-[#fcf8ea]/80">@bridgearg_</span>
                </a>
                <a
                  href="https://linkedin.com/company/bridgearg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display text-xs text-[#fcf8ea]/72 transition-colors hover:text-[#fcf8ea]"
                >
                  <Linkedin size={16} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
