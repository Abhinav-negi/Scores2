import SportBadge from './SportBadge';
import FavouriteToggle from './FavouriteToggle';

export default function MatchCard({ sport, match }) {
  // Extract common normalised fields
  const { id, status, homeTeam, awayTeam, extra } = match;

  const isLive = status === 'live';
  
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden border-b border-brand-secondary bg-background p-4 transition-colors hover:bg-brand-secondary/10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SportBadge sport={sport} />
          {isLive && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-brand-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent"></span>
              </span>
              LIVE
            </span>
          )}
          {status === 'finished' && <span className="text-xs font-medium text-foreground/50 uppercase">Final</span>}
          {match.isMock && (
            <span className="rounded bg-brand-secondary/50 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-foreground/40 border border-brand-secondary">
              MOCK
            </span>
          )}
        </div>
        <FavouriteToggle sport={sport} type="match" externalId={id} name={`${homeTeam.name} vs ${awayTeam.name}`} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground text-sm sm:text-base">{homeTeam.name}</span>
          <span className={`font-bold tabular-nums ${isLive ? 'text-brand-accent' : 'text-foreground'}`}>
            {homeTeam.score}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground text-sm sm:text-base">{awayTeam.name}</span>
          <span className={`font-bold tabular-nums ${isLive ? 'text-brand-accent' : 'text-foreground'}`}>
            {awayTeam.score}
          </span>
        </div>
      </div>

      {extra && Object.keys(extra).length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-foreground/50 border-t border-brand-secondary/50 pt-2">
          {Object.entries(extra).map(([key, value]) => (
            value ? <span key={key}>{value}</span> : null
          ))}
        </div>
      )}
    </div>
  );
}
