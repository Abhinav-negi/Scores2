export async function fetchF1Data(type) {
  // Try to fetch real data, fallback to mock on failure
  try {
    const url = 'https://api.openf1.org/v1/sessions?year=2024'; 
    const response = await fetch(url, {
      next: { revalidate: type === 'live' ? 30 : 3600 },
    });

    if (!response.ok) {
      throw new Error(`OpenF1 Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch F1 data, falling back to mock:', error);
    return getMockF1Data(type);
  }
}

export function normaliseF1Data(rawData, type) {
  if (rawData.isMock) {
    return rawData.data.map(match => ({ ...match, isMock: true }));
  }

  if (!Array.isArray(rawData)) return [];

  const now = Date.now();
  
  return rawData.map(session => {
    const startTime = session?.date_start ? new Date(session.date_start).getTime() : now;
    const endTime = session?.date_end ? new Date(session.date_end).getTime() : now + 3600000;
    
    // Determine status based on time
    let status = 'scheduled';
    if (now >= startTime && now <= endTime) status = 'live';
    if (now > endTime) status = 'finished';

    return {
      id: session?.session_key?.toString() || Math.random().toString(),
      status,
      homeTeam: {
        name: session?.country_name || 'Unknown GP',
        score: session?.location || '',
      },
      awayTeam: {
        name: session?.session_name || 'Session',
        score: '',
      },
      startTime,
      completedAt: status === 'finished' ? endTime : null,
      extra: {
        circuit: session?.circuit_short_name || '',
        year: session?.year || '',
      }
    };
  }).filter(session => {
    if (type === 'live') return session.status === 'live';
    if (type === 'results') return session.status === 'finished';
    return true; // scheduled or all
  }).sort((a, b) => b.startTime - a.startTime).slice(0, 20); // Sort by most recent and limit
}

function getMockF1Data(type) {
  const now = new Date().getTime();
  const mockSessions = [
    {
      id: 'f1-mock-1',
      status: 'live',
      homeTeam: { name: 'Monaco Grand Prix', score: 'Monte Carlo' },
      awayTeam: { name: 'Race', score: 'Lap 34/78' },
      startTime: now - 3600000, 
      completedAt: null,
      extra: { circuit: 'Circuit de Monaco', year: 2026 }
    },
    {
      id: 'f1-mock-2',
      status: 'finished',
      homeTeam: { name: 'Miami Grand Prix', score: 'Miami' },
      awayTeam: { name: 'Race', score: 'Verstappen P1' },
      startTime: now - 50000000,
      completedAt: now - 40000000,
      extra: { circuit: 'Miami International Autodrome', year: 2026 }
    }
  ];

  if (type === 'live') {
    return { isMock: true, data: mockSessions.filter(m => m.status === 'live') };
  }
  if (type === 'results') {
    return { isMock: true, data: mockSessions.filter(m => m.status === 'finished') };
  }
  return { isMock: true, data: mockSessions };
}
