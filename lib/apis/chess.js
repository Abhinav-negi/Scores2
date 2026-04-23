export async function fetchChessData(type) {
  try {
    const url = 'https://lichess.org/api/tv/channels';
    const response = await fetch(url, {
      next: { revalidate: type === 'live' ? 30 : 3600 },
    });

    if (!response.ok) {
      throw new Error(`Lichess Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch chess data, falling back to mock:', error);
    return getMockChessData(type);
  }
}

export function normaliseChessData(rawData, type) {
  if (rawData.isMock) {
    return rawData.data.map(match => ({ ...match, isMock: true }));
  }

  // Lichess returns an object where keys are channel names (e.g. 'Bot', 'Blitz')
  // and values have user data. We map these to our match schema.
  const channels = Object.keys(rawData);
  const now = Date.now();

  const matches = channels.map(channelName => {
    const game = rawData[channelName];
    
    return {
      id: game?.id || Math.random().toString(),
      status: 'live', // Lichess TV is only live games
      homeTeam: {
        name: game?.user?.name || game?.p1?.name || 'Player 1',
        score: game?.user?.rating || game?.p1?.rating || '',
      },
      awayTeam: {
        name: game?.p2?.name || 'Player 2',
        score: game?.p2?.rating || '',
      },
      startTime: now,
      completedAt: null,
      extra: {
        format: channelName, // e.g., 'Blitz', 'Bullet'
        timeControl: 'Live Match',
      }
    };
  });

  if (type === 'results') {
    return []; // Lichess TV endpoint doesn't serve past results easily
  }

  return matches;
}

function getMockChessData(type) {
  const now = new Date().getTime();
  const mockMatches = [
    {
      id: 'chess-mock-1',
      status: 'live',
      homeTeam: { name: 'Magnus Carlsen', score: '2830' },
      awayTeam: { name: 'Hikaru Nakamura', score: '2789' },
      startTime: now - 1800000, 
      completedAt: null,
      extra: { format: 'Blitz', timeControl: '3+1' }
    },
    {
      id: 'chess-mock-2',
      status: 'finished',
      homeTeam: { name: 'Fabiano Caruana', score: '1' },
      awayTeam: { name: 'Ian Nepomniachtchi', score: '0' },
      startTime: now - 80000000,
      completedAt: now - 75000000, 
      extra: { format: 'Classical', timeControl: '90+30' }
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
