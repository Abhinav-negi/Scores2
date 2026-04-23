import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSportsStore = create(
  persist(
    (set) => ({
      selectedSports: ['cricket', 'f1', 'basketball', 'tennis', 'chess'], // Default to all
      
      toggleSport: (sport) => set((state) => {
        if (state.selectedSports.includes(sport)) {
          return { selectedSports: state.selectedSports.filter((s) => s !== sport) };
        } else {
          return { selectedSports: [...state.selectedSports, sport] };
        }
      }),

      setSports: (sportsArray) => set({ selectedSports: sportsArray }),
    }),
    {
      name: 'sports-preferences-storage', // saves to localStorage so preferences persist across reloads
    }
  )
);
