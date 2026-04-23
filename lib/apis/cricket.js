export async function fetchCricketData(type) {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey || apiKey === 'dummy_key_for_now') {
    return getMockCricketData(type);
  }

  try {
    const url = 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent';

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com',
      },
      next: { revalidate: type === 'live' ? 30 : 3600 },
    });

    if (!response.ok) {
      throw new Error(`Cricbuzz API Error: ${response.status}`);
    }

    const data = await response.json();
    return data?.typeMatches || [];
  } catch (error) {
    console.error('Failed to fetch cricket data, falling back to mock:', error);
    return getMockCricketData(type);
  }
}

export function normaliseCricketData(rawData, type) {
  if (rawData.isMock) {
    return rawData.data.map(match => ({ ...match, isMock: true }));
  }

  if (!Array.isArray(rawData)) return [];

  const now = Date.now();
  const allMatches = [];

  // Cricbuzz nests matches under typeMatches -> seriesMatches -> seriesAdWrapper -> matches
  rawData.forEach(typeMatch => {
    if (typeMatch.seriesMatches) {
      typeMatch.seriesMatches.forEach(series => {
        if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
          series.seriesAdWrapper.matches.forEach(matchObj => {
            const match = matchObj.matchInfo;
            const score = matchObj.matchScore;
            
            if (!match) return;

            let status = 'scheduled';
            if (match.state === 'In Progress' || match.state === 'Live') status = 'live';
            if (match.state === 'Complete' || match.state === 'Stumps') status = 'finished';

            allMatches.push({
              id: match?.matchId?.toString() || Math.random().toString(),
              status,
              homeTeam: {
                name: match?.team1?.teamName || 'Team 1',
                score: score?.team1Score?.inngs1?.runs?.toString() || '',
              },
              awayTeam: {
                name: match?.team2?.teamName || 'Team 2',
                score: score?.team2Score?.inngs1?.runs?.toString() || '',
              },
              startTime: match?.startDate ? parseInt(match.startDate, 10) : now,
              completedAt: status === 'finished' ? now : null,
              extra: {
                innings: match?.status || '',
                overs: '',
                wickets: '',
              }
            });
          });
        }
      });
    }
  });

  return allMatches.filter(match => {
    if (type === 'live') return match.status === 'live';
    if (type === 'results') return match.status === 'finished';
    return true;
  });
}

function getMockCricketData(type) {
  const now = new Date().getTime();
  const mockMatches = [
    {
      id: 'cricket-mock-1',
      status: 'live',
      homeTeam: { name: 'India', score: '245/4' },
      awayTeam: { name: 'Australia', score: '189/10' },
      startTime: now - 7200000,
      completedAt: null,
      extra: { innings: '2nd Innings', overs: '42.3', wickets: '4' }
    },
    {
      id: 'cricket-mock-2',
      status: 'finished',
      homeTeam: { name: 'England', score: '312/8' },
      awayTeam: { name: 'New Zealand', score: '310/10' },
      startTime: now - 90000000,
      completedAt: now - 86000000, 
      extra: { innings: 'Match Over', overs: '50.0', wickets: '10' }
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
