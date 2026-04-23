'use client';

import Sidebar from '@/components/layout/Sidebar';
import { useSportsStore } from '@/store/useSportsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLiveScore } from '@/hooks/useLiveScore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

const COMPONENT_MAP = {
  cricket: { card: CricketScorecard, table: CricketStandings },
  f1: { card: null, table: F1DriverTable, extraTable: F1ConstructorTable },
  basketball: { card: BasketballBoxScore, table: BasketballStandings },
  tennis: { card: TennisMatchCard, table: TennisRankings },
  chess: { card: ChessResultsCard, table: ChessTournamentTable },
};

function SportSection({ sport }) {
  const { data: matches, isLoading, error } = useLiveScore(sport);
  
  const components = COMPONENT_MAP[sport];
  const CardComponent = components?.card;
  const TableComponent = components?.table;
  const ExtraTableComponent = components?.extraTable;

  if (isLoading) return <div className="py-8 text-center text-sm text-foreground/50 animate-pulse">Loading {sport}...</div>;
  if (error) return <div className="py-8 text-center text-sm text-red-500">Failed to load {sport}</div>;

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold capitalize text-brand-primary border-b border-brand-secondary pb-2">{sport}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-widest mb-4">Latest & Live Matches</h3>
          {matches?.length > 0 ? (
            matches.map(match => {
              if (CardComponent) {
                return <CardComponent key={match.id} match={match} />;
              }
              // Fallback if F1 which doesn't really have a "card" right now
              return null;
            })
          ) : (
            <p className="text-sm text-foreground/50 italic border border-dashed border-brand-secondary p-6 rounded text-center">No active matches found.</p>
          )}
        </div>
        
        <div className="space-y-8">
          {TableComponent && <TableComponent />}
          {ExtraTableComponent && <ExtraTableComponent />}
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { user, isLoading, fetchSession } = useAuthStore();
  const { selectedSports } = useSportsStore();
  const router = useRouter();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-secondary border-t-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Your Feed</h1>
          <p className="mt-2 text-sm text-foreground/60">Curated updates for {user.email}</p>
        </div>
        
        {selectedSports.length === 0 ? (
          <div className="rounded-lg border border-dashed border-brand-secondary p-12 text-center">
            <h3 className="text-lg font-medium text-brand-primary">No sports selected</h3>
            <p className="mt-2 text-sm text-foreground/60">Use the sidebar filter to select sports for your feed.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {selectedSports.map(sport => (
              <SportSection key={sport} sport={sport} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
