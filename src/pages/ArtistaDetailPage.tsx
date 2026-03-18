import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OptimizedImage } from "@/components/OptimizedImage";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "@/hooks/use-toast";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { SEO } from "@/components/SEO";
import { getArtists, type ArtistFromApi } from "@/lib/api";

type ArtistDetail = {
  id: number;
  slug: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  origin: string | null;
  specialty: string | null;
  birthYear: string | null;
  studioImageUrl: string | null;
  studioDescription: string | null;
};

type ArtistDetailRow = {
  id: number;
  slug: string;
  name: string;
  bio?: string | null;
  image_url?: string | null;
  origin?: string | null;
  specialty?: string | null;
  birth_year?: string | number | null;
  studio_image_url?: string | null;
  studio_description?: string | null;
};

type ArtistWork = {
  id: number;
  title: string;
  imageUrl: string | null;
  status: string | null;
  price: number | null;
  currency: string;
  available: boolean;
};

type ArtistWorkRow = {
  id: number;
  title: string;
  image_url?: string | null;
  status?: string | null;
  price_usd?: number | null;
};

const masonryPatterns = [
  { span: "md:col-span-3", aspect: "aspect-[3/4]" },
  { span: "md:col-span-3", aspect: "aspect-[3/4]" },
  { span: "md:col-span-2", aspect: "aspect-[3/4]" },
  { span: "md:col-span-4", aspect: "aspect-[3/4]" },
  { span: "md:col-span-2", aspect: "aspect-[3/4]" },
  { span: "md:col-span-3", aspect: "aspect-[3/4]" },
];

function mapArtistDetailRow(row: ArtistDetailRow): ArtistDetail {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    bio: row.bio ?? null,
    imageUrl: row.image_url?.trim() || null,
    origin: row.origin ?? null,
    specialty: row.specialty ?? null,
    birthYear: row.birth_year != null ? String(row.birth_year) : null,
    studioImageUrl: row.studio_image_url?.trim() || null,
    studioDescription: row.studio_description ?? null,
  };
}

function mapArtistWorkRow(row: ArtistWorkRow): ArtistWork {
  const status = row.status ?? null;
  const sold = isSoldWork(status);
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url?.trim() || null,
    status,
    price: row.price_usd ?? null,
    currency: "USD",
    available: !sold,
  };
}

function formatWorkPrice(price: number | null, currency: string): string {
  if (price == null) return "Price on request";

  const formatted = Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${formatted} ${currency}`;
}

function isSoldWork(status: string | null): boolean {
  if (!status) return false;
  const normalized = status.toLowerCase();
  return normalized === "sold" || normalized === "vendido";
}

async function fetchArtistDetail(slug: string): Promise<ArtistDetail | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = getSupabase();
  const select =
    "id,slug,name,bio,image_url,origin,specialty,birth_year,studio_image_url,studio_description";
  const { data, error } = await supabase.from("artists").select(select).eq("slug", slug).single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message ?? "Could not load artist");
  }

  return data ? mapArtistDetailRow(data as ArtistDetailRow) : null;
}

async function fetchArtistWorks(artistId: number): Promise<ArtistWork[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("artworks")
    .select("id,title,image_url,status,price_usd")
    .eq("artist_id", artistId)
    .order("id", { ascending: true });

  if (error) throw new Error(error.message ?? "Could not load works");

  return ((data ?? []) as ArtistWorkRow[]).map(mapArtistWorkRow);
}

const ArtistaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: artist = null,
    isLoading: loadingArtist,
    isError: artistError,
  } = useQuery({
    queryKey: ["artist", slug],
    queryFn: () => fetchArtistDetail(slug!),
    enabled: !!slug,
  });

  const {
    data: works = [],
    isLoading: loadingWorks,
    isError: worksError,
  } = useQuery({
    queryKey: ["artistWorks", artist?.id],
    queryFn: () => fetchArtistWorks(artist!.id),
    enabled: !!artist?.id,
  });

  const { data: allArtists = [] } = useQuery<ArtistFromApi[]>({
    queryKey: ["artists"],
    queryFn: getArtists,
  });

  useEffect(() => {
    if (artistError) {
      toast({ title: "Error", description: "Could not load artist.", variant: "destructive" });
    }
  }, [artistError]);

  useEffect(() => {
    if (worksError) {
      toast({ title: "Error", description: "Could not load works.", variant: "destructive" });
    }
  }, [worksError]);

  if (loadingArtist) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#fcf8ea]">
          <Header />
          <main className="flex min-h-[60vh] items-center justify-center bg-[#fcf8ea] px-12 py-24">
            <div className="flex items-center gap-4 text-[#1e1517]/55">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="font-display text-xs uppercase tracking-[0.18em]">Loading artist</span>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!artist) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#fcf8ea]">
          <Header />
          <main className="bg-[#fcf8ea] px-12 py-32">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-[#1e1517] md:text-6xl">
                Artist not found
              </h1>
              <Link
                to="/artistas"
                className="mt-8 inline-flex items-center rounded-full border border-[#1e1517]/20 px-6 py-3 font-display text-xs uppercase tracking-[0.12em] text-[#1e1517] transition-colors hover:bg-[#1e1517] hover:text-[#fcf8ea]"
              >
                Back to Artists
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#fcf8ea]">
        <SEO
          title={artist.name}
          description={artist.bio ?? `Works and biography of ${artist.name}, contemporary Argentine artist.`}
          image={artist.imageUrl ?? undefined}
          url={`/artistas/${artist.slug}`}
          type="article"
        />
        <Header />
        <main>
          <section className="overflow-visible bg-[#fcf8ea] px-6 pb-24 pt-28 md:px-12 md:pb-28 md:pt-36">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
                <div className="md:col-span-8">
                  <div className="mb-4 pl-12">
                    <Link
                      to="/artistas"
                      className="font-display text-xs uppercase tracking-[0.18em] text-[#1e1517]/50 hover:text-[#1e1517]"
                    >
                      ← Artists
                    </Link>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-[#1e1517]/20 px-4 py-2">
                    <span className="font-display text-[11px] uppercase tracking-[0.16em] text-[#1e1517]">
                      About the Artist
                    </span>
                  </div>
                  <h1 className="mt-8 pl-12 font-display text-4xl font-bold uppercase tracking-tight text-[#1e1517] md:text-6xl lg:text-[92px]">
                    {artist.name}
                  </h1>
                </div>

                <div className="md:col-span-12">
                  <div className="relative left-1/2 h-[1px] w-screen -translate-x-1/2 bg-[#1e1517]/20" />
                </div>

                <div className="order-2 md:order-none md:col-span-2 md:pt-12">
                  <div className="space-y-12">
                    <div>
                      <p className="font-display text-[11px] font-normal uppercase tracking-[0.45em] text-[#1e1517]/58">
                        Origin
                      </p>
                      <p className="mt-4 font-display text-sm leading-7 text-[#1e1517]">
                        {artist.origin || "Available on request"}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-[11px] font-normal uppercase tracking-[0.45em] text-[#1e1517]/58">
                        Specialty
                      </p>
                      <p className="mt-4 font-display text-sm leading-7 text-[#1e1517]">
                        {artist.specialty || "Available on request"}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-[11px] font-normal uppercase tracking-[0.45em] text-[#1e1517]/58">
                        Born
                      </p>
                      <p className="mt-4 font-display text-sm leading-7 text-[#1e1517]">
                        {artist.birthYear || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-3 md:order-none md:col-start-3 md:col-span-5 md:pt-12">
                  <div className="overflow-visible">
                    <p className="font-display text-base font-light leading-relaxed text-[#1e1517] [text-align:justify]">
                      {artist.bio || "Biography available on request."}
                    </p>
                  </div>
                </div>

                <div className="order-1 md:order-none md:col-start-9 md:col-span-4 md:-mt-24">
                  <div className="relative">
                    <p
                      className="pointer-events-none select-none font-display text-4xl md:text-5xl lg:text-[60px] uppercase tracking-tight text-[#1e1517] opacity-[0.07]"
                      style={{ fontFamily: "BestDB, serif" }}
                    >
                      {artist.name}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {artist.imageUrl ? (
                        <div className="aspect-[2/3] w-full max-w-xs overflow-hidden rounded-full bg-[#efe6d5] md:max-w-sm">
                          <OptimizedImage
                            src={artist.imageUrl}
                            alt={artist.name}
                            className="h-full w-full"
                            imageClassName="object-cover"
                            logSrcOnError
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[2/3] items-center justify-center rounded-full border border-[#1e1517]/10 bg-[#efe6d5] px-8 text-center">
                          <p className="font-display text-sm uppercase tracking-[0.16em] text-[#1e1517]/48">
                            Portrait coming soon
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-12">
                  <div className="mx-auto my-32 h-[1px] w-3/5 bg-[#1e1517]/20" />
                </div>

                <div className="md:col-span-12">
                  <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
                    <div className="md:col-span-9">
                      <p className="pl-12 font-display text-xs uppercase tracking-[0.24em] text-[#1e1517]/58">
                        The Workspace
                      </p>
                      <div className="mt-6 md:ml-[-3rem]">
                        {artist.studioImageUrl ? (
                          <div className="aspect-[16/9] overflow-hidden bg-[#efe6d5]">
                            <OptimizedImage
                              src={artist.studioImageUrl}
                              alt={`${artist.name} studio`}
                              className="h-full w-full"
                              imageClassName="object-cover"
                              logSrcOnError
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[16/9] items-center justify-center border border-[#1e1517]/10 bg-[#efe6d5] px-8 text-center">
                            <p className="font-display text-sm uppercase tracking-[0.16em] text-[#1e1517]/48">
                              Studio image coming soon
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-3 md:pt-20">
                      <p className="font-display text-base font-light leading-relaxed text-[#1e1517]/72">
                        {artist.studioDescription ||
                          "A closer look at the artist's workspace and the atmosphere where each body of work takes shape."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#fcf8ea] px-12 pb-32 md:pb-36">
            <div className="mx-auto max-w-7xl">
              <div className="my-20">
                <h2 className="font-display text-4xl font-normal tracking-tight text-[#1e1517]">
                  {artist.name}
                  {"'"}s Works
                </h2>
              </div>

              {loadingWorks ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1e1517]/50" />
                </div>
              ) : works.length === 0 ? (
                <div className="py-12">
                  <p className="font-display text-sm uppercase tracking-[0.16em] text-[#1e1517]/50">
                    No works available yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
                  {works.map((work, index) => {
                    const pattern = masonryPatterns[index % masonryPatterns.length];
                    const sold = isSoldWork(work.status);
                    const available = work.available;

                    return (
                      <div key={work.id} className={`group block ${pattern.span}`}>
                        <Link to={`/artworks/${work.id}`}>
                          <div className={`relative overflow-hidden bg-[#efe6d5] ${pattern.aspect}`}>
                            <OptimizedImage
                              src={work.imageUrl ?? ""}
                              title={work.title}
                              artistName={artist.name}
                              variant="artwork"
                              className="h-full w-full"
                              imageClassName="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                              logSrcOnError
                            />

                            <div
                              className={`absolute inset-0 transition-all duration-500 ease-out ${
                                sold ? "bg-black/35" : "bg-black/0 group-hover:bg-black/60"
                              }`}
                            />

                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#1e1517]/0 p-6 opacity-0 backdrop-blur-none transition-all duration-500 ease-out group-hover:bg-[#1e1517]/60 group-hover:opacity-100 group-hover:backdrop-blur-sm">
                            {sold ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1517]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#1e1517]/60">
                                ● Private Collection
                              </span>
                            ) : (
                              <div className="text-center text-white">
                                <p className="font-display text-lg tracking-tight md:text-xl">
                                  {work.title}
                                </p>
                                <p className="mt-2 font-display text-[10px] uppercase tracking-[0.22em] text-white/80">
                                  View work →
                                </p>
                              </div>
                            )}
                          </div>
                          </div>
                        </Link>

                        <div className="pt-4 space-y-2">
                          <h3 className="font-display text-sm font-medium uppercase tracking-[0.08em] text-[#1e1517]">
                            {work.title}
                          </h3>

                          <div className="flex items-center gap-2">
                            <p
                              className={`font-display text-xs font-normal tracking-[0.04em] text-[#1e1517]/78 ${
                                sold ? "line-through opacity-40" : ""
                              }`}
                            >
                              {formatWorkPrice(work.price, work.currency)}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#1e1517]/5 px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.18em] text-[#1e1517]/70">
                              <span
                                className={`inline-block h-1.5 w-1.5 rounded-full ${
                                  available ? "bg-emerald-500" : "bg-[#1e1517]/40"
                                }`}
                              />
                              {available ? "Available" : "Sold"}
                            </span>
                          </div>

                          <Link
                            to={`/contacto?obra=${encodeURIComponent(work.title)}`}
                            className="inline-flex border border-[#1e1517]/30 px-4 py-1.5 font-display text-xs font-medium uppercase tracking-[0.18em] text-[#1e1517] transition-colors hover:bg-[#1e1517] hover:text-[#fcf8ea]"
                          >
                            Inquire
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {allArtists.length > 1 && (
            <>
              <section className="bg-[#fcf8ea] px-12 pb-16 md:pb-20 border-t border-[#1e1517]/10">
                <div className="mx-auto flex max-w-7xl items-start justify-between gap-8">
                  {(() => {
                    const index = allArtists.findIndex((a) => a.slug === artist.slug);
                    const prevArtist =
                      index > 0 && index < allArtists.length ? allArtists[index - 1] : null;
                    const nextArtist =
                      index >= 0 && index < allArtists.length - 1 ? allArtists[index + 1] : null;

                    return (
                      <>
                        <div className="flex-1">
                          {prevArtist && (
                            <Link to={`/artistas/${prevArtist.slug}`} className="block">
                              <span className="font-display text-xs uppercase tracking-[0.18em] text-[#1e1517]/60">
                                ← Previous artist
                              </span>
                              <p className="mt-1 font-display text-sm text-[#1e1517]">
                                {prevArtist.name}
                              </p>
                            </Link>
                          )}
                        </div>
                        <div className="flex-1 text-right">
                          {nextArtist && (
                            <Link to={`/artistas/${nextArtist.slug}`} className="block">
                              <span className="font-display text-xs uppercase tracking-[0.18em] text-[#1e1517]/60">
                                Next artist →
                              </span>
                              <p className="mt-1 font-display text-sm text-[#1e1517]">
                                {nextArtist.name}
                              </p>
                            </Link>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </section>

              <section className="bg-[#fcf8ea] px-12 pb-24 md:pb-32 border-t border-[#1e1517]/10">
                <div className="mx-auto max-w-7xl">
                  <p className="mb-6 font-display text-sm uppercase tracking-[0.28em] text-[#1e1517]/50">
                    More Artists
                  </p>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {allArtists
                      .filter((a) => a.slug !== artist.slug)
                      .slice(0, 3)
                      .map((other) => (
                        <Link
                          key={other.id}
                          to={`/artistas/${other.slug}`}
                          className="group flex flex-col items-center text-center"
                        >
                          <div className="w-full max-w-[220px]">
                            <div className="relative aspect-[2/3] overflow-hidden rounded-full bg-[#efe6d5] transition-transform duration-300 ease-out group-hover:scale-[1.03]">
                              <OptimizedImage
                                src={other.imageUrl ?? ""}
                                alt={other.name}
                                className="h-full w-full"
                                imageClassName="h-full w-full object-cover object-[50%_0%] grayscale transition-all duration-300 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                                logSrcOnError
                              />
                            </div>
                          </div>
                          <p className="mt-4 font-display text-xs font-medium uppercase tracking-[0.14em] text-[#1e1517]">
                            {other.name}
                          </p>
                        </Link>
                      ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ArtistaDetailPage;
