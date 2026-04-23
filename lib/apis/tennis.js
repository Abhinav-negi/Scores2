export async function fetchTennisData(type) {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey || apiKey === 'dummy_key_for_now') {
    return getMockTennisData(type);
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://tennis-live-data.p.rapidapi.com/matches-by-date/${today}`;

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'tennis-live-data.p.rapidapi.com',
      },
      next: { revalidate: type === 'live' ? 30 : 3600 },
    });

    if (!response.ok) {
      throw new Error(`Tennis API Error: ${response.status}`);
    }

    const data = await response.json();
    return data?.results || [];
  } catch (error) {
    console.error('Failed to fetch tennis data, falling back to mock:', error);
    return getMockTennisData(type);
  }
}

export function normaliseTennisData(rawData, type) {
  if (rawData.isMock) {
    return rawData.data.map(match => ({ ...match, isMock: true }));
  }

  if (!Array.isArray(rawData)) return [];

  const now = Date.now();

  return rawData.map(match => {
    const statusCode = match?.status; // e.g., 'inprogress', 'finished'
    let status = 'scheduled';
    if (statusCode === 'inprogress') status = 'live';
    if (statusCode === 'finished') status = 'finished';

    return {
      id: match?.id?.toString() || Math.random().toString(),
      status,
      homeTeam: {
        name: match?.home_player || 'Player 1',
        score: match?.result?.home_sets?.toString() || '0',
      },
      awayTeam: {
        name: match?.away_player || 'Player 2',
        score: match?.result?.away_sets?.toString() || '0',
      },
      startTime: match?.date ? new Date(match.date).getTime() : now,
      completedAt: status === 'finished' ? now : null,
      extra: {
        set: match?.result?.current_set || '',
        gameScore: match?.result?.game_score || '',
      }
    };
  }).filter(match => {
    if (type === 'live') return match.status === 'live';
    if (type === 'results') return match.status === 'finished';
    return true;
  });
}

function getMockTennisData(type) {
  const now = new Date().getTime();
  const mockMatches = [
    {
      id: 'tennis-mock-1',
      status: 'live',
      homeTeam: { name: 'J. Sinner', score: '2' },
      awayTeam: { name: 'C. Alcaraz', score: '1' },
      startTime: now - 3600000, 
      completedAt: null,
      extra: { set: 'Set 4', gameScore: '40-15' }
    },
    {
      id: 'tennis-mock-2',
      status: 'finished',
      homeTeam: { name: 'N. Djokovic', score: '3' },
      awayTeam: { name: 'A. Zverev', score: '0' },
      startTime: now - 90000000,
      completedAt: now - 80000000, 
      extra: { set: 'Final', gameScore: '' }
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
