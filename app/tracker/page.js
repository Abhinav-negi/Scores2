'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useLiveScore } from '@/hooks/useLiveScore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import MatchCard from '@/components/shared/MatchCard';

const ALL_SPORTS = ['cricket', 'f1', 'basketball', 'tennis', 'chess'];

function TrackerSection({ sport }) {
  const { data: matches, isLoading, error } = useLiveScore(sport);

  if (isLoading) return <div className="py-4 text-xs text-foreground/50 animate-pulse">Loading {sport}...</div>;
  if (error) return null; // Fail silently on tracker to not clutter the live feed

  const liveMatches = matches?.filter(m => m.status === 'live') || [];

  if (liveMatches.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-primary/50">{sport}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {liveMatches.map(match => (
          <MatchCard key={match.id} sport={sport} match={match} />
        ))}
      </div>
    </div>
  );
}

export default function TrackerPage() {
  const { user, isLoading, fetchSession } = useAuthStore();
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
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b border-brand-secondary pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
          Live Tracker
          <span className="relative flex h-3 w-3 mt-1">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-accent"></span>
          </span>
        </h1>
        <p className="mt-2 text-sm text-foreground/60">Real-time un-filtered action across all networks.</p>
      </div>

      <div className="space-y-4">
        {ALL_SPORTS.map(sport => (
          <TrackerSection key={sport} sport={sport} />
        ))}
      </div>
    </div>
  );
}
