import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { InventoryLog } from '../../types/ecommerce';
import { Boxes, AlertTriangle, XCircle, CheckCircle2, History, Plus, Edit } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, inventoryLogs, adjustStock, formatPrice } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [newStockInput, setNewStockInput] = useState<number>(10);
  const [reasonInput, setReasonInput] = useState<InventoryLog['reason']>('restock');
  const [performedByInput, setPerformedByInput] = useState('Head of Logistics');
  const [successNote, setSuccessNote] = useState('');

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 4);
  const outOfStock = products.filter((p) => p.stock <= 0);

  const handleOpenAdjust = (prodId: string, currentStock: number) => {
    setSelectedProductId(prodId);
    setNewStockInput(currentStock);
    setReasonInput('restock');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    adjustStock(selectedProductId, Number(newStockInput), reasonInput, performedByInput);
    setSuccessNote('Inventory level and audit ledger updated successfully.');
    setSelectedProductId(null);
    setTimeout(() => setSuccessNote(''), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1A1918] font-medium">
            Atelier Inventory &amp; Stock Logistics
          </h1>
          <p className="text-xs text-[#78716C]">
            Monitor stock thresholds, manage variant inventory, and track physical stock audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#1A1918]">Active Units in Stock:</span>
          <span className="font-mono bg-white px-3 py-1 rounded border border-[#DDD5C5] font-bold">
            {products.reduce((sum, p) => sum + p.stock, 0)} Units
          </span>
        </div>
      </div>

      {successNote && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold uppercase tracking-wider text-[#78716C]">
              Well Stocked Products
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-sans text-2xl font-bold text-[#1A1918]">
            {products.filter((p) => p.stock > 4).length}
          </span>
          <span className="text-[11px] text-[#78716C] block mt-1">Healthy replenishment</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold uppercase tracking-wider text-amber-800">
              Low Stock Warnings
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-sans text-2xl font-bold text-[#1A1918]">
            {lowStock.length}
          </span>
          <span className="text-[11px] text-[#78716C] block mt-1">4 units or fewer</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold uppercase tracking-wider text-rose-800">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="font-sans text-2xl font-bold text-[#1A1918]">
            {outOfStock.length}
          </span>
          <span className="text-[11px] text-[#78716C] block mt-1">Requisition required</span>
        </div>
      </div>

      {/* Inventory Table with Quick Adjustment Button */}
      <div className="bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8E4DA] flex items-center justify-between">
          <h2 className="font-editorial text-lg text-[#1A1918] font-medium">
            Physical Product Stock Register
          </h2>
          <span className="text-xs text-[#78716C]">{products.length} catalog items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Variant Breakdown</th>
                <th className="py-3 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0] || ''}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-[#F5F2EB]"
                      />
                      <span className="font-medium text-[#1A1918] truncate max-w-xs">
                        {prod.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#57534E]">{prod.sku}</td>
                  <td className="py-3 px-4 text-[#57534E]">{prod.category}</td>
                  <td className="py-3 px-4 font-mono font-medium text-[#1A1918]">
                    ${prod.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        prod.stock === 0
                          ? 'bg-rose-100 text-rose-800'
                          : prod.stock <= 4
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#78716C]">
                    {prod.variants && prod.variants.length > 0 ? (
                      prod.variants.map((v) => `${v.name}: ${v.stock}`).join(' · ')
                    ) : (
                      'Single format'
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenAdjust(prod.id, prod.stock)}
                      className="px-3 py-1 bg-[#F5F2EB] hover:bg-[#EBE7DD] text-[#1A1918] rounded font-medium cursor-pointer"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedProductId(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E8E4DA] shadow-2xl p-6 z-10 text-xs space-y-4 animate-fadeIn">
            <h3 className="font-editorial text-lg text-[#1A1918] font-medium border-b border-[#F0EBE1] pb-2">
              Adjust Atelier Stock
            </h3>

            <p className="text-[#57534E]">
              Item:{' '}
              <strong className="text-[#1A1918]">
                {products.find((p) => p.id === selectedProductId)?.name}
              </strong>
            </p>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div>
                <label className="block text-[#44403C] font-semibold mb-1">
                  New Physical Stock Count *
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStockInput}
                  onChange={(e) => setNewStockInput(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-[#44403C] font-semibold mb-1">
                  Stock Change Reason *
                </label>
                <select
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5] cursor-pointer"
                >
                  <option value="restock">Atelier Batch Restock</option>
                  <option value="audit_correction">Physical Audit Correction</option>
                  <option value="damage">Damaged in Transit / Discarded</option>
                  <option value="return">Client Inspection Return</option>
                </select>
              </div>

              <div>
                <label className="block text-[#44403C] font-semibold mb-1">
                  Performed By / Authorized Staff
                </label>
                <input
                  type="text"
                  value={performedByInput}
                  onChange={(e) => setPerformedByInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#DDD5C5] rounded bg-[#FAF9F5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EBE1]">
                <button
                  type="button"
                  onClick={() => setSelectedProductId(null)}
                  className="px-3 py-1.5 border border-[#DDD5C5] rounded text-[#57534E] hover:bg-[#F5F2EB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium cursor-pointer"
                >
                  Confirm &amp; Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Movement Audit History */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-3">
          <History className="w-4 h-4 text-[#9A7B4F]" />
          <h3 className="font-editorial text-base text-[#1A1918] font-medium">
            Inventory Movement &amp; Audit Log
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F0EBE1] text-[#78716C] uppercase font-semibold text-[10px]">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Creation</th>
                <th className="pb-2">Previous</th>
                <th className="pb-2">New</th>
                <th className="pb-2">Variance</th>
                <th className="pb-2">Reason</th>
                <th className="pb-2">Authorized By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {inventoryLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF9F5]">
                  <td className="py-2.5 font-mono text-[#78716C]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 font-medium text-[#1A1918]">{log.productName}</td>
                  <td className="py-2.5 font-mono text-[#57534E]">{log.previousStock}</td>
                  <td className="py-2.5 font-mono font-semibold text-[#1A1918]">{log.newStock}</td>
                  <td className="py-2.5 font-mono font-semibold">
                    <span className={log.change >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      {log.change >= 0 ? `+${log.change}` : log.change}
                    </span>
                  </td>
                  <td className="py-2.5 capitalize text-[#57534E]">
                    {log.reason.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 text-[#78716C]">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
