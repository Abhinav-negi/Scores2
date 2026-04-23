import { NextResponse } from 'next/server';
import { fetchF1Data, normaliseF1Data } from '@/lib/apis/f1';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'live'; 

    const rawData = await fetchF1Data(type);
    const normalisedData = normaliseF1Data(rawData, type);

    let filteredData = normalisedData;

    // Results Window Rule
    if (type === 'results') {
      const now = Date.now();
      const ONE_DAY_MS = 86400000;
      
      filteredData = normalisedData.filter(session => {
        if (!session.completedAt) return false;
        return (now - session.completedAt) < ONE_DAY_MS;
      });
    }

    return NextResponse.json({ data: filteredData }, { status: 200 });
  } catch (error) {
    console.error('F1 API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch F1 data' }, { status: 500 });
  }
}
