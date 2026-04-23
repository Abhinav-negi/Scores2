export default function CricketStandings() {
  // Static mock standings to satisfy the mock requirement
  const mockStandings = [
    { team: 'India', pld: 10, w: 8, l: 2, pts: 16, nrr: '+1.50' },
    { team: 'Australia', pld: 10, w: 7, l: 3, pts: 14, nrr: '+1.20' },
    { team: 'England', pld: 10, w: 6, l: 4, pts: 12, nrr: '+0.85' },
    { team: 'South Africa', pld: 10, w: 5, l: 5, pts: 10, nrr: '+0.10' },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-brand-secondary bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-secondary bg-brand-secondary/30 px-4 py-3">
        <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider">World Test Championship</h3>
        <span className="rounded bg-brand-secondary/50 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-foreground/40 border border-brand-secondary">
          MOCK
        </span>
      </div>
      <table className="w-full text-left text-sm text-foreground/80">
        <thead className="bg-brand-secondary/10 text-xs uppercase text-foreground/50 border-b border-brand-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">Team</th>
            <th className="px-4 py-3 font-medium">Pld</th>
            <th className="px-4 py-3 font-medium">W</th>
            <th className="px-4 py-3 font-medium">L</th>
            <th className="px-4 py-3 font-medium text-brand-primary">Pts</th>
            <th className="px-4 py-3 font-medium">NRR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-secondary">
          {mockStandings.map((row, idx) => (
            <tr key={idx} className="transition-colors hover:bg-brand-secondary/20">
              <td className="px-4 py-3 font-medium text-foreground">{row.team}</td>
              <td className="px-4 py-3">{row.pld}</td>
              <td className="px-4 py-3">{row.w}</td>
              <td className="px-4 py-3">{row.l}</td>
              <td className="px-4 py-3 font-bold text-brand-primary">{row.pts}</td>
              <td className="px-4 py-3 tabular-nums">{row.nrr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
