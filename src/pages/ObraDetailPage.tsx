import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag, Loader2, Package, FileCheck, Share2 } from "lucide-react";
import {
  getWork,
  getWorks,
  createCheckout,
  type WorkFromApi,
  CheckoutError,
  FALLBACK_ARTIST_NAME,
} from "@/lib/api";
import { WorkImage } from "@/components/WorkImage";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const ArtworkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const workId = id ? parseInt(id, 10) : NaN;
  const [work, setWork] = useState<WorkFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [acquiring, setAcquiring] = useState(false);

  const { data: relatedWorks = [] } = useQuery({
    queryKey: ["works", work?.artistSlug],
    queryFn: () => getWorks(work!.artistSlug),
    enabled: !!work?.artistSlug,
  });

  const otherWorks = useMemo(() => {
    return relatedWorks.filter((w) => w.id !== workId).slice(0, 4);
  }, [relatedWorks, workId]);

  useEffect(() => {
    if (Number.isNaN(workId) || workId < 1) {
      setLoading(false);
      setWork(null);
      return;
    }
    let cancelled = false;
    getWork(workId)
      .then((data) => {
        if (!cancelled) setWork(data);
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Error", description: "Could not load work.", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [workId]);

  const handleAcquire = async () => {
    if (!work || work.status !== "available") return;
    setAcquiring(true);
    try {
      const { url } = await createCheckout(work.id);
      if (url) {
        window.location.href = url;
        return;
      }
      toast({
        title: "No se pudo iniciar el pago",
        description: "No se obtuvo la URL de pago. Intentá de nuevo o contactanos.",
        variant: "destructive",
      });
    } catch (err) {
      if (err instanceof CheckoutError) {
        if (err.kind === "connection") {
          toast({
            title: "Problema de conexión",
            description: "No pudimos conectar con el servidor. Revisá tu conexión a internet e intentá de nuevo.",
            variant: "destructive",
          });
        } else if (err.kind === "stock") {
          toast({
            title: "Obra no disponible",
            description:
              "Esta obra ya no está disponible para la compra. Actualizamos la página para que veas el estado actual.",
            variant: "destructive",
          });
          window.location.reload();
        } else {
          toast({
            title: "Error al iniciar el pago",
            description: err.message,
            variant: "destructive",
          });
        }
      } else {
        const message = err instanceof Error ? err.message : "No se pudo iniciar el pago.";
        toast({
          title: "Error al iniciar el pago",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setAcquiring(false);
    }
  };

  const artistName = work?.artistName?.trim() || FALLBACK_ARTIST_NAME;

  const handleShare = async () => {
    if (!work) return;
    const url = window.location.href;
    const shareData = {
      title: work.title,
      text: `${artistName} — ${work.title}`,
      url,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "The link to this work has been copied to your clipboard.",
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "The link to this work has been copied to your clipboard.",
        });
      }
    }
  };

  const isAvailable = work?.status === "available";

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <div className="container mx-auto pt-8">
              <Skeleton className="h-4 w-24" />
            </div>
            <section className="section-padded border-b border-border">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <div className="flex flex-col justify-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-12 w-40" />
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!work) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="section-padded">
            <div className="container mx-auto text-center">
              <h1 className="text-display text-4xl mb-4">Work not found</h1>
              <Button variant="technical" asChild>
                <Link to="/artworks">Back to Works</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const dimensionsText =
    [
      work.dimensions,
      [work.width_cm, work.height_cm, work.depth_cm].filter(Boolean).length
        ? [work.width_cm, work.height_cm, work.depth_cm].filter(Boolean).join(" × ") + " cm"
        : null,
    ]
      .filter(Boolean)
      .join(" · ") || null;
  const weightText = work.weight_kg != null ? `${work.weight_kg} kg` : null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEO
          title={work.title}
          description={`${artistName} · ${[work.year, work.medium].filter(Boolean).join(" · ")} · ${work.priceDisplay}`}
          image={work.imagenUrl?.startsWith("http") ? work.imagenUrl : undefined}
          url={`/artworks/${work.id}`}
          type="article"
        />
        <Header />
        <main>
          <div className="container mx-auto pt-8">
            <Link
              to="/artworks"
              className="inline-flex items-center gap-2 text-label hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Works
            </Link>
          </div>

          {/* Hero: image + title, artist, price */}
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="w-full overflow-hidden rounded-2xl bg-background shadow-sm">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    <WorkImage
                      imagenUrl={work.imagenUrl}
                      title={work.title}
                      artistName={artistName}
                      className="h-full w-full rounded-2xl"
                    />
                    {work.status === "sold" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-2xl">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1517]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#1e1517]/60">
                          ● Private Collection
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-label mb-2">
                    {work.artistSlug ? (
                      <Link to={`/artistas/${work.artistSlug}`} className="hover:text-foreground transition-colors">
                        {artistName}
                      </Link>
                    ) : (
                      artistName
                    )}
                  </p>
                  <h1 className="text-display text-4xl md:text-5xl lg:text-6xl mb-6">{work.title}</h1>
                  {(work.year || work.medium) && (
                    <p className="text-muted-foreground text-sm mb-6">
                      {[work.year, work.medium].filter(Boolean).join(" · ")}
                    </p>
                  )}

                  <button
                    onClick={handleShare}
                    style={{ color: '#1e1517' }}
                    className="inline-flex items-center gap-2 mb-6 text-[10px] font-medium uppercase tracking-[0.18em] opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>

                  {/* Dimensions & weight — clear block */}
                  <div className="tech-box mb-8">
                    <h3 className="text-technical text-foreground mb-3">Details</h3>
                    <dl className="space-y-2 text-sm">
                      {dimensionsText && (
                        <div>
                          <dt className="text-muted-foreground">Dimensions</dt>
                          <dd className="font-medium text-foreground">{dimensionsText}</dd>
                        </div>
                      )}
                      {weightText && (
                        <div>
                          <dt className="text-muted-foreground">Weight</dt>
                          <dd className="font-medium text-foreground">{weightText}</dd>
                        </div>
                      )}
                      {!dimensionsText && !weightText && <p className="text-muted-foreground">Details on request.</p>}
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-4 mb-8">
                    <span className="font-display text-2xl font-semibold text-foreground">{work.priceDisplay}</span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {isAvailable ? (
                      <Button
                        variant="acquire"
                        size="xl"
                        onClick={handleAcquire}
                        disabled={acquiring}
                        className="gap-2"
                      >
                        {acquiring ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <ShoppingBag className="h-5 w-5" />
                        )}
                        {acquiring ? "Processing…" : "Acquire Piece"}
                      </Button>
                    ) : (
                      <Button variant="acquire" size="xl" asChild className="gap-2">
                        <Link
                          to={`/contact?artwork=${encodeURIComponent(work.title)}&artist=${encodeURIComponent(
                            artistName,
                          )}`}
                        >
                          Inquire About This Work
                        </Link>
                      </Button>
                    )}
                  </div>
                  {isAvailable && (
                    <div className="mt-4 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#1e1517]/40"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <p className="font-display text-[10px] uppercase tracking-[0.14em] text-[#1e1517]/40">
                        Secure checkout powered by Stripe
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {otherWorks.length > 0 && (
            <section className="section-padded border-t border-border">
              <div className="container mx-auto">
                <h2 className="text-technical text-foreground font-semibold mb-8">More works by {artistName}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
                  {otherWorks.map((relatedWork) => (
                    <Link key={relatedWork.id} to={`/artworks/${relatedWork.id}`} className="group block">
                      <div className="flex flex-col border border-border bg-card transition-shadow hover:shadow-md">
                        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                          <WorkImage
                            imagenUrl={relatedWork.imagenUrl}
                            title={relatedWork.title}
                            artistName={artistName}
                            className="h-full w-full"
                          />
                          {!relatedWork.available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                              <p className="px-4 py-2 text-center text-background/95 text-sm font-light italic max-w-[80%]">
                                Private collection
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-border/80 bg-card px-4 py-4">
                          <h3 className="font-display text-sm font-semibold text-foreground truncate">
                            {relatedWork.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {relatedWork.available ? relatedWork.priceDisplay : "Private collection"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Shipping & Logistics */}
          <section className="section-padded border-b border-border bg-muted/30">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0 rounded-lg bg-background border border-border p-4">
                  <Package className="h-8 w-8 text-foreground" />
                </div>
                <div>
                  <h2 className="text-technical text-foreground font-semibold mb-2">Shipping & Logistics</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                    White-glove international shipping included. We handle all export documentation from Argentina to
                    your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Certificate of Authenticity */}
          <section className="section-padded">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0 rounded-lg bg-background border border-border p-4">
                  <FileCheck className="h-8 w-8 text-foreground" />
                </div>
                <div>
                  <h2 className="text-technical text-foreground font-semibold mb-2">Certificate of Authenticity</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                    Each work includes a Certificate of Authenticity—both physical and digital—signed by the artist,
                    attesting to the piece’s provenance and authenticity.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ArtworkDetailPage;
