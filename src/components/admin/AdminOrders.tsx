import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types/ecommerce';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency, convertCurrency } from '../../utils/ecommerceCalculations';

export const AdminOrders: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    updateOrderTracking,
    updateOrderPaymentStatus,
    currency,
    storeSettings,
  } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status updates within modal
  const [newStatus, setNewStatus] = useState<OrderStatus>('confirmed');
  const [carrierInput, setCarrierInput] = useState('DHL Express Luxury');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const exchangeRate = storeSettings.exchangeRateUsdToBdt;

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.customer.fullName.toLowerCase().includes(q) ||
          ord.customer.email.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (statusFilter !== 'all' && ord.orderStatus !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [orders, search, statusFilter]);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setCarrierInput(order.trackingCarrier || 'DHL Express Luxury');
    setTrackingNumberInput(order.trackingNumber || '');
    setStatusNote('');
  };

  const handleSaveStatusChange = () => {
    if (!selectedOrder) return;

    if (newStatus !== selectedOrder.orderStatus) {
      updateOrderStatus(selectedOrder.id, newStatus, statusNote);
    }

    if (trackingNumberInput.trim() && trackingNumberInput !== selectedOrder.trackingNumber) {
      updateOrderTracking(selectedOrder.id, carrierInput, trackingNumberInput.trim());
    }

    // Refresh selected order
    const updated = orders.find((o) => o.id === selectedOrder.id);
    if (updated) setSelectedOrder(updated);
  };

  const handleMarkPaid = () => {
    if (!selectedOrder) return;
    updateOrderPaymentStatus(selectedOrder.id, 'paid');
    const updated = orders.find((o) => o.id === selectedOrder.id);
    if (updated) setSelectedOrder(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Atelier Order Management
          </h1>
          <p className="text-xs text-[#78716C]">
            Track acquisitions, fulfill dispatches, manage courier tracking, and process accounting states.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#1A1918]">Total Registered:</span>
          <span className="font-mono bg-white px-2.5 py-1 rounded border border-[#DDD5C5]">
            {orders.length} Orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E4DA] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#DDD5C5] rounded-md focus:outline-none"
          />
        </div>

        {/* Status Filters: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(
            (st) => {
              const count = st === 'all' ? orders.length : orders.filter((o) => o.orderStatus === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap cursor-pointer transition-colors ${
                    statusFilter === st
                      ? 'bg-[#1A1918] text-white font-medium'
                      : 'bg-[#F5F2EB] text-[#57534E] hover:text-[#1A1918]'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4DA] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E4DA] text-[#78716C] uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Fulfillment</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F2EB]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#78716C]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const displayTotal =
                    currency === 'BDT'
                      ? convertCurrency(ord.total, 'USD', 'BDT', exchangeRate)
                      : ord.total;

                  return (
                    <tr key={ord.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-[#1A1918]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#1A1918] block">{ord.customer.fullName}</span>
                        <span className="text-[10px] text-[#78716C]">{ord.customer.city}, {ord.customer.country}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#57534E]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#1A1918]">
                          {ord.items.reduce((s, i) => s + i.quantity, 0)} items
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1918] tabular-nums">
                        {formatCurrency(displayTotal, currency, exchangeRate)}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[11px] font-medium text-[#57534E]">
                        {ord.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-800'
                              : ord.paymentStatus === 'pending'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800'
                              : ord.orderStatus === 'shipped'
                              ? 'bg-blue-50 text-blue-800'
                              : ord.orderStatus === 'cancelled'
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(ord)}
                          className="px-3 py-1 bg-[#F5F2EB] hover:bg-[#EBE7DD] text-[#1A1918] font-medium rounded cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E8E4DA] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6 text-xs animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E4DA] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#9A7B4F] uppercase tracking-wider block">
                  Requisition Reference
                </span>
                <h2 className="font-editorial text-2xl text-[#1A1918] font-medium">
                  Order {selectedOrder.orderNumber}
                </h2>
                <span className="text-xs text-[#78716C]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#FAF9F5] border border-[#DDD5C5] rounded-md text-[#57534E] hover:text-[#1A1918] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1.5 bg-[#1A1918] text-white rounded-md cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF9F5] rounded-xl border border-[#ECE7DC]">
              <div>
                <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Fulfillment Status</span>
                <span className="font-semibold text-sm capitalize text-[#1A1918]">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Payment Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`font-semibold text-sm capitalize ${
                      selectedOrder.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod.toUpperCase()})
                  </span>
                  {selectedOrder.paymentStatus !== 'paid' && (
                    <button
                      onClick={handleMarkPaid}
                      className="px-2 py-0.5 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#78716C] uppercase tracking-wider block">Total Recorded</span>
                <span className="font-mono font-semibold text-sm text-[#1A1918] tabular-nums">
                  ${selectedOrder.total.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Customer & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl border border-[#ECE7DC]">
              <div>
                <h4 className="font-semibold text-[#1A1918] mb-1">Customer Profile &amp; Contact</h4>
                <p className="text-[#1A1918] font-medium">{selectedOrder.customer.fullName}</p>
                <p className="text-[#57534E]">{selectedOrder.customer.email}</p>
                <p className="text-[#57534E]">{selectedOrder.customer.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1918] mb-1">Shipping Destination</h4>
                <p className="text-[#57534E]">{selectedOrder.customer.street}</p>
                {selectedOrder.customer.apartment && <p className="text-[#57534E]">{selectedOrder.customer.apartment}</p>}
                <p className="text-[#57534E]">
                  {selectedOrder.customer.city}, {selectedOrder.customer.state || ''} {selectedOrder.customer.postalCode}
                </p>
                <p className="text-[#1A1918] font-medium">{selectedOrder.customer.country}</p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="font-semibold text-[#1A1918] mb-2">Acquired Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-[#FAF9F5] rounded-lg border border-[#ECE7DC]">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.productImage}
                        alt={it.productName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded object-cover bg-white"
                      />
                      <div>
                        <span className="font-medium text-[#1A1918] block">{it.productName}</span>
                        <span className="text-[10px] text-[#78716C]">
                          {it.variantName ? `${it.variantName} · ` : ''}Qty: {it.quantity} x ${it.unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-[#1A1918] tabular-nums">
                      ${it.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Status & Courier Form */}
            <div className="p-4 bg-[#F8F6F0] rounded-xl border border-[#E2DBD0] space-y-3">
              <h4 className="font-semibold text-[#1A1918]">Update Order State &amp; Tracking</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#44403C] mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#DDD5C5] rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#44403C] mb-1">Carrier</label>
                  <input
                    type="text"
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#DDD5C5] rounded"
                  />
                </div>

                <div>
                  <label className="block text-[#44403C] mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. DHL-9928194"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#DDD5C5] rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#44403C] mb-1">Timeline Audit Note (Optional)</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Handed to DHL courier at Charles de Gaulle airport depot..."
                  className="w-full px-2.5 py-1.5 bg-white border border-[#DDD5C5] rounded"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveStatusChange}
                  className="px-4 py-2 bg-[#1A1918] hover:bg-[#332E2B] text-white font-medium rounded-md cursor-pointer"
                >
                  Save Order Updates
                </button>
              </div>
            </div>

            {/* Audit Timeline */}
            <div>
              <h4 className="font-semibold text-[#1A1918] mb-2">Order Activity History</h4>
              <div className="space-y-2 border-l-2 border-[#D5CBB8] pl-4">
                {selectedOrder.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <span className="font-semibold capitalize text-[#1A1918] block">{event.status}</span>
                    <span className="text-[10px] text-[#A8A29E] block">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    <p className="text-[#57534E] text-[11px] mt-0.5">{event.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
