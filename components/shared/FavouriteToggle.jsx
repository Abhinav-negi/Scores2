'use client';

import { Star } from 'lucide-react';
import { useFavourites } from '@/hooks/useFavourites';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';

export default function FavouriteToggle({ sport, type, externalId, name }) {
  const { user } = useAuthStore();
  const { favourites, addFavourite, removeFavourite, isAdding, isRemoving } = useFavourites();
  
  // Find if this specific item is already favourited
  const existingFavourite = favourites?.find(
    (fav) => fav.sport === sport && fav.type === type && fav.externalId === String(externalId)
  );

  const isFavourited = !!existingFavourite;
  const isLoading = isAdding || isRemoving;

  // Local optimistic state for snappier UI
  const [optimisticFav, setOptimisticFav] = useState(isFavourited);

  useEffect(() => {
    setOptimisticFav(isFavourited);
  }, [isFavourited]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Could trigger a login modal here, but for now we just alert
      alert('Please log in to add favourites.');
      return;
    }

    setOptimisticFav(!optimisticFav);

    try {
      if (isFavourited) {
        await removeFavourite(existingFavourite._id);
      } else {
        await addFavourite({ sport, type, externalId: String(externalId), name });
      }
    } catch (error) {
      // Revert on failure
      setOptimisticFav(isFavourited);
      console.error('Failed to toggle favourite', error);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-1.5 transition-colors rounded hover:bg-brand-secondary/50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={optimisticFav ? "Remove from favourites" : "Add to favourites"}
    >
      <Star 
        className={`h-4 w-4 transition-all ${
          optimisticFav 
            ? 'fill-brand-accent text-brand-accent scale-110' 
            : 'text-foreground/40 hover:text-foreground/70'
        }`} 
      />
    </button>
  );
}
