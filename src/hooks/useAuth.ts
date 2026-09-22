import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth.api';
import { LoginFormData, RegisterFormData } from '@/lib/validators/auth.schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await authApi.getMe();
        return response.user;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => authApi.login(credentials),
    onSuccess: (res) => {
      queryClient.setQueryData(['auth', 'me'], res.user);
      toast.success('Welcome back to Trimly!', {
        description: `Logged in as ${res.user.email}`,
      });
      router.push('/home');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Invalid email or password';
      toast.error('Authentication Failed', { description: message });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: (res) => {
      queryClient.setQueryData(['auth', 'me'], res.user);
      toast.success('Account created successfully!', {
        description: 'Welcome to Trimly',
      });
      router.push('/home');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Registration failed. Try a different email.';
      toast.error('Registration Error', { description: message });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
      toast.info('Logged out successfully');
      window.location.href = '/';
    },
  });

  return {
    user: data || null,
    isAuthenticated: !!data,
    isLoading,
    isError,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
  };
}
