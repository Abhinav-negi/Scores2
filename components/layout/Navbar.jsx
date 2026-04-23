'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearUser();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-secondary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            {/* The Athletic inspired bold minimal logo */}
            <span className="font-sans text-xl font-bold tracking-tight text-brand-primary">
              SportsFeed.
            </span>
          </Link>
          {user && (
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/dashboard" className="text-foreground transition-colors hover:text-brand-accent">Dashboard</Link>
              <Link href="/tracker" className="text-foreground transition-colors hover:text-brand-accent">Live Tracker</Link>
              <Link href="/results" className="text-foreground transition-colors hover:text-brand-accent">Results</Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/settings" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand-accent transition-colors">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline-block">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand-accent transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-brand-accent">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-primary px-4 py-1.5 text-sm font-medium text-background hover:bg-brand-primary/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
