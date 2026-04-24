import { Eye } from "lucide-react";
import { images } from "@/lib/images";

const bridgeDividerSrc = encodeURI("/assets/BRIDGEARG - Exportacion logos - PNG-21.png");

const serviceCards = [
  {
    title: "Provenance & Authenticity",
    imageSrc: images.mockup,
    imageAlt: "Certificate of authenticity package",
    imageClassName: "aspect-square",
    imageFitClassName: "object-contain p-6 md:p-8",
    description:
      "Every physical masterpiece is accompanied by a Certificate of Authenticity hand-signed by the artist. We guarantee the provenance and unique identity of each work in our vault.",
  },
  {
    title: "Specialized Art Handling",
    imageSrc: images.freePackageBoxMockup,
    imageAlt: "Museum-grade art shipping tube",
    imageClassName: "aspect-square",
    imageFitClassName: "object-contain p-6 md:p-8",
    description:
      "Global white-glove shipping. Our logistics partners specialize in fine art, ensuring your acquisition travels in museum-grade packaging and climate-controlled environments.",
  },
  {
    title: "Private Consultation",
    description:
      "Direct access to our curators. We provide personalized advice on framing, lighting, and placement to ensure the artwork integrates perfectly into your private space.",
  },
];

export function BatchStatusSection() {
  return (
    <section className="bg-[#fcf8ea] px-6 py-24 md:px-12 md:py-32 lg:px-24 2xl:py-36">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-14 max-w-2xl md:mb-20">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.12em] text-[#1e1517]/65 md:text-xs 2xl:text-sm">
            Collector Services
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#1e1517] sm:text-4xl md:text-5xl">
            Confidence beyond the acquisition
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10 xl:gap-16 2xl:gap-20">
          {serviceCards.map((card) => (
            <article key={card.title} className="flex flex-col">
              {"imageSrc" in card ? (
                <div className={`overflow-hidden rounded-[22px] bg-[#f3ecdd] ${card.imageClassName}`}>
                  <img
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    className={`h-full w-full ${card.imageFitClassName}`}
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-[22px] bg-[#f3ecdd] text-[#1e1517]">
                  <Eye strokeWidth={1} className="h-16 w-16 md:h-20 md:w-20" aria-hidden="true" />
                </div>
              )}

              <div className="pt-7">
                <img
                  src={bridgeDividerSrc}
                  alt=""
                  className="h-3 w-auto object-contain opacity-60"
                />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[#1e1517] md:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-[34ch] font-display text-base leading-7 text-[#1e1517]/78 2xl:text-lg 2xl:leading-8">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
