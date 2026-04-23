export default function ChessTournamentTable() {
  const mockTournaments = [
    { name: 'Candidates Tournament 2026', format: 'Double Round-Robin', timeControl: '90+30' },
    { name: 'Titled Tuesday Blitz', format: 'Swiss System', timeControl: '3+1' },
    { name: 'World Rapid Championship', format: 'Swiss System', timeControl: '15+10' },
    { name: 'Tata Steel Masters', format: 'Round-Robin', timeControl: '100+30' },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-brand-secondary bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-secondary bg-brand-secondary/30 px-4 py-3">
        <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Top Tournaments</h3>
        <span className="rounded bg-brand-secondary/50 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-foreground/40 border border-brand-secondary">
          MOCK
        </span>
      </div>
      <table className="w-full text-left text-sm text-foreground/80">
        <thead className="bg-brand-secondary/10 text-xs uppercase text-foreground/50 border-b border-brand-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">Event Name</th>
            <th className="px-4 py-3 font-medium">Format</th>
            <th className="px-4 py-3 font-medium text-right">Time Control</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-secondary">
          {mockTournaments.map((row, idx) => (
            <tr key={idx} className="transition-colors hover:bg-brand-secondary/20">
              <td className="px-4 py-3 font-semibold text-foreground">{row.name}</td>
              <td className="px-4 py-3">{row.format}</td>
              <td className="px-4 py-3 text-right tabular-nums text-foreground/60">{row.timeControl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
