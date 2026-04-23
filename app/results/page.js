'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ResultCard from '@/components/shared/ResultCard';

const ALL_SPORTS = ['cricket', 'f1', 'basketball', 'tennis', 'chess'];

const fetchResults = async (sport) => {
  const response = await fetch(`/api/sports/${sport}?type=results`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await response.json();
  return json.data;
};

function ResultSection({ sport }) {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['results', sport],
    queryFn: () => fetchResults(sport),
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
  });

  if (isLoading) return <div className="py-4 text-xs text-foreground/50 animate-pulse">Loading {sport}...</div>;
  if (error) return null;

  if (!matches || matches.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-primary/50">{sport}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {matches.map(match => (
          <ResultCard key={match.id} sport={sport} match={match} />
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight text-brand-primary">
          Results
        </h1>
        <p className="mt-2 text-sm text-foreground/60">Recap of all matches completed within the last 24 hours.</p>
      </div>

      <div className="space-y-4">
        {ALL_SPORTS.map(sport => (
          <ResultSection key={sport} sport={sport} />
        ))}
      </div>
    </div>
  );
}
