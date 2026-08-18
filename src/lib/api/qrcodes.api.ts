import { apiClient } from './client';

export interface QrConfigPayload {
  dotsStyle?: string;
  cornersStyle?: string;
  cornersDotStyle?: string;
  dotsColor?: string;
  backgroundColor?: string;
  logoUrl?: string | null;
  centerText?: string | null;
}

export interface CreateQrCodePayload {
  shortCode?: string;
  longUrl?: string;
  title?: string;
  tags?: string[];
  createLink?: boolean;
  qrConfig: QrConfigPayload;
}

export interface QrCodeResponse {
  _id: string;
  id?: string;
  userId: string;
  shortCode: string;
  qrConfig: QrConfigPayload;
  createdAt: string;
  title?: string | null;
  destinationUrl?: string | null;
  tags?: string[];
  visibleAsLink?: boolean;
  isHidden?: boolean;
  shortUrl?: string | null;
  longUrl?: string | null;
  expiresAt?: string | null;
  svg?: string | null;
  svgUrl?: string | null;
}

export const qrcodesApi = {
  createQrCode: async (payload: CreateQrCodePayload): Promise<{ qrCode: QrCodeResponse; imageBase64: string }> => {
    const response = await apiClient.post<{ qrCode: QrCodeResponse; imageBase64: string }>('/qrcodes', payload);
    return response.data;
  },

  getUserQrCodes: async (options?: {
    qrExpiration?: 'all' | 'expired' | 'expiring' | 'none';
    linkAttachment?: 'all' | 'with' | 'without';
  }): Promise<QrCodeResponse[]> => {
    const params = new URLSearchParams();
    if (options?.qrExpiration && options.qrExpiration !== 'all') {
      params.append('qrExpiration', options.qrExpiration);
    }
    if (options?.linkAttachment && options.linkAttachment !== 'all') {
      params.append('linkAttachment', options.linkAttachment);
    }
    const queryStr = params.toString();
    const response = await apiClient.get<QrCodeResponse[]>(queryStr ? `/qrcodes?${queryStr}` : '/qrcodes');
    return response.data;
  },

  getQrCodeImageBlob: async (code: string, format: 'png' | 'svg' = 'png'): Promise<Blob> => {
    const response = await apiClient.get<Blob>(`/qrcodes/${code}?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getQrCodeDetails: async (code: string): Promise<QrCodeResponse> => {
    const response = await apiClient.get<QrCodeResponse>(`/qrcodes/${code}/details`);
    return response.data;
  },

  deleteQrCode: async (code: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/qrcodes/${code}`);
    return response.data;
  },

  updateQrCode: async (code: string, payload: { isHidden?: boolean }): Promise<QrCodeResponse> => {
    const response = await apiClient.patch<QrCodeResponse>(`/qrcodes/${code}`, payload);
    return response.data;
  },

  duplicateQrCode: async (code: string, targetShortCode: string): Promise<{ qrCode: QrCodeResponse; imageBase64: string }> => {
    const response = await apiClient.post<{ qrCode: QrCodeResponse; imageBase64: string }>(`/qrcodes/${code}/duplicate`, { targetShortCode });
    return response.data;
  },
};
