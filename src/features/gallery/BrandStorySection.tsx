import { motion } from "framer-motion";
import { images } from "@/lib/images";

const assetSrc = "/assets/BRIDGEARG%20-%20Exportacion%20logos%20-%20PNG-16.png";
const image1Src = images.theProcess;
const image2Src = images.boxes;

export function BrandStorySection() {
  const attrs = ["Culture", "Quality", "Transparency", "Warmth", "Transcendence", "Closeness"];

  return (
    <>
      <section className="bg-[#7FB2D1] px-6 py-24 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto grid max-w-[1800px] grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "24px" }}>
              <img
                src="/assets/logos/BRIDGEARG - Exportacion logos-09.svg"
                alt="BridgeArg"
                style={{ width: "clamp(80px, 11vw, 160px)", height: "clamp(80px, 11vw, 160px)", flexShrink: 0, opacity: 0.9 }}
              />
              <h2
                className="font-display text-[#FAF6E9] leading-[1.1] tracking-[-0.02em]"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#fcf8ea" }}
              >
                We are a bridge.
                <br />
                We are a{" "}
                <span
                  style={{
                    fontFamily: '"BestDB", "Caveat", cursive',
                    fontWeight: 400,
                    fontSize: "1.12em",
                    display: "inline",
                    color: "#1e1517",
                  }}
                >
                  network.
                </span>
              </h2>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <p className="font-display text-base leading-relaxed text-[#fcf8ea]/80 md:text-lg">
              We exist because we deeply believe in Argentine talent — that mix of creativity, craft, design, and
              that certain something the world recognizes even if it can't name it.
            </p>
            <p className="mt-4 font-display text-base leading-relaxed text-[#fcf8ea]/80 md:text-lg">
              BridgeArg provides a professional and legal framework to work with clients in the United States,
              handling foreign trade, documentation, shipping, and everything needed for each piece to travel safely.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {attrs.map((attr) => (
                <span
                  key={attr}
                  className="font-display text-[11px] uppercase tracking-[1.5px] text-[#1e1517] border px-3.5 py-1.5"
                  style={{ borderColor: "rgba(30,21,23,0.3)" }}
                >
                  {attr}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-background px-6 py-24 md:px-12 md:py-32 lg:px-24">
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
              <img src={image1Src} alt="" style={{ width: "100%", height: "clamp(280px, 40vw, 520px)", objectFit: "cover", borderRadius: "6px" }} />
            </motion.div>

            {/* Text right */}
            <motion.div
              className="flex flex-col gap- "
              style={{ paddingLeft: "clamp(0px, 5vw, 20px)", 
                paddingRight: "clamp(0px, 5vw, 20px)", width: "100%" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            >
              <div
                className="flex flex-col gap-4"
                style={{
                  position: "relative",
                  paddingLeft: "clamp(16px, 4vw, 56px)",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
              >
                <img src={assetSrc} alt="" style={{ position: "absolute", top: "-16px", left: "-16px", width: "24px", height: "24px", transform: "rotate(0deg)" }} />
                <img src={assetSrc} alt="" style={{ position: "absolute", top: "-16px", right: "-16px", width: "24px", height: "24px", transform: "rotate(90deg)" }} />
                <img src={assetSrc} alt="" style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "24px", height: "24px", transform: "rotate(270deg)" }} />
                <img src={assetSrc} alt="" style={{ position: "absolute", bottom: "-16px", right: "-16px", width: "24px", height: "24px", transform: "rotate(180deg)" }} />
                <span style={{
                  fontFamily: '"BestDB", "Caveat", cursive',
                  fontWeight: 400,
                  fontSize: "clamp(40px, 6vw, 55px)",
                  color: "#7FB2D1",
                  display: "block",
                  letterSpacing: "-0.01em",
                  transform: "rotate(-7deg)",
                  transformOrigin: "left center",
                  marginTop: "25px",
                }}>
                  The Process
                </span>
                <h3
                  className="font-display font-semibold text-[#1e1517] tracking-tight leading-tight"
                  style={{ fontSize: "clamp(22px,2.5vw,32px)" }}
                >
                  From our shores to your home.
                </h3>
                <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                We handle the entire journey —curation, export compliance, and international logistics— 
                so you can enjoy unique Argentine art without the complexities of global shipping.
                </p>
                <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Our professional framework ensures that every piece arrives safely,
                 legally, and transparently to your door
                </p>
              </div>
            </motion.div>
          </div>

          {/* Block 2 — text left, image right */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
            {/* Text left */}
            <motion.div
              className="flex flex-col gap-6 md:order-1"
              style={{ paddingLeft: "clamp(0px, 5vw, 20px)", paddingRight: "clamp(0px, 5vw, 20px)", width: "100%" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            >
              <div
                className="flex flex-col gap-4"
                style={{
                  position: "relative",
                  paddingLeft: "clamp(16px, 4vw, 56px)",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
              >
                <img src={assetSrc} alt="" style={{ position: "absolute", top: "-16px", left: "-16px", width: "24px", height: "24px", transform: "rotate(0deg)" }} />
                <img src={assetSrc} alt="" style={{ position: "absolute", top: "-16px", right: "-16px", width: "24px", height: "24px", transform: "rotate(90deg)" }} />
                <img src={assetSrc} alt="" style={{ position: "absolute", bottom: "-16px", left: "-16px", width: "24px", height: "24px", transform: "rotate(270deg)" }} />
                <img src={assetSrc} alt="" style={{ position: "absolute", bottom: "-16px", right: "-16px", width: "24px", height: "24px", transform: "rotate(180deg)" }} />
                <span style={{
                  fontFamily: '"BestDB", "Caveat", cursive',
                  fontWeight: 400,
                  fontSize: "clamp(40px, 6vw, 55px)",
                  color: "#7FB2D1",
                  display: "block",
                  letterSpacing: "-0.01em",
                  transform: "rotate(-7deg)",
                  transformOrigin: "left center",
                  marginTop: "25px",
                }}>
                  The packaging
                </span>
                <h3
                  className="font-display font-semibold text-[#1e1517] tracking-tight leading-tight"
                  style={{ fontSize: "clamp(22px,2.5vw,32px)" }}
                >
                  Curated with care, delivered with certainty.
                </h3>
                <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Every work is more than decoration; it is a story of craft and identity. We protect that 
                story with a standardized 4-box export system and full insurance.
                </p>
                <p className="font-display text-base leading-relaxed text-[#1e1517]/80 md:text-lg">
                Each shipment includes a Certificate of Authenticity hand-signed by the artist, 
                reinforcing the legacy and value of your new acquisition.
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
              <img src={image2Src} alt="" style={{ width: "100%", height: "clamp(280px, 40vw, 520px)", objectFit: "cover", borderRadius: "6px" }} />
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}

