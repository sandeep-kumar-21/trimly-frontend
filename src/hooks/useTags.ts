import { useQuery } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';

export function useTags() {
  const { data: tags = [], isLoading, isError, error, refetch } = useQuery<string[]>({
    queryKey: ['tags'],
    queryFn: () => linksApi.getTags(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    tags,
    isLoading,
    isError,
    error,
    refetch,
  };
}
