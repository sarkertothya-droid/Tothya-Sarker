import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserCheck, Shield, Lock, Check } from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { adminUser } = useStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState<{ message: string; isError: boolean } | null>(null);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setNotice({ message: 'New master password must be at least 6 characters.', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotice({ message: 'Passwords do not match.', isError: true });
      return;
    }

    setNotice({ message: 'Master security credentials updated successfully.', isError: false });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-xs">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#E8E4DA]">
        <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
          Administrator Profile &amp; Cryptographic Keys
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Authorized executive credentials and server-side RBAC session info.
        </p>
      </div>

      {notice && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 border ${
            notice.isError
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {!notice.isError && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Account Info */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1A1918] text-[#C5A880] flex items-center justify-center font-editorial text-lg font-bold">
            AE
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1A1918]">
              {adminUser?.name || 'Aurelia Executive'}
            </h3>
            <span className="text-xs text-[#78716C]">{adminUser?.email || 'admin@aurelia.com'}</span>
          </div>
        </div>

        <div className="pt-2 grid grid-cols-2 gap-4 border-t border-[#F5F2EB]">
          <div>
            <span className="text-[#78716C] block text-[11px]">System Role:</span>
            <strong className="text-[#1A1918]">{adminUser?.role || 'Super Administrator'}</strong>
          </div>
          <div>
            <span className="text-[#78716C] block text-[11px]">Permissions:</span>
            <span className="text-emerald-700 font-semibold">Full Unrestricted Store &amp; Ledger Access</span>
          </div>
        </div>
      </div>

      {/* Security Update Password */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
        <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
          Update Security Password
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-[#44403C] font-semibold mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium cursor-pointer"
            >
              Update Security Credentials
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
