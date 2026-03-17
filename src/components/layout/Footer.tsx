import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const bridgeDividerSrc = encodeURI("/assets/BRIDGEARG - Exportacion logos - PNG-21.png");

export function Footer() {
  return (
    <footer className="bg-[#1e1517] text-[#fcf8ea]">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-6 md:px-10 md:pb-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h4 className="mb-5 font-display text-xs font-medium uppercase tracking-[0.12em] text-[#fcf8ea]/72">
              Navigation
            </h4>
            <nav className="space-y-3">
              <Link
                to="/artistas"
                className="block w-fit font-display text-sm text-[#fcf8ea] decoration-[#fcf8ea]/70 underline-offset-4 transition-all hover:underline"
              >
                Artists
              </Link>
              <Link
                to="/artworks"
                className="block w-fit font-display text-sm text-[#fcf8ea] decoration-[#fcf8ea]/70 underline-offset-4 transition-all hover:underline"
              >
                Works
              </Link>
              <Link
                to="/nosotros"
                className="block w-fit font-display text-sm text-[#fcf8ea] decoration-[#fcf8ea]/70 underline-offset-4 transition-all hover:underline"
              >
                About
              </Link>
              <Link
                to="/contacto"
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
              <p>Córdoba, Argentina</p>
              <p>Plantation, Florida, United States</p>
            </div>
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
                  href="#"
                  className="inline-flex items-center gap-2 font-display text-xs text-[#fcf8ea]/72 transition-colors hover:text-[#fcf8ea]"
                >
                  <Instagram size={16} strokeWidth={1.5} />
                  <span className="font-display normal-case tracking-normal text-[#fcf8ea]/80">@bridgearg_</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
