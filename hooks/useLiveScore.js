import { useQuery } from '@tanstack/react-query';

const fetchLiveScores = async (sport) => {
  const response = await fetch(`/api/sports/${sport}?type=live`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await response.json();
  return json.data;
};

export function useLiveScore(sport) {
  return useQuery({
    queryKey: ['liveScore', sport],
    queryFn: () => fetchLiveScores(sport),
    refetchInterval: 30000, // 30 seconds polling
    staleTime: 10000,       // Data is fresh for 10 seconds
  });
}
