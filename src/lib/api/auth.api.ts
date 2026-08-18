import { apiClient, setAuthToken } from './client';
import { User, AuthResponse } from '@/types/user.types';
import { LoginFormData, RegisterFormData } from '@/lib/validators/auth.schema';

export const authApi = {
  async register(data: RegisterFormData): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
    });
    if (res.data.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    return res.data;
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    if (res.data.accessToken) {
      setAuthToken(res.data.accessToken);
    }
    return res.data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await apiClient.get<{ user: User }>('/auth/me');
    return res.data;
  },

  async logout(): Promise<void> {
    setAuthToken(null);
  },
};
