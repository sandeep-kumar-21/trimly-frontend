import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In — Trimly',
  description: 'Log in to your Trimly link management dashboard.',
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to manage your links and view performance analytics"
      footerText="Don't have an account?"
      footerLinkText="Create one for free"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthCard>
  );
}
