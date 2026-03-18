import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { OptimizedImage } from "@/components/OptimizedImage";
import bridgeHero from "@/assets/bridgearg-hero.jpg";
import { getArtists, getWorks, getWorksTotalCount } from "@/lib/api";
import { SEO } from "@/components/SEO";

/** Wide editorial strip; swap for `getArtworkImagePublicUrl("…")` from `@/lib/supabaseStorage` when uploaded. */
const aboutWideImageSrc = "/assets/ui/new-hero-bg.jpg";

const brandPalette = [
  { hex: "#FAF9EF", label: "Cream" },
  { hex: "#201819", label: "Charcoal" },
  { hex: "#625053", label: "Mauve" },
] as const;

const logoOnDarkSrc = "/assets/logos/logo-bridge-light.svg";
const logoOnLightSrc =
  "/assets/logos/BRIDGEARG%20-%20Exportacion%20logos-08.svg";

const teamMembers = [
  {
    name: "Sofía Martínez",
    role: "Founder & Creative Director",
    bio: "Sofía leads BridgeArg’s curatorial vision and artist relationships, with a background in contemporary Latin American art and international fair programming.",
    imageSrc: bridgeHero,
  },
  {
    name: "James Chen",
    role: "Head of Operations",
    bio: "James oversees logistics, compliance, and collector experience—ensuring every acquisition from studio to doorstep is seamless and transparent.",
    imageSrc: bridgeHero,
  },
  {
    name: "Valentina Ríos",
    role: "Artist Liaison",
    bio: "Valentina works directly with the roster on production timelines, documentation, and storytelling—bridging studio practice with global presentation.",
    imageSrc: bridgeHero,
  },
];

const valuesItems: { title: string; description: string }[] = [
  {
    title: "Authenticity in every work",
    description:
      "We show each piece as the artist made it—honest images, clear provenance, and no gap between what you see and what arrives.",
  },
  {
    title: "Transparency in transactions",
    description:
      "Pricing, fees, and timelines are spelled out so collectors and artists always know where things stand.",
  },
  {
    title: "Full support for artists",
    description:
      "From contracts to shipping, we handle the operational weight so artists can stay focused on the studio.",
  },
  {
    title: "Genuine cultural connection",
    description:
      "We treat the bridge between Argentina and the world as a relationship, not a pipeline—context, care, and respect on both sides.",
  },
];

const testimonials = [
  {
    quote:
      "BridgeArg didn’t just sell my work—they walked the whole path with me: contracts I could understand, images that felt true, and collectors who actually cared about the story behind the canvas. For the first time I felt my practice was taken seriously outside Argentina.",
    attribution: "Mariana V. · Artist, Buenos Aires",
  },
  {
    quote:
      "I buy from galleries all over, but here the follow-through was different—clear timelines, honest condition reports, and someone on the line in New York who knew the piece cold. It felt less like a transaction and more like joining a conversation.",
    attribution: "David K. · Collector, United States",
  },
];

const NosotrosPage = () => {
  const { data: works = [], isLoading: loadingWorks } = useQuery({
    queryKey: ["works"],
    queryFn: getWorks,
  });
  const { data: worksTotalCount = null, isLoading: loadingWorksCount } = useQuery({
    queryKey: ["worksTotalCount"],
    queryFn: getWorksTotalCount,
  });
  const { data: artists = [], isLoading: loadingArtists } = useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  const FALLBACK_WORKS_DISPLAY = 15;

  const worksStatValue = (() => {
    if (worksTotalCount != null && worksTotalCount > 0) {
      return String(worksTotalCount);
    }
    if (works.length > 0) {
      return String(works.length);
    }
    if (loadingWorksCount || loadingWorks) {
      return "—";
    }
    return String(FALLBACK_WORKS_DISPLAY);
  })();

  const countsLoading = loadingArtists;
  const artistCount = artists.length;

  const impactStats = [
    {
      value: worksStatValue,
      label: "Works",
    },
    {
      value: countsLoading ? "—" : artistCount > 0 ? String(artistCount) : "0",
      label: "Artists",
    },
    { value: "2026", label: "Since" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEO
          title="About"
          description="Learn about BridgeArg, the gallery connecting Argentine contemporary art with global collectors."
          url="/nosotros"
        />
        <Header />
        <main>
          {/* Page Header */}
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label mb-4 block">About us</span>
              <h1 className="text-display text-4xl md:text-6xl lg:text-8xl">
                About
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                BridgeArg connects contemporary Argentine artists with international collectors—
                with clarity, care, and a bridge between Buenos Aires and New York.
              </p>
            </div>
          </section>

          <section className="border-y border-border py-10">
            <div className="container mx-auto px-6 md:px-10">
              <div className="grid grid-cols-3 gap-8 md:grid-cols-3">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-4xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="section-padded">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Image */}
                <div className="tech-box p-0 overflow-hidden">
                  <div className="aspect-[4/5]">
                    <OptimizedImage
                      src={bridgeHero}
                      alt="BridgeARG"
                      className="h-full w-full"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-8">
                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Our Mission</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      BridgeArg curates and connects contemporary Argentine art with serious
                      collectors worldwide—shepherding discovery, acquisition, and logistics so each
                      work arrives with context and confidence. We stand with artists who deserve
                      visibility beyond the local circuit, and with international collectors who want
                      access grounded in trust rather than spectacle. What distinguishes us is a
                      deliberate framework that is legal, sustainable, and human at every step:
                      contracts, shipping, and relationships that treat both the object and the
                      people behind it with dignity. Our rhythm moves between Buenos Aires and New
                      York—where the work is born, and where many of the connections that sustain it
                      take root.
                    </p>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Identity</h2>
                    <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,17rem)] lg:gap-12">
                      <div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Our visual language stays restrained and warm: generous space, understated
                          type, and a palette that reads like paper and studio light—always in
                          service of the work, never competing with it. The name carries the bridge
                          as metaphor: structure that connects two shores, the same way we link
                          Argentine practice with international collectors who may never share a
                          zip code. In contracts and logistics we are precise and professional; in
                          how we write and speak we remain unmistakably human—clear, patient, and
                          close to the story behind each piece.
                        </p>
                      </div>
                      <div className="space-y-8 border-border lg:border-l lg:pl-10 pt-2 lg:pt-0">
                        <div>
                          <p className="text-label mb-4">Palette</p>
                          <div className="flex flex-wrap gap-6">
                            {brandPalette.map(({ hex, label }) => (
                              <div key={hex} className="flex flex-col items-center gap-2">
                                <span
                                  className="h-10 w-10 shrink-0 rounded-full border border-border shadow-sm"
                                  style={{ backgroundColor: hex }}
                                  aria-hidden
                                />
                                <span className="text-center text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                  {label}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground/80">
                                  {hex}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-label mb-4">WORDMARK</p>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                            <div className="flex min-h-[5.5rem] flex-1 items-center justify-center rounded-lg border border-[#fcf8ea]/15 bg-[#1e1517] px-4 py-6">
                              <img
                                src={logoOnDarkSrc}
                                alt="BridgeArg wordmark — light on dark"
                                className="h-8 w-auto max-w-[160px] object-contain object-center opacity-95"
                              />
                            </div>
                            <div className="flex min-h-[5.5rem] flex-1 items-center justify-center rounded-lg border border-[#fcf8ea]/15 bg-[#1e1517] px-4 py-6">
                              <img
                                src={logoOnLightSrc}
                                alt="BridgeArg wordmark — as on footer (light on dark)"
                                className="h-8 w-auto max-w-[160px] object-contain object-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
                    <OptimizedImage
                      src={aboutWideImageSrc}
                      alt="BridgeArg — studio and context"
                      className="h-full w-full"
                      imageClassName="h-full w-full object-cover"
                      logSrcOnError
                    />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                    Between Buenos Aires studios and international presentation
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
                    <div className="hidden lg:block" aria-hidden />
                    <div className="space-y-8">
                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Values</h2>
                    <ul className="space-y-4">
                      {valuesItems.map(({ title, description }) => (
                        <li key={title} className="flex gap-3">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-label mb-6 block">VOICES</span>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {testimonials.map((t) => (
                        <div
                          key={t.attribution}
                          className="border border-border bg-card/30 p-6 md:p-8"
                        >
                          <p
                            className="font-serif text-4xl leading-none text-muted-foreground/30"
                            aria-hidden
                          >
                            &ldquo;
                          </p>
                          <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
                            {t.quote}
                          </p>
                          <p className="mt-6 font-display text-xs uppercase tracking-widest text-foreground">
                            {t.attribution}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tech-box">
                    <h2 className="text-technical text-foreground mb-4">Locations</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-border p-6">
                        <h3 className="font-display text-sm uppercase tracking-widest text-foreground">
                          Buenos Aires
                        </h3>
                        <p className="text-xs text-muted-foreground">Argentina</p>
                        <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                          <p>Artist relations, curation, and production.</p>
                          <p>
                            Our home base for studio visits, new work, and everything that happens
                            before a piece is ready to travel.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border p-6">
                        <h3 className="font-display text-sm uppercase tracking-widest text-foreground">
                          New York
                        </h3>
                        <p className="text-xs text-muted-foreground">United States</p>
                        <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                          <p>Collector outreach, sales, and international partnerships.</p>
                          <p>
                            Where we nurture collector relationships and align with partners abroad—
                            the counterweight to our presence in the studio.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team */}
          <section className="section-padded border-t border-border">
            <div className="container mx-auto">
              <span className="text-label mb-8 block">THE TEAM</span>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-10">
                {teamMembers.map((member) => (
                  <article
                    key={member.name}
                    className="overflow-hidden border border-border bg-card"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <OptimizedImage
                        src={member.imageSrc}
                        alt={member.name}
                        className="h-full w-full"
                        imageClassName="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-base font-medium text-foreground">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                        {member.role}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {member.bio}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#fcf8ea] py-24">
            <div className="container mx-auto px-6 text-center md:px-10">
              <h2 className="font-display text-3xl text-[#1e1517] md:text-4xl">
                Ready to connect?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
                Explore the collection or get in touch with our team.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/artworks"
                  className="inline-flex items-center justify-center border border-[#1e1517] bg-[#1e1517] px-8 py-3 font-display text-xs font-medium uppercase tracking-[0.18em] text-[#fcf8ea] transition-colors hover:bg-[#1e1517]/90"
                >
                  Explore Collection
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex items-center justify-center border border-[#1e1517] bg-transparent px-8 py-3 font-display text-xs font-medium uppercase tracking-[0.18em] text-[#1e1517] transition-colors hover:bg-[#1e1517]/5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default NosotrosPage;
