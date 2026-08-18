import { apiClient } from './client';
import { ShortLink, CreateLinkPayload, UpdateLinkPayload } from '@/types/link.types';

export const linksApi = {
  async getUserLinks(options?: {
    tags?: string[];
    linkType?: 'all' | 'custom' | 'auto';
    qrAttachment?: 'all' | 'with' | 'without';
  } | string[]): Promise<ShortLink[]> {
    const params = new URLSearchParams();
    if (Array.isArray(options)) {
      if (options.length > 0) {
        params.append('tags', options.join(','));
      }
    } else if (options) {
      if (options.tags && options.tags.length > 0) {
        params.append('tags', options.tags.join(','));
      }
      if (options.linkType && options.linkType !== 'all') {
        params.append('linkType', options.linkType);
      }
      if (options.qrAttachment && options.qrAttachment !== 'all') {
        params.append('qrAttachment', options.qrAttachment);
      }
    }
    const queryStr = params.toString();
    const res = await apiClient.get<ShortLink[]>(queryStr ? `/urls?${queryStr}` : '/urls');
    return res.data;
  },

  async getLinkByCode(code: string): Promise<ShortLink> {
    const res = await apiClient.get<ShortLink>(`/urls/${code}`);
    return res.data;
  },

  async createLink(payload: CreateLinkPayload): Promise<ShortLink> {
    const res = await apiClient.post<ShortLink>('/urls', payload);
    return res.data;
  },

  async promoteToLink(code: string): Promise<ShortLink> {
    const res = await apiClient.post<ShortLink>(`/urls/${code}/promote-to-link`);
    return res.data;
  },

  async editBackHalf(
    code: string,
    payload: { customAlias: string; longUrl?: string; title?: string; tags?: string[] },
  ): Promise<ShortLink> {
    const res = await apiClient.post<ShortLink>(`/urls/${code}/edit-back-half`, payload);
    return res.data;
  },

  async updateLink(code: string, payload: UpdateLinkPayload): Promise<ShortLink> {
    const res = await apiClient.patch<ShortLink>(`/urls/${code}`, payload);
    return res.data;
  },

  async deleteLink(code: string): Promise<void> {
    await apiClient.delete(`/urls/${code}`);
  },

  async getTags(): Promise<string[]> {
    const res = await apiClient.get<string[]>('/urls/tags');
    return res.data;
  },

  async bulkUpdateTags(payload: { linkIds: string[]; addTags?: string[]; removeTags?: string[] }): Promise<ShortLink[]> {
    const res = await apiClient.patch<ShortLink[]>('/urls/bulk-tags', payload);
    return res.data;
  },

  async bulkHideLinks(payload: { linkIds: string[]; isHidden: boolean }): Promise<ShortLink[]> {
    const res = await apiClient.patch<ShortLink[]>('/urls/bulk-hide', payload);
    return res.data;
  },
};
