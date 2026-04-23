import MatchCard from '@/components/shared/MatchCard';

export default function TennisMatchCard({ match }) {
  // Tennis specific styling can be added here, but for now we wrap the generic MatchCard
  return (
    <div className="tennis-match-card">
      <MatchCard sport="tennis" match={match} />
    </div>
  );
}
