'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useFavourites } from '@/hooks/useFavourites';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import SportBadge from '@/components/shared/SportBadge';

export default function SettingsPage() {
  const { user, isLoading: authLoading, fetchSession } = useAuthStore();
  const { favourites, isLoading: favLoading, removeFavourite } = useFavourites();
  const router = useRouter();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-secondary border-t-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8 border-b border-brand-secondary pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-brand-primary">
          Settings
        </h1>
        <p className="mt-2 text-sm text-foreground/60">Manage your account and preferences.</p>
      </div>

      <div className="space-y-12">
        {/* Account Info Section */}
        <section>
          <h2 className="text-xl font-semibold text-brand-primary mb-4">Account Information</h2>
          <div className="rounded-lg border border-brand-secondary bg-background p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/50 uppercase tracking-wider mb-1">Email Address</label>
                <div className="text-sm font-medium text-foreground">{user.email}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/50 uppercase tracking-wider mb-1">Account ID</label>
                <div className="text-sm font-mono text-foreground/70">{user.id}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Favourites Section */}
        <section>
          <h2 className="text-xl font-semibold text-brand-primary mb-4">Your Favourites</h2>
          
          {favLoading ? (
            <div className="py-4 text-xs text-foreground/50 animate-pulse">Loading favourites...</div>
          ) : favourites?.length === 0 ? (
            <div className="rounded-lg border border-dashed border-brand-secondary p-12 text-center">
              <h3 className="text-lg font-medium text-brand-primary">No favourites yet</h3>
              <p className="mt-2 text-sm text-foreground/60">Click the star icon on any match to add it here.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-brand-secondary bg-background shadow-sm">
              <ul className="divide-y divide-brand-secondary">
                {favourites?.map((fav) => (
                  <li key={fav._id} className="flex items-center justify-between p-4 transition-colors hover:bg-brand-secondary/10">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <SportBadge sport={fav.sport} />
                        <span className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider">{fav.type}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{fav.name}</p>
                    </div>
                    <button
                      onClick={() => removeFavourite(fav._id)}
                      className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Remove favourite"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
