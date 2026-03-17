import { motion } from "framer-motion";

const assetSrc = "/assets/BRIDGEARG%20-%20Exportacion%20logos%20-%20PNG-16.png";
const image1Src = "/assets/ui/PICELES_Y_MAS.jpg";
const image2Src = "/assets/ui/boxes.jpg";

export function BrandStorySection() {
  return (
    <section className="bg-[#fcf8ea] px-6 py-24 md:px-12 md:py-32 lg:px-24">
      <div className="mx-auto max-w-[1800px] space-y-32">

        {/* Block 1 — image left, text right */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* Image with thin border lines */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Top-left corner lines */}
            <div className="absolute -left-4 -top-4 h-px w-12 bg-[#1e1517]/15" />
            <div className="absolute -left-4 -top-4 h-12 w-px bg-[#1e1517]/15" />
            {/* Bottom-right corner lines */}
            <div className="absolute -bottom-4 -right-4 h-px w-12 bg-[#1e1517]/15" />
            <div className="absolute -bottom-4 -right-4 h-12 w-px bg-[#1e1517]/15" />
            <img
              src={image1Src}
              alt="BridgeArg studio"
              className="h-full w-full object-cover"
              style={{ maxHeight: "520px" }}
            />
          </motion.div>

          {/* Text right */}
          <motion.div
            className="flex flex-col gap-6"
            style={{ paddingLeft: "clamp(0px, 5vw, 80px)" }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <img
              src={assetSrc}
              alt=""
              className="h-8 w-auto object-contain object-left"
              style={{ maxWidth: "40px" }}
            />
            <div style={{ paddingLeft: "56px" }} className="flex flex-col gap-4">
              <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Texto texto texto texto texto texto texto texto texto texto texto.
              </p>
              <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Texto texto texto texto texto texto texto texto texto texto texto.
              </p>
              <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Texto texto texto texto texto texto texto texto texto texto texto.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Block 2 — text left, image right */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* Text left */}
          <motion.div
            className="flex flex-col gap-6 md:order-1"
            style={{ paddingLeft: "clamp(0px, 5vw, 80px)" }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <img
              src={assetSrc}
              alt=""
              className="h-8 w-auto object-contain object-left"
              style={{ maxWidth: "40px" }}
            />
            <div style={{ paddingLeft: "56px" }} className="flex flex-col gap-4">
              <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Texto texto texto texto texto texto texto texto texto texto texto.
              </p>
              <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Texto texto texto texto texto texto texto texto texto texto texto.
              </p>
              <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Texto texto texto texto texto texto texto texto texto texto texto.
              </p>
            </div>
          </motion.div>

          {/* Image right */}
          <motion.div
            className="relative md:order-2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Top-left corner lines */}
            <div className="absolute -left-4 -top-4 h-px w-12 bg-[#1e1517]/15" />
            <div className="absolute -left-4 -top-4 h-12 w-px bg-[#1e1517]/15" />
            {/* Bottom-right corner lines */}
            <div className="absolute -bottom-4 -right-4 h-px w-12 bg-[#1e1517]/15" />
            <div className="absolute -bottom-4 -right-4 h-12 w-px bg-[#1e1517]/15" />
            <img
              src={image2Src}
              alt="BridgeArg packaging"
              className="h-full w-full object-cover"
              style={{ maxHeight: "520px" }}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}

