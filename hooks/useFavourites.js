import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchFavourites = async () => {
  const response = await fetch('/api/favourites');
  if (!response.ok) {
    throw new Error('Failed to fetch favourites');
  }
  const json = await response.json();
  return json.data;
};

const addFavourite = async (favouriteData) => {
  const response = await fetch('/api/favourites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favouriteData),
  });
  if (!response.ok) {
    throw new Error('Failed to add favourite');
  }
  return response.json();
};

const removeFavourite = async (id) => {
  const response = await fetch(`/api/favourites/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove favourite');
  }
  return response.json();
};

export function useFavourites() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['favourites'],
    queryFn: fetchFavourites,
    staleTime: 60000, // 1 minute
  });

  const addMutation = useMutation({
    mutationFn: addFavourite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavourite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });

  return {
    favourites: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    addFavourite: addMutation.mutate,
    removeFavourite: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
