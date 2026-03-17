import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandHeroSection } from "@/features/gallery/BrandHeroSection";
import { BrandStorySection } from "@/features/gallery/BrandStorySection";
import { ArtistsSection } from "@/features/gallery/ArtistsSection";
import { SelectedWorksSection } from "@/features/gallery/SelectedWorksSection";
import { BatchStatusSection } from "@/features/gallery/BatchStatusSection";
import { PageTransition } from "@/components/PageTransition";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEO
          title="Contemporary Argentine Art"
          description="Curating and connecting extraordinary Argentine contemporary art with global collectors. From Córdoba to the world."
          url="/"
        />
        <Header />
        <main>
          <BrandHeroSection />
          <BrandStorySection />
          <SelectedWorksSection />
          <ArtistsSection />
          <BatchStatusSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
