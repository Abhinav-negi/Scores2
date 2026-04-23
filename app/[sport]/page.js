'use client';

import { useLiveScore } from '@/hooks/useLiveScore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

// Dynamic imports or direct imports for sport-specific components
import CricketScorecard from '@/components/sports/cricket/CricketScorecard';
import CricketStandings from '@/components/sports/cricket/CricketStandings';
import F1DriverTable from '@/components/sports/f1/F1DriverTable';
import F1ConstructorTable from '@/components/sports/f1/F1ConstructorTable';
import BasketballBoxScore from '@/components/sports/basketball/BasketballBoxScore';
import BasketballStandings from '@/components/sports/basketball/BasketballStandings';
import TennisMatchCard from '@/components/sports/tennis/TennisMatchCard';
import TennisRankings from '@/components/sports/tennis/TennisRankings';
import ChessResultsCard from '@/components/sports/chess/ChessResultsCard';
import ChessTournamentTable from '@/components/sports/chess/ChessTournamentTable';
import ResultCard from '@/components/shared/ResultCard';

const COMPONENT_MAP = {
  cricket: { card: CricketScorecard, table: CricketStandings },
  f1: { card: null, table: F1DriverTable, extraTable: F1ConstructorTable },
  basketball: { card: BasketballBoxScore, table: BasketballStandings },
  tennis: { card: TennisMatchCard, table: TennisRankings },
  chess: { card: ChessResultsCard, table: ChessTournamentTable },
};

const fetchResults = async (sport) => {
  const response = await fetch(`/api/sports/${sport}?type=results`);
  if (!response.ok) throw new Error('Network response was not ok');
  const json = await response.json();
  return json.data;
};

export default function SportHubPage() {
  const { user, isLoading: authLoading, fetchSession } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const sport = params.sport?.toLowerCase();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch Live Data
  const { data: liveMatches, isLoading: liveLoading } = useLiveScore(sport);

  // Fetch Recent Results Data
  const { data: recentResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['results', sport],
    queryFn: () => fetchResults(sport),
    staleTime: 5 * 60 * 1000,
  });

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-secondary border-t-brand-primary"></div>
      </div>
    );
  }

  const components = COMPONENT_MAP[sport];
  if (!components) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-xl font-bold text-foreground/50">Sport not found.</h1>
      </div>
    );
  }

  const CardComponent = components.card;
  const TableComponent = components.table;
  const ExtraTableComponent = components.extraTable;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b border-brand-secondary pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-brand-primary capitalize">
          {sport} Hub
        </h1>
        <p className="mt-2 text-sm text-foreground/60">Everything you need to know about {sport}.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Feed Column */}
        <div className="xl:col-span-2 space-y-12">
          
          {/* Live Section */}
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-brand-primary/80 mb-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent"></span>
              </span>
              Live & Upcoming
            </h2>
            {liveLoading ? (
              <div className="py-4 text-xs text-foreground/50 animate-pulse">Loading live data...</div>
            ) : liveMatches?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map((match) => {
                  if (CardComponent) return <CardComponent key={match.id} match={match} />;
                  return null;
                })}
              </div>
            ) : (
              <p className="text-sm text-foreground/50 italic border border-dashed border-brand-secondary p-6 rounded text-center">No live events right now.</p>
            )}
          </section>

          {/* Recent Results Section */}
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-foreground/50 mb-4">
              Recent Results
            </h2>
            {resultsLoading ? (
              <div className="py-4 text-xs text-foreground/50 animate-pulse">Loading results...</div>
            ) : recentResults?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentResults.map((match) => (
                  <ResultCard key={match.id} sport={sport} match={match} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground/50 italic border border-dashed border-brand-secondary p-6 rounded text-center">No recent results.</p>
            )}
          </section>

        </div>

        {/* Standings Column */}
        <div className="space-y-8">
          {TableComponent && <TableComponent />}
          {ExtraTableComponent && <ExtraTableComponent />}
        </div>
      </div>
    </div>
  );
}
