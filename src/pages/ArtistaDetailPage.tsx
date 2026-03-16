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
};

type ArtistWorkRow = {
  id: number;
  title: string;
  image_url?: string | null;
  status?: string | null;
  price_usd?: number | null;
};

const masonryPatterns = [
  { span: "md:col-span-3", aspect: "aspect-[4/5]" },
  { span: "md:col-span-3", aspect: "aspect-[5/4]" },
  { span: "md:col-span-2", aspect: "aspect-[4/5]" },
  { span: "md:col-span-4", aspect: "aspect-[16/10]" },
  { span: "md:col-span-2", aspect: "aspect-square" },
  { span: "md:col-span-3", aspect: "aspect-[4/5]" },
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
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url?.trim() || null,
    status: row.status ?? null,
    price: row.price_usd ?? null,
    currency: "USD",
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
        <Header />
        <main>
          <section className="overflow-visible bg-[#fcf8ea] px-12 pb-24 pt-28 md:pb-28 md:pt-36">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-8 lg:gap-x-10">
                <div className="md:col-span-8">
                  <div className="inline-flex items-center rounded-full border border-[#1e1517]/20 px-4 py-2">
                    <span className="font-display text-[11px] uppercase tracking-[0.16em] text-[#1e1517]">
                      Who Is
                    </span>
                  </div>
                  <h1 className="mt-8 pl-12 font-display text-6xl font-bold uppercase tracking-tight text-[#1e1517] md:text-7xl lg:text-[92px]">
                    {artist.name}
                  </h1>
                </div>

                <div className="md:col-span-12">
                  <div className="relative left-1/2 h-[1px] w-screen -translate-x-1/2 bg-[#1e1517]/20" />
                </div>

                <div className="order-2 md:order-none md:col-span-2 md:pt-12">
                  <div className="space-y-12">
                    <div>
                      <p className="font-display text-[10px] font-light uppercase tracking-[0.45em] text-[#1e1517]/58">
                        Origin
                      </p>
                      <p className="mt-4 font-display text-sm leading-7 text-[#1e1517]">
                        {artist.origin || "Available on request"}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-[10px] font-light uppercase tracking-[0.45em] text-[#1e1517]/58">
                        Specialty
                      </p>
                      <p className="mt-4 font-display text-sm leading-7 text-[#1e1517]">
                        {artist.specialty || "Available on request"}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-[10px] font-light uppercase tracking-[0.45em] text-[#1e1517]/58">
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
                    <p className="mt-10 text-5xl text-[#1e1517]/90 md:text-6xl" style={{ fontFamily: "BestDB, serif" }}>
                      {artist.name}
                    </p>
                  </div>
                </div>

                <div className="order-1 md:order-none md:col-start-9 md:col-span-4 md:-mt-24">
                  {artist.imageUrl ? (
                    <div className="aspect-[2/3] overflow-hidden rounded-full bg-[#efe6d5]">
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

                    return (
                      <Link key={work.id} to={`/artworks/${work.id}`} className={`group block ${pattern.span}`}>
                        <div className={`relative overflow-hidden bg-[#efe6d5] ${pattern.aspect}`}>
                          <OptimizedImage
                            src={work.imageUrl ?? ""}
                            title={work.title}
                            artistName={artist.name}
                            variant="artwork"
                            className="h-full w-full"
                            imageClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            logSrcOnError
                          />

                          <div
                            className={`absolute inset-0 transition-all duration-500 ease-out ${
                              sold ? "bg-black/35" : "bg-black/0 group-hover:bg-black/60"
                            }`}
                          />

                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                            {sold ? (
                              <p className="max-w-[22ch] text-center font-display text-base italic leading-relaxed text-[#fcf8ea] md:text-lg">
                                This piece is now part of a private collection
                              </p>
                            ) : (
                              <p className="font-display text-center text-3xl tracking-tight text-white opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 md:text-4xl">
                                {artist.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="pt-4">
                          <h3 className="font-display text-sm font-medium uppercase tracking-[0.08em] text-[#1e1517]">
                            {work.title}
                          </h3>

                          {sold ? (
                            <p className="mt-2 font-display text-xs font-normal leading-relaxed text-[#1e1517]/52">
                              This piece is now part of a private collection
                            </p>
                          ) : (
                            <p className="mt-2 font-display text-xs font-normal tracking-[0.04em] text-[#1e1517]/78">
                              {formatWorkPrice(work.price, work.currency)}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ArtistaDetailPage;
