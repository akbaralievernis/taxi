import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Такси Бишкек — Заказать такси в Бишкеке онлайн 24/7 | Taxi KG',
  description: 'Заказ такси в Бишкеке. Быстрая подача машины за 5-10 минут. Фиксированные честные цены. Поездки по городу, в аэропорт Манас и другие города Киргизии. Работаем круглосуточно.',
  keywords: ['такси Бишкек', 'заказать такси Бишкек', 'аэропорт Манас такси', 'Бишкек такси онлайн', 'такси по городу Бишкек'],
};

export default function BishkekPage() {
  return (
    <main className="overflow-x-hidden pb-20 md:pb-0 bg-graphite-950 text-white">
      <JsonLd />
      <PWARegister />
      <Header />
      <Hero />
      <TrustStats />
      <Features />
      <Tariffs />
      <Routes />
      <HowItWorks />
      {/* Renders order form preset for Bishkek */}
      <OrderSection defaultFromCity="Бишкек" defaultToCity="Бишкек" />
      <Reviews />
      <FAQ />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
