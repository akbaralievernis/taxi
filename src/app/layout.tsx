import type { Metadata, Viewport } from 'next';
import { LocaleProvider } from '@/lib/LocaleContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://taxi-kg.example'),
  title: {
    default: 'Taxi KG — Такси по Кыргызстану | Бишкек, Ош, Каракол 24/7',
    template: '%s | Taxi KG',
  },
  description: 'Заказ такси по Бишкеку, Ошу и всему Кыргызстану. Междугородние поездки. Фиксированные цены. Работаем 24/7. Доступно на 3 языках.',
  keywords: [
    'такси Бишкек', 'такси Ош', 'междугороднее такси', 'Бишкек Ош',
    'такси Кыргызстан', 'taxi kg', 'taxi Bishkek', 'такси Каракол',
    'такси Джалал-Абад', 'трансфер аэропорт Манас', 'грузовое такси Бишкек',
  ],
  authors: [{ name: 'Taxi KG' }],
  manifest: '/manifest.json',
  applicationName: 'Taxi KG',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Taxi KG',
  },
  formatDetection: { telephone: true, address: false, email: false },
  openGraph: {
    title: 'Taxi KG — Такси по Кыргызстану',
    description: 'Быстро, удобно, по фиксированной цене. Заказывайте онлайн.',
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: ['ky_KG', 'en_US'],
    siteName: 'Taxi KG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taxi KG — Такси по Кыргызстану',
    description: 'Быстро, удобно, по фиксированной цене.',
  },
  robots: { index: true, follow: true },
  category: 'travel',
};

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body>
        <ThemeProvider>
          <LocaleProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: 'rgba(15, 23, 42, 0.95)',
                  color: '#fff',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  backdropFilter: 'blur(12px)',
                },
                success: { iconTheme: { primary: '#f59e0b', secondary: '#fff' } },
              }}
            />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
