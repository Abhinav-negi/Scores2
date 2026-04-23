import { NextResponse } from 'next/server';
import { fetchTennisData, normaliseTennisData } from '@/lib/apis/tennis';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'live'; 

    const rawData = await fetchTennisData(type);
    const normalisedData = normaliseTennisData(rawData, type);

    let filteredData = normalisedData;

    // Results Window Rule
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
    console.error('Tennis API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tennis data' }, { status: 500 });
  }
}
