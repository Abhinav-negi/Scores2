export async function fetchBasketballData(type) {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey || apiKey === 'dummy_key_for_now') {
    return getMockBasketballData(type);
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://api-nba-v1.p.rapidapi.com/games?date=${today}`;

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
      },
      next: { revalidate: type === 'live' ? 30 : 3600 },
    });

    if (!response.ok) {
      throw new Error(`API-NBA Error: ${response.status}`);
    }

    const data = await response.json();
    return data?.response || [];
  } catch (error) {
    console.error('Failed to fetch basketball data, falling back to mock:', error);
    return getMockBasketballData(type);
  }
}

export function normaliseBasketballData(rawData, type) {
  if (rawData.isMock) {
    return rawData.data.map(match => ({ ...match, isMock: true }));
  }

  if (!Array.isArray(rawData)) return [];

  const now = Date.now();

  return rawData.map(match => {
    // API-NBA status: 1 = scheduled, 2 = in play, 3 = finished
    const statusCode = match?.status?.short;
    let status = 'scheduled';
    if (statusCode === '2' || statusCode === 'HT' || statusCode === 'Q1' || statusCode === 'Q2' || statusCode === 'Q3' || statusCode === 'Q4') {
      status = 'live';
    } else if (statusCode === '3' || statusCode === 'FT') {
      status = 'finished';
    }

    return {
      id: match?.id?.toString() || Math.random().toString(),
      status,
      homeTeam: {
        name: match?.teams?.home?.name || 'Home',
        score: match?.scores?.home?.total?.toString() || '0',
      },
      awayTeam: {
        name: match?.teams?.away?.name || 'Away',
        score: match?.scores?.away?.total?.toString() || '0',
      },
      startTime: match?.date?.start ? new Date(match.date.start).getTime() : now,
      completedAt: status === 'finished' ? now : null,
      extra: {
        quarter: match?.status?.long || '',
        clock: match?.status?.clock || '',
      }
    };
  }).filter(match => {
    if (type === 'live') return match.status === 'live';
    if (type === 'results') return match.status === 'finished';
    return true;
  });
}

function getMockBasketballData(type) {
  const now = new Date().getTime();
  const mockMatches = [
    {
      id: 'nba-mock-1',
      status: 'live',
      homeTeam: { name: 'Los Angeles Lakers', score: '84' },
      awayTeam: { name: 'Golden State Warriors', score: '82' },
      startTime: now - 5400000, 
      completedAt: null,
      extra: { quarter: 'Q3', clock: '04:12' }
    },
    {
      id: 'nba-mock-2',
      status: 'finished',
      homeTeam: { name: 'Miami Heat', score: '102' },
      awayTeam: { name: 'Boston Celtics', score: '110' },
      startTime: now - 80000000,
      completedAt: now - 70000000, 
      extra: { quarter: 'Final', clock: '' }
    }
  ];

  if (type === 'live') {
    return { isMock: true, data: mockMatches.filter(m => m.status === 'live') };
  }
  if (type === 'results') {
    return { isMock: true, data: mockMatches.filter(m => m.status === 'finished') };
  }
  return { isMock: true, data: mockMatches };
}
