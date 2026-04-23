import MatchCard from './MatchCard';

export default function ResultCard({ sport, match }) {
  // A wrapper that could have specialized results styling in the future.
  // For now, it leverages the same clean aesthetic as MatchCard 
  // but we can append a completed timestamp.
  
  const formattedDate = match.completedAt 
    ? new Date(match.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="relative">
      <MatchCard sport={sport} match={match} />
      {formattedDate && (
        <div className="absolute top-4 right-12 text-[10px] font-medium text-foreground/40">
          {formattedDate}
        </div>
      )}
    </div>
  );
}
