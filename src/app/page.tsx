import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import Features from '@/components/Features';
import OrderSection from '@/components/OrderSection';
import Footer from '@/components/Footer';
import PWARegister from '@/components/PWARegister';
import JsonLd from '@/components/seo/JsonLd';
import FloatingCTA from '@/components/ui/FloatingCTA';
import PremiumCTA from '@/components/PremiumCTA';

// Lazy loading heavy sections below the fold for performance optimization
const Tariffs = dynamic(() => import('@/components/Tariffs'), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-graphite-900/20 rounded-2xl border border-graphite-800/50 my-8 mx-auto max-w-7xl h-96" />
});

const Routes = dynamic(() => import('@/components/Routes'), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-graphite-900/20 rounded-2xl border border-graphite-800/50 my-8 mx-auto max-w-7xl h-96" />
});

const HowItWorks = dynamic(() => import('@/components/HowItWorks'), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-graphite-900/20 rounded-2xl border border-graphite-800/50 my-8 mx-auto max-w-7xl h-96" />
});

const Reviews = dynamic(() => import('@/components/Reviews'), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-graphite-900/20 rounded-2xl border border-graphite-800/50 my-8 mx-auto max-w-7xl h-96" />
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="min-h-[300px] animate-pulse bg-graphite-900/20 rounded-2xl border border-graphite-800/50 my-8 mx-auto max-w-7xl h-96" />
});

export default function HomePage() {
  return (
    <main className="overflow-x-hidden pb-20 md:pb-0">
      <JsonLd />
      <PWARegister />
      <Header />
      <Hero />
      <TrustStats />
      <Features />
      <Tariffs />
      <PremiumCTA />
      <Routes />
      <HowItWorks />
      <OrderSection />
      <Reviews />
      <FAQ />
      <Footer />
      <FloatingCTA />
    </main>
  );
}

