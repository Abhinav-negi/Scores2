'use client';

import { useSportsStore } from '@/store/useSportsStore';
import { cn } from '@/lib/utils'; // wait, I don't have this yet. I'll just use template literals.

const SPORTS = [
  { id: 'cricket', label: 'Cricket' },
  { id: 'f1', label: 'Formula 1' },
  { id: 'basketball', label: 'Basketball' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'chess', label: 'Chess' },
];

export default function SportFilter() {
  const { selectedSports, toggleSport } = useSportsStore();

  return (
    <div className="flex flex-col gap-1 py-4">
      <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-brand-primary/50">
        My Sports
      </h3>
      <nav className="flex flex-col gap-1">
        {SPORTS.map((sport) => {
          const isActive = selectedSports.includes(sport.id);
          return (
            <button
              key={sport.id}
              onClick={() => toggleSport(sport.id)}
              className={`flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-secondary/50 text-left ${
                isActive 
                  ? 'border-l-2 border-brand-accent text-brand-primary bg-brand-secondary/20' 
                  : 'border-l-2 border-transparent text-foreground/70 hover:text-brand-primary'
              }`}
            >
              {sport.label}
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
