export default function BasketballStandings() {
  const mockStandings = [
    { pos: 1, team: 'Boston Celtics', w: 64, l: 18, pct: '.780', gb: '-' },
    { pos: 2, team: 'New York Knicks', w: 50, l: 32, pct: '.610', gb: '14.0' },
    { pos: 3, team: 'Milwaukee Bucks', w: 49, l: 33, pct: '.598', gb: '15.0' },
    { pos: 4, team: 'Cleveland Cavaliers', w: 48, l: 34, pct: '.585', gb: '16.0' },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-brand-secondary bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-secondary bg-brand-secondary/30 px-4 py-3">
        <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Eastern Conference</h3>
        <span className="rounded bg-brand-secondary/50 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-foreground/40 border border-brand-secondary">
          MOCK
        </span>
      </div>
      <table className="w-full text-left text-sm text-foreground/80">
        <thead className="bg-brand-secondary/10 text-xs uppercase text-foreground/50 border-b border-brand-secondary">
          <tr>
            <th className="px-4 py-3 font-medium w-12">Pos</th>
            <th className="px-4 py-3 font-medium">Team</th>
            <th className="px-4 py-3 font-medium text-right">W</th>
            <th className="px-4 py-3 font-medium text-right">L</th>
            <th className="px-4 py-3 font-medium text-right">PCT</th>
            <th className="px-4 py-3 font-medium text-right">GB</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-secondary">
          {mockStandings.map((row) => (
            <tr key={row.pos} className="transition-colors hover:bg-brand-secondary/20">
              <td className="px-4 py-3 font-medium text-foreground/50">{row.pos}</td>
              <td className="px-4 py-3 font-semibold text-foreground">{row.team}</td>
              <td className="px-4 py-3 text-right">{row.w}</td>
              <td className="px-4 py-3 text-right">{row.l}</td>
              <td className="px-4 py-3 text-right">{row.pct}</td>
              <td className="px-4 py-3 text-right">{row.gb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
