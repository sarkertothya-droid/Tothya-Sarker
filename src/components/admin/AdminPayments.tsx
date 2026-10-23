import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CreditCard, Search, RotateCcw, CheckCircle, Clock, Smartphone, Banknote } from 'lucide-react';
import { formatCurrency } from '../../utils/ecommerceCalculations';

export const AdminPayments: React.FC = () => {
  const { paymentTransactions, processRefund, currency, storeSettings } = useStore();
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('');

  const filtered = paymentTransactions.filter(
    (p) =>
      p.transactionRef.toLowerCase().includes(search.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefund = (txId: string) => {
    if (window.confirm('Confirm refund for this payment transaction? This will reverse the revenue and update the order state.')) {
      processRefund(txId);
      setFeedback('Transaction successfully refunded.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Payment Gateways &amp; Transaction Ledger
          </h1>
          <p className="text-xs text-[#78716C]">
            Verified ledger of Cash on Delivery, bKash, Nagad, and Card merchant authorizations.
          </p>
        </div>

        <div className="relative max-w-xs w-full text-xs">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search TrxID, order, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#DDD5C5] rounded-md focus:outline-none"
          />
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
          {feedback}
        </div>
      )}

      {/* Payment Gateways Config Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA] space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-[#1A1918]">
            <Banknote className="w-4 h-4 text-[#9A7B4F]" />
            <span>Cash on Delivery (COD)</span>
          </div>
          <span className="text-[11px] text-emerald-700 block font-semibold">Active &amp; Ready</span>
          <span className="text-[10px] text-[#78716C]">Manual door settlement</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA] space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-[#1A1918]">
            <Smartphone className="w-4 h-4 text-[#D12053]" />
            <span>bKash Merchant Pay</span>
          </div>
          <span className="text-[11px] text-emerald-700 block font-semibold">Live TrxID Check</span>
          <span className="text-[10px] text-[#78716C]">Merchant: 01711-234567</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA] space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-[#1A1918]">
            <Smartphone className="w-4 h-4 text-[#EA580C]" />
            <span>Nagad Financial</span>
          </div>
          <span className="text-[11px] text-emerald-700 block font-semibold">Configured</span>
          <span className="text-[10px] text-[#78716C]">Automated electronic IPN</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA] space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-[#1A1918]">
            <CreditCard className="w-4 h-4 text-[#9A7B4F]" />
            <span>Card (Stripe / Amex)</span>
          </div>
          <span className="text-[11px] text-emerald-700 block font-semibold">PCI-DSS Compliant</span>
          <span className="text-[10px] text-[#78716C]">TLS 1.3 tokenized vault</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px]">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Amount &amp; Currency</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#1A1918]">
                    {tx.transactionRef}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#57534E]">{tx.orderNumber}</td>
                  <td className="py-3 px-4 font-medium text-[#1A1918]">{tx.customerName}</td>
                  <td className="py-3 px-4 uppercase font-medium text-[#57534E]">
                    {tx.provider}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#1A1918] tabular-nums">
                    {tx.currency === 'BDT'
                      ? `৳${tx.amount.toLocaleString()}`
                      : `$${tx.amount.toFixed(2)}`}
                  </td>
                  <td className="py-3 px-4 text-[#57534E]">
                    {new Date(tx.paymentDate).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                        tx.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-800'
                          : tx.status === 'pending'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {tx.status === 'paid' && (
                      <button
                        onClick={() => handleRefund(tx.id)}
                        className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded text-[11px] font-medium cursor-pointer"
                      >
                        Refund
                      </button>
                    )}
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
