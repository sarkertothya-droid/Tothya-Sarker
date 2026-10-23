import React from 'react';
import { useStore } from '../../context/StoreContext';
import { FileBarChart, Download, DollarSign, Package, Users, TrendingUp } from 'lucide-react';
import { calculateFinancialMetrics, formatCurrency } from '../../utils/ecommerceCalculations';

export const AdminReports: React.FC = () => {
  const { orders, products, customers, currency, storeSettings } = useStore();
  const exchangeRate = storeSettings.exchangeRateUsdToBdt;

  const financial = calculateFinancialMetrics(orders, currency, exchangeRate);

  const handleDownloadReport = (type: string) => {
    let content = '';
    if (type === 'sales') {
      content =
        'data:text/csv;charset=utf-8,OrderNumber,Customer,Subtotal,Discount,Shipping,Total,Currency,PaymentMethod,Status,Date\n' +
        orders
          .map(
            (o) =>
              `${o.orderNumber},"${o.customer.fullName}",${o.subtotal},${o.discount},${o.shipping},${o.total},${o.currency},${o.paymentMethod},${o.orderStatus},${o.createdAt}`
          )
          .join('\n');
    } else {
      content =
        'data:text/csv;charset=utf-8,SKU,Name,Category,Price,Stock,Status\n' +
        products.map((p) => `${p.sku},"${p.name}",${p.category},${p.price},${p.stock},${p.status}`).join('\n');
    }

    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurelia_${type}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl text-[#1A1918] font-medium">
            Executive Audit &amp; Financial Reports
          </h1>
          <p className="text-xs text-[#78716C]">
            Download certified audit records for financial accounting, inventory taxation, and growth review.
          </p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Sales Ledger */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#1A1918]">Complete Sales Ledger</span>
            <DollarSign className="w-5 h-5 text-[#9A7B4F]" />
          </div>
          <p className="text-[#78716C] leading-relaxed">
            Itemized breakdown of all {orders.length} historical orders, customer records, discounts, and payment methods.
          </p>
          <div className="pt-2">
            <span className="text-[11px] text-[#A8A29E] block mb-2">
              Net Sales: {formatCurrency(financial.netSales, currency, exchangeRate)}
            </span>
            <button
              onClick={() => handleDownloadReport('sales')}
              className="w-full py-2 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Sales CSV</span>
            </button>
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#1A1918]">Inventory Valuation</span>
            <Package className="w-5 h-5 text-[#9A7B4F]" />
          </div>
          <p className="text-[#78716C] leading-relaxed">
            Full physical asset valuation of {products.length} products with stock counts and catalog value.
          </p>
          <div className="pt-2">
            <span className="text-[11px] text-[#A8A29E] block mb-2">
              Total Units: {products.reduce((s, p) => s + p.stock, 0)} items
            </span>
            <button
              onClick={() => handleDownloadReport('inventory')}
              className="w-full py-2 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Inventory CSV</span>
            </button>
          </div>
        </div>

        {/* Customer Directory */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#1A1918]">Client Directory</span>
            <Users className="w-5 h-5 text-[#9A7B4F]" />
          </div>
          <p className="text-[#78716C] leading-relaxed">
            Export verified customer profiles, registration dates, order counts, and lifetime spent totals.
          </p>
          <div className="pt-2">
            <span className="text-[11px] text-[#A8A29E] block mb-2">
              Registered Clients: {customers.length}
            </span>
            <button
              onClick={() => handleDownloadReport('customers')}
              className="w-full py-2 bg-[#1A1918] hover:bg-[#332E2B] text-white rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Clients CSV</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
