import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, UpdateProfilePayload, UpdatePreferencesPayload, ChangePasswordPayload, DeleteAccountPayload } from '../lib/api/users.api';
import { toast } from 'sonner';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => usersApi.updateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePreferencesPayload) => usersApi.updatePreferences(payload),
    onSuccess: () => {
      toast.success('Preferences updated successfully');
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update preferences';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => usersApi.changePassword(payload),
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (payload: DeleteAccountPayload) => usersApi.deleteAccount(payload),
    onSuccess: () => {
      toast.success('Account deletion request submitted');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to request account deletion';
      toast.error(Array.isArray(message) ? message[0] : message);
    },
  });
}
