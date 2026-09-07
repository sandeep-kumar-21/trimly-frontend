import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qrcodesApi, CreateQrCodePayload } from '../lib/api/qrcodes.api';
import { toast } from 'sonner';

export const QRCODES_QUERY_KEY = ['qrcodes'];

export interface UseQrCodesOptions {
  qrExpiration?: 'all' | 'expired' | 'expiring' | 'none';
  linkAttachment?: 'all' | 'with' | 'without';
}

export function useUserQrCodes(options?: UseQrCodesOptions) {
  return useQuery({
    queryKey: ['qrcodes', options || {}],
    queryFn: () => qrcodesApi.getUserQrCodes(options),
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useQrCodeDetails(code: string) {
  return useQuery({
    queryKey: ['qrcodes', code, 'details'],
    queryFn: () => qrcodesApi.getQrCodeDetails(code),
    enabled: !!code,
    staleTime: 1000 * 30,
  });
}

export function useCreateQrCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQrCodePayload) => qrcodesApi.createQrCode(payload),
    onSuccess: (data) => {
      toast.success('QR Code saved successfully!');
      if (data?.qrCode) {
        queryClient.setQueriesData({ queryKey: QRCODES_QUERY_KEY }, (old: any = []) => {
          if (!Array.isArray(old)) return [data.qrCode];
          return [data.qrCode, ...old.filter((q: any) => (q.id || q._id || q.shortCode) !== (data.qrCode.id || data.qrCode._id || data.qrCode.shortCode))];
        });
      }
      queryClient.invalidateQueries({ queryKey: QRCODES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['link'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to save QR Code';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}

export function useDeleteQrCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => qrcodesApi.deleteQrCode(code),
    onSuccess: () => {
      toast.success('QR Code configuration deleted');
      queryClient.invalidateQueries({ queryKey: QRCODES_QUERY_KEY });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete QR Code';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}

export function useUpdateQrCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: { isHidden?: boolean } }) => qrcodesApi.updateQrCode(code, payload),
    onSuccess: () => {
      toast.success('QR Code updated successfully!');
      queryClient.invalidateQueries({ queryKey: QRCODES_QUERY_KEY });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update QR Code';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}

export function useDuplicateQrCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, targetShortCode }: { code: string; targetShortCode: string }) => qrcodesApi.duplicateQrCode(code, targetShortCode),
    onSuccess: () => {
      toast.success('QR Code design duplicated successfully!');
      queryClient.invalidateQueries({ queryKey: QRCODES_QUERY_KEY });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to duplicate QR Code';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}
