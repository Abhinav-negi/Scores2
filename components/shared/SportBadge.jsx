export default function SportBadge({ sport }) {
  const formatSport = (s) => {
    switch(s?.toLowerCase()) {
      case 'f1': return 'Formula 1';
      case 'nba': return 'Basketball';
      default: return s;
    }
  };

  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
      {formatSport(sport)}
    </span>
  );
}
