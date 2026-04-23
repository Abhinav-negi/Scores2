import MatchCard from '@/components/shared/MatchCard';

export default function BasketballBoxScore({ match }) {
  // Wraps MatchCard, inheriting the MOCK tag logic from MatchCard if match.isMock is true
  return (
    <div className="basketball-box-score">
      <MatchCard sport="basketball" match={match} />
    </div>
  );
}
