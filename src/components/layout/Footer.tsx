import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const logoSrc = encodeURI("/assets/logos/BRIDGEARG - Exportacion logos-05.svg");

export function Footer() {
  return (
    <footer className="bg-[#1e1517] text-[#fcf8ea]">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 md:px-10 md:pb-14">
        {/* Top: logo */}
        <div className="mb-12 border-b border-[#fcf8ea]/10 pb-10">
          <Link to="/">
            <img
              src={logoSrc}
              alt="BridgeArg"
              className="h-auto w-auto"
              style={{ maxWidth: "200px" }}
            />
          </Link>
        </div>

        {/* Middle: nav + contact + newsletter */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
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

          <div>
            <h4 className="mb-5 font-display text-xs font-medium uppercase tracking-[0.12em] text-[#fcf8ea]/72">
              Contact
            </h4>
            <div className="space-y-3 font-display text-sm text-[#fcf8ea]">
              <p>info@bridgearg.com</p>
              <p>Buenos Aires, Argentina</p>
              <p>New York, United States</p>
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-display text-xs font-medium uppercase tracking-[0.12em] text-[#fcf8ea]/72">
              Newsletter
            </h4>
            <p className="mb-4 font-display text-xs leading-relaxed text-[#fcf8ea]/60">
              Stay updated on new arrivals and exhibitions.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 border border-[#fcf8ea]/20 bg-transparent px-3 py-2 font-display text-xs text-[#fcf8ea] placeholder-[#fcf8ea]/30 outline-none transition-colors focus:border-[#fcf8ea]/50"
              />
              <button
                type="submit"
                className="border border-[#fcf8ea]/20 px-4 py-2 font-display text-xs uppercase tracking-[0.12em] text-[#fcf8ea] transition-colors hover:bg-[#fcf8ea]/10"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom: copyright + social */}
        <div className="mt-12 border-t border-[#fcf8ea]/12 pt-6">
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
                <span className="normal-case tracking-normal">@bridgearg_</span>
              </a>
              <a
                href="https://linkedin.com/company/bridgearg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display text-xs text-[#fcf8ea]/72 transition-colors hover:text-[#fcf8ea]"
              >
                <Linkedin size={16} strokeWidth={1.5} />
                <span className="normal-case tracking-normal">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
