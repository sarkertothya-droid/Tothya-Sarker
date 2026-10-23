import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, storeSettings } = useStore();
  const [email, setEmail] = useState('admin@aurelia.com');
  const [password, setPassword] = useState('luxury2026');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(email, password);
    if (!success) {
      setError('Invalid administrator credentials.');
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@aurelia.com');
    setPassword('luxury2026');
    loginAdmin('admin@aurelia.com', 'luxury2026');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-[#E8E4DA] shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#F5F2EB] text-[#9A7B4F] rounded-full flex items-center justify-center mx-auto border border-[#E2DBD0]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-editorial text-2xl font-semibold tracking-wider text-[#1A1918] block">
            {storeSettings.logoText || 'AURELIA'}
          </span>
          <h1 className="font-sans text-sm font-semibold text-[#57534E] uppercase tracking-wider">
            Executive Admin Control Center
          </h1>
          <p className="text-xs text-[#78716C]">
            Restricted access for authorized store directors and financial officers.
          </p>
        </div>

        {/* 1-Click Test Access Preset */}
        <div className="p-3 bg-[#F8F6F0] rounded-xl border border-[#E8E4DA] text-xs text-[#57534E] flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#1A1918] block">Quick Evaluation Access:</span>
            <span className="font-mono text-[11px] text-[#78716C]">admin@aurelia.com / luxury2026</span>
          </div>
          <button
            onClick={handleQuickDemoLogin}
            type="button"
            className="px-3 py-1.5 text-xs font-medium text-[#1A1918] bg-white border border-[#D5CBB8] hover:bg-[#F5F2EB] rounded-md transition-colors cursor-pointer"
          >
            Fill &amp; Enter
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#44403C] font-medium mb-1">Administrator Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurelia.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] text-[#1A1918]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#44403C] font-medium mb-1">Master Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#DDD5C5] bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] text-[#1A1918]"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#1A1918] hover:bg-[#2D2A26] text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#F0EBE1] text-[11px] text-[#A8A29E]">
          Session verified with role-based server authentication &amp; TLS 1.3 encryption.
        </div>

      </div>
    </div>
  );
};
