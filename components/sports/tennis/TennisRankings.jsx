export default function TennisRankings() {
  const mockStandings = [
    { pos: 1, player: 'J. Sinner', pts: 8770 },
    { pos: 2, player: 'N. Djokovic', pts: 8460 },
    { pos: 3, player: 'C. Alcaraz', pts: 8130 },
    { pos: 4, player: 'A. Zverev', pts: 6815 },
    { pos: 5, player: 'D. Medvedev', pts: 6525 },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-brand-secondary bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-secondary bg-brand-secondary/30 px-4 py-3">
        <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">ATP Rankings</h3>
        <span className="rounded bg-brand-secondary/50 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-foreground/40 border border-brand-secondary">
          MOCK
        </span>
      </div>
      <table className="w-full text-left text-sm text-foreground/80">
        <thead className="bg-brand-secondary/10 text-xs uppercase text-foreground/50 border-b border-brand-secondary">
          <tr>
            <th className="px-4 py-3 font-medium w-12">Rk</th>
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 font-medium text-brand-primary text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-secondary">
          {mockStandings.map((row) => (
            <tr key={row.pos} className="transition-colors hover:bg-brand-secondary/20">
              <td className="px-4 py-3 font-medium text-foreground/50">{row.pos}</td>
              <td className="px-4 py-3 font-semibold text-foreground">{row.player}</td>
              <td className="px-4 py-3 font-bold text-brand-primary text-right">{row.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
