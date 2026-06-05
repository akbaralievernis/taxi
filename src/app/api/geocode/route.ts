import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * GET /api/geocode?q=Бишкек+ул+Чуй&lat=42.87&lon=74.6
 *
 * Address autocomplete & geocoding via Photon (OpenStreetMap).
 * Free, no API key required. Falls back to Nominatim if Photon is down.
 *
 * Restricted to Kyrgyzstan (countrycode=kg) for relevant results only.
 *
 * Returns:
 *   { suggestions: [{ name, fullAddress, city, lat, lon, type }] }
 */

interface Suggestion {
  name: string;
  fullAddress: string;
  city?: string;
  lat: number;
  lon: number;
  type?: string;
}

const KG_BBOX = '69.27,39.18,80.28,43.27'; // Kyrgyzstan bounding box

export async function GET(req: NextRequest) {
  // Rate limit: 60/min per IP to be a polite OSM citizen
  const limited = checkRateLimit(req, { window: 60_000, max: 60, key: 'geocode' });
  if (limited) return limited;

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  // Optional bias around a center point (e.g. user's current location)
  const lat = req.nextUrl.searchParams.get('lat');
  const lon = req.nextUrl.searchParams.get('lon');

  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', q);
  url.searchParams.set('lang', 'ru');
  url.searchParams.set('limit', '6');
  url.searchParams.set('bbox', KG_BBOX);
  if (lat && lon) {
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
  }

  try {
    const r = await fetch(url.toString(), {
      headers: { 'User-Agent': 'Taxi KG (https://taxi-puce.vercel.app)' },
      next: { revalidate: 60 }, // CDN cache for 60s
    });
    if (!r.ok) throw new Error(`Photon ${r.status}`);
    const json = await r.json();

    const suggestions: Suggestion[] = (json.features ?? [])
      .filter((f: any) => f.properties?.countrycode === 'KG' || !f.properties?.countrycode)
      .map((f: any): Suggestion => {
        const p = f.properties ?? {};
        const [lon, lat] = f.geometry?.coordinates ?? [0, 0];
        const parts = [
          p.name,
          p.housenumber ? `${p.street ?? ''} ${p.housenumber}`.trim() : p.street,
          p.district,
          p.city ?? p.town ?? p.village ?? p.locality,
        ].filter(Boolean);
        const fullAddress = Array.from(new Set(parts)).join(', ');

        return {
          name: p.name ?? p.street ?? fullAddress,
          fullAddress,
          city: p.city ?? p.town ?? p.village ?? p.locality,
          lat,
          lon,
          type: p.osm_value ?? p.osm_key,
        };
      })
      .filter((s: Suggestion) => s.fullAddress.length > 0);

    return NextResponse.json({ suggestions }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate' },
    });
  } catch (e: any) {
    console.error('[geocode] Photon failed, falling back to Nominatim:', e?.message);
    return geocodeNominatim(q);
  }
}

/** Fallback if Photon is unavailable */
async function geocodeNominatim(q: string): Promise<NextResponse> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '6');
    url.searchParams.set('accept-language', 'ru');
    url.searchParams.set('countrycodes', 'kg');
    url.searchParams.set('addressdetails', '1');

    const r = await fetch(url.toString(), {
      headers: { 'User-Agent': 'Taxi KG (https://taxi-puce.vercel.app)' },
      next: { revalidate: 60 },
    });
    if (!r.ok) throw new Error(`Nominatim ${r.status}`);
    const json = await r.json();
    const suggestions: Suggestion[] = (json ?? []).map((it: any): Suggestion => {
      const addr = it.address ?? {};
      return {
        name: addr.road ?? addr.suburb ?? it.display_name?.split(',')[0] ?? q,
        fullAddress: it.display_name,
        city: addr.city ?? addr.town ?? addr.village,
        lat: parseFloat(it.lat),
        lon: parseFloat(it.lon),
        type: it.type,
      };
    });
    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error('[geocode] Nominatim also failed:', e);
    return NextResponse.json({ suggestions: [] });
  }
}
