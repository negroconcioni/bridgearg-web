import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/features/gallery/HeroSection";
import { SentidoSection } from "@/features/gallery/SentidoSection";
import { SelectedWorksSection } from "@/features/gallery/SelectedWorksSection";
import { ArtistsPreviewSection } from "@/features/gallery/ArtistsPreviewSection";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <SentidoSection />
          <SelectedWorksSection />
          <ArtistsPreviewSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
