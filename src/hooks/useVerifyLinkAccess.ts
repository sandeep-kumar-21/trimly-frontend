import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { toast } from 'sonner';

export interface VerifyPasswordResponse {
  success: boolean;
  longUrl: string;
}

export function useVerifyLinkAccess(code: string) {
  return useMutation({
    mutationFn: async (password: string) => {
      const response = await apiClient.post<VerifyPasswordResponse>(`/urls/${code}/verify-password`, {
        password,
      });
      return response.data;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid password';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}
