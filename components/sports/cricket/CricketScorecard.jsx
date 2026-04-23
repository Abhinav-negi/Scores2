import MatchCard from '@/components/shared/MatchCard';

export default function CricketScorecard({ match }) {
  // We wrap the standard MatchCard but we can augment it with cricket specific styling if needed.
  // For now, it delegates to the shared component since the shared component handles the `extra` metadata.
  return (
    <div className="cricket-scorecard">
      <MatchCard sport="cricket" match={match} />
    </div>
  );
}
