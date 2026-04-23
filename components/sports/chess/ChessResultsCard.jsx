import MatchCard from '@/components/shared/MatchCard';

export default function ChessResultsCard({ match }) {
  // Wrap the generic MatchCard. The home/away scores in chess are usually 1, 0, or 1/2.
  return (
    <div className="chess-results-card">
      <MatchCard sport="chess" match={match} />
    </div>
  );
}
