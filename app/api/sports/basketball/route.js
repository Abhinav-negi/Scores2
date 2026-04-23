import { NextResponse } from 'next/server';
import { fetchBasketballData, normaliseBasketballData } from '@/lib/apis/basketball';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'live'; 

    const rawData = await fetchBasketballData(type);
    const normalisedData = normaliseBasketballData(rawData, type);

    let filteredData = normalisedData;

    // Results Window Rule: A match result is only shown if: Date.now() - match.completedAt < 86400000
    if (type === 'results') {
      const now = Date.now();
      const ONE_DAY_MS = 86400000;
      
      filteredData = normalisedData.filter(match => {
        if (!match.completedAt) return false;
        return (now - match.completedAt) < ONE_DAY_MS;
      });
    }

    return NextResponse.json({ data: filteredData }, { status: 200 });
  } catch (error) {
    console.error('Basketball API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch basketball data' }, { status: 500 });
  }
}
