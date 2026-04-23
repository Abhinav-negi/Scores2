import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // { id, email }
  isLoading: true, // Initially true until we verify the session on mount
  
  setUser: (userData) => set({ user: userData, isLoading: false }),
  
  clearUser: () => set({ user: null, isLoading: false }),

  // Call this once on app initialization to fetch the session from our /api/auth/me route
  fetchSession: async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      set({ user: null, isLoading: false });
    }
  }
}));
