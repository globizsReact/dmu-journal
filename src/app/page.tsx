import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/landing/HeroSection';
import CategoryShowcase from '@/components/landing/CategoryShowcase';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoryShowcase />
      </main>
      <Footer />
    </div>
  );
}
