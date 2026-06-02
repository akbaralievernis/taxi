import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import Features from '@/components/Features';
import Tariffs from '@/components/Tariffs';
import Routes from '@/components/Routes';
import HowItWorks from '@/components/HowItWorks';
import OrderSection from '@/components/OrderSection';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import PWARegister from '@/components/PWARegister';
import JsonLd from '@/components/seo/JsonLd';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <JsonLd />
      <PWARegister />
      <Header />
      <Hero />
      <TrustStats />
      <Features />
      <Tariffs />
      <Routes />
      <HowItWorks />
      <OrderSection />
      <Reviews />
      <FAQ />
      <Footer />
    </main>
  );
}
