import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account — Trimly',
  description: 'Register for a new Trimly link management account.',
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Get Started with Trimly"
      subtitle="Shorten URLs, track click analytics, and manage links with ease"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthCard>
  );
}
