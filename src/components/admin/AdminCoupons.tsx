import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Plus, Trash2, CheckCircle2, Percent, DollarSign } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, updateCoupon } = useStore();

  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(15);
  const [minSpend, setMinSpend] = useState<number>(100);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(200);
  const [note, setNote] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minSpend: minSpend > 0 ? Number(minSpend) : undefined,
      expiryDate,
      usageLimit: Number(usageLimit),
      isActive: true,
    });

    setCode('');
    setNote(`Privilege code "${code.toUpperCase()}" generated successfully.`);
    setTimeout(() => setNote(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Coupons &amp; Discount Rules
          </h1>
          <p className="text-xs text-[#78716C]">
            Create percentage discounts, fixed-value vouchers, and minimum purchase thresholds.
          </p>
        </div>
      </div>

      {note && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{note}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
        
        {/* Creation Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <h3 className="font-editorial text-base text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
            Issue New Privilege Code
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MAISON20"
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#44403C] font-semibold mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Dollar ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#44403C] font-semibold mb-1">
                  Value ({type === 'percentage' ? '%' : '$'}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full px-2.5 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#44403C] font-semibold mb-1">Minimum Spend ($)</label>
                <input
                  type="number"
                  min="0"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full px-2.5 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#44403C] font-semibold mb-1">Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  className="w-full px-2.5 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#44403C] font-semibold mb-1">Expiration Date</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Privilege Code</span>
            </button>
          </form>
        </div>

        {/* Existing Coupons Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E8E4DA]">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium">
              Active Privilege Codes ({coupons.length})
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px]">
                <th className="py-2.5 px-4">Code</th>
                <th className="py-2.5 px-4">Benefit</th>
                <th className="py-2.5 px-4">Min Spend</th>
                <th className="py-2.5 px-4">Usage</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF9F5]">
                  <td className="py-3 px-4 font-mono font-semibold text-[#1A1918]">
                    {c.code}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {c.type === 'percentage' ? `${c.value}% off` : `$${c.value} off`}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#57534E]">
                    {c.minSpend ? `$${c.minSpend}` : 'None'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#57534E]">
                    {c.timesUsed} / {c.usageLimit}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateCoupon(c.id, { isActive: !c.isActive })}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase cursor-pointer ${
                        c.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="p-1 text-[#78716C] hover:text-red-700 cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
