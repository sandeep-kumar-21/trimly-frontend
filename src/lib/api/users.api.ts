import { apiClient } from './client';

export interface UpdateProfilePayload {
  name?: string;
  avatarUrl?: string | null;
}

export interface UpdatePreferencesPayload {
  theme?: string;
  timezone?: string;
  notificationsEnabled?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface ExportDataJobResponse {
  jobId: string;
  status: 'pending' | 'completed' | 'failed';
  result?: any;
  message?: string;
}

export const usersApi = {
  updateProfile: async (payload: UpdateProfilePayload) => {
    const response = await apiClient.patch('/users/profile', payload);
    return response.data;
  },

  updatePreferences: async (payload: UpdatePreferencesPayload) => {
    const response = await apiClient.patch('/users/preferences', payload);
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await apiClient.post('/users/change-password', payload);
    return response.data;
  },

  triggerDataExport: async (): Promise<{ jobId: string; status: string; message: string }> => {
    const response = await apiClient.get('/users/export-data');
    return response.data;
  },

  checkExportStatus: async (jobId: string): Promise<ExportDataJobResponse> => {
    const response = await apiClient.get(`/users/export-data/${jobId}`);
    return response.data;
  },

  deleteAccount: async (payload: DeleteAccountPayload): Promise<{ jobId: string; message: string }> => {
    const response = await apiClient.delete('/users/account', { data: payload });
    return response.data;
  },
};
