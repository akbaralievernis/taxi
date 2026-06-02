/**
 * Structured data for Google rich results.
 * Includes LocalBusiness, FAQPage, Service schemas.
 */

const SITE_URL = 'https://taxi-puce.vercel.app';

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'TaxiService',
  name: 'Taxi KG',
  description: 'Заказ такси по Бишкеку, Ошу и всему Кыргызстану. Городские и междугородние поездки 24/7.',
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.svg`,
  telephone: '+996555000000',
  email: 'info@taxi.kg',
  priceRange: '80-18000 KGS',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Чуй 100',
    addressLocality: 'Бишкек',
    addressCountry: 'KG',
  },
  areaServed: [
    { '@type': 'City', name: 'Бишкек' },
    { '@type': 'City', name: 'Ош' },
    { '@type': 'City', name: 'Каракол' },
    { '@type': 'City', name: 'Джалал-Абад' },
    { '@type': 'City', name: 'Нарын' },
    { '@type': 'City', name: 'Талас' },
    { '@type': 'City', name: 'Баткен' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2847',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://wa.me/996555000000',
    'https://t.me/taxikg',
  ],
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Как быстро приедет такси?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'В Бишкеке и Оше — 5-10 минут. В других городах — 10-20 минут.',
      },
    },
    {
      '@type': 'Question',
      name: 'Сколько стоит такси Бишкек-Ош?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Эконом — от 7500 сом, Комфорт — от 10000 сом. Цена фиксированная.',
      },
    },
    {
      '@type': 'Question',
      name: 'Как оплатить поездку?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Наличными водителю или по карте. Скоро добавим MBank и O!Dengi.',
      },
    },
    {
      '@type': 'Question',
      name: 'Работаете ли ночью?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, такси работает 24/7. Ночью действует наценка 20%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Можно ли заказать такси заранее?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, при оформлении выберите "Запланировать" и укажите дату и время.',
      },
    },
  ],
};

const services = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Городское такси',
    provider: { '@type': 'TaxiService', name: 'Taxi KG' },
    areaServed: 'Бишкек, Ош',
    offers: { '@type': 'Offer', price: '80', priceCurrency: 'KGS' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Междугороднее такси',
    provider: { '@type': 'TaxiService', name: 'Taxi KG' },
    areaServed: 'Кыргызстан',
    offers: { '@type': 'Offer', price: '7500', priceCurrency: 'KGS' },
  },
];

export default function JsonLd() {
  const data = [localBusiness, faqPage, ...services];
  return (
    <>
      {data.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
