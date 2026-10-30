import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.js';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@magicalbooks.com');
  const [password, setPassword] = useState('MagicalBooks2026!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.token, data.user);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@magicalbooks.com');
    setPassword('MagicalBooks2026!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-sm border border-[#E4DFD5] shadow-sm p-8 space-y-6">
        
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">
            Starlight Press
          </span>
          <h1 className="font-display font-medium text-2xl text-[#17181C]">
            Admin CMS Login
          </h1>
          <p className="text-xs text-[#17181C]/60">
            Internal dashboard for print-on-demand orders, catalog &amp; pricing.
          </p>
        </div>

        {/* Demo Credential Card */}
        <div className="p-3.5 bg-[#F7F4EE] rounded-sm border border-[#E4DFD5] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#17181C] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#C45A2C]" />
              <span>Default Admin Account:</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-mono text-[11px] text-[#C45A2C] hover:underline cursor-pointer"
            >
              Autofill
            </button>
          </div>
          <p className="font-mono text-[11px] text-[#17181C]/70">
            Email: admin@magicalbooks.com<br />
            Password: MagicalBooks2026!
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#F7F4EE] border border-[#C45A2C] rounded-sm text-xs text-[#C45A2C] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#17181C]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#17181C]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm pl-9 pr-3.5 py-2 text-xs text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#17181C]">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#17181C]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm pl-9 pr-3.5 py-2 text-xs text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#C45A2C] hover:bg-[#AD4B22] disabled:opacity-50 text-white font-medium text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onNavigateHome}
            className="font-mono text-xs text-[#17181C]/50 hover:text-[#17181C] cursor-pointer"
          >
            ← Return to Storefront
          </button>
        </div>

      </div>
    </div>
  );
};
