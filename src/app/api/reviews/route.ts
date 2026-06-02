import { NextRequest, NextResponse } from 'next/server';
import { getReviews, createReview } from '@/lib/db';

export async function GET() {
  const reviews = await getReviews(true);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.text || !body.rating) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const review = await createReview({
      customerName: String(body.customerName).slice(0, 50),
      rating: Math.min(Math.max(1, Number(body.rating) || 5), 5),
      text: String(body.text).slice(0, 500),
      city: body.city ? String(body.city).slice(0, 50) : undefined,
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
