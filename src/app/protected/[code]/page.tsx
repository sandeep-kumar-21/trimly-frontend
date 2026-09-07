'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';
import { useVerifyLinkAccess } from '@/hooks/useVerifyLinkAccess';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProtectedLinkPage() {
  const params = useParams();
  const code = (params?.code as string) || '';
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyMutation = useVerifyLinkAccess(code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setErrorMessage(null);
    try {
      const res = await verifyMutation.mutateAsync(password);
      if (res.success && res.longUrl) {
        window.location.href = res.longUrl;
      } else {
        setErrorMessage('Invalid password. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Access denied. Incorrect password.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Protected Link
          </h1>
          <p className="text-sm text-slate-400">
            This short link is password protected. Enter the password to continue.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="link-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Link Password
            </label>
            <Input
              id="link-password"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 focus:border-[#2a5bd7] text-white"
              autoFocus
              required
            />
          </div>

          <Button
            type="submit"
            disabled={verifyMutation.isPending || !password.trim()}
            className="w-full bg-[#2a5bd7] hover:bg-[#1d4cc9] text-white font-bold py-2.5 rounded-md transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {verifyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Unlock & Access
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <span className="text-xs text-slate-500 font-mono">
            Trimly Secure Redirect
          </span>
        </div>
      </div>
    </div>
  );
}
