import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Search, UserCheck, UserX, Mail, Phone, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/ecommerceCalculations';

export const AdminCustomers: React.FC = () => {
  const { customers, orders, updateCustomerStatus, currency, storeSettings } = useStore();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Client Directory &amp; Accounts
          </h1>
          <p className="text-xs text-[#78716C]">
            Total {customers.length} registered salon clients with audited acquisition histories.
          </p>
        </div>

        <div className="relative max-w-xs w-full text-xs">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#DDD5C5] rounded-md focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px]">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Orders Count</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.map((c) => {
                const clientOrders = orders.filter(
                  (o) => o.customer.email.toLowerCase() === c.email.toLowerCase()
                );
                const actualTotalSpent = clientOrders
                  .filter((o) => o.paymentStatus === 'paid')
                  .reduce((sum, o) => sum + o.total, 0);

                return (
                  <tr key={c.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#1A1918]">{c.fullName}</div>
                      <span className="text-[10px] text-[#78716C]">ID: {c.id}</span>
                    </td>
                    <td className="py-3 px-4 text-[#57534E]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#9A7B4F]" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[#78716C]">
                        <Phone className="w-3.5 h-3.5 text-[#9A7B4F]" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#57534E]">
                      {new Date(c.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {clientOrders.length} order(s)
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#1A1918] tabular-nums">
                      {formatCurrency(actualTotalSpent, currency, storeSettings.exchangeRateUsdToBdt)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                          c.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.status === 'active' ? (
                        <button
                          onClick={() => updateCustomerStatus(c.id, 'suspended')}
                          className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded text-[11px] font-medium cursor-pointer"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => updateCustomerStatus(c.id, 'active')}
                          className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded text-[11px] font-medium cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
