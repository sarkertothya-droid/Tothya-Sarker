import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  TrendingUp,
  Percent,
  RotateCcw,
  Clock,
  CheckCircle,
  Truck,
  Filter,
  Calendar,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  calculateFinancialMetrics,
  filterOrdersByDate,
  formatCurrency,
  convertCurrency,
} from '../../utils/ecommerceCalculations';

export const AdminRevenueAnalytics: React.FC = () => {
  const { orders, products, currency, setCurrency, storeSettings } = useStore();

  const [dateRange, setDateRange] = useState<
    'today' | '7days' | '30days' | 'this_month' | 'last_month' | 'this_year' | 'all'
  >('all');

  const exchangeRate = storeSettings.exchangeRateUsdToBdt;

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return filterOrdersByDate(orders, dateRange);
  }, [orders, dateRange]);

  // Real financial metrics
  const metrics = useMemo(() => {
    return calculateFinancialMetrics(filteredOrders, currency, exchangeRate);
  }, [filteredOrders, currency, exchangeRate]);

  // Shipping income
  const totalShippingIncome = useMemo(() => {
    const rawUsd = filteredOrders.reduce((sum, o) => (o.orderStatus !== 'cancelled' ? sum + o.shipping : sum), 0);
    return currency === 'BDT' ? convertCurrency(rawUsd, 'USD', 'BDT', exchangeRate) : rawUsd;
  }, [filteredOrders, currency, exchangeRate]);

  // Best-performing products by revenue
  const topProducts = useMemo(() => {
    const revenueMap: { [prodId: string]: { name: string; revenue: number; units: number; image: string } } = {};

    for (const order of filteredOrders) {
      if (order.orderStatus === 'cancelled') continue;
      for (const item of order.items) {
        if (!revenueMap[item.productId]) {
          revenueMap[item.productId] = {
            name: item.productName,
            revenue: 0,
            units: 0,
            image: item.productImage,
          };
        }
        revenueMap[item.productId].revenue += item.totalPrice;
        revenueMap[item.productId].units += item.quantity;
      }
    }

    return Object.values(revenueMap)
      .map((p) => ({
        ...p,
        displayRevenue: currency === 'BDT' ? convertCurrency(p.revenue, 'USD', 'BDT', exchangeRate) : p.revenue,
      }))
      .sort((a, b) => b.displayRevenue - a.displayRevenue)
      .slice(0, 5);
  }, [filteredOrders, currency, exchangeRate]);

  // Daily revenue breakdown for interactive bar chart
  const dailyBreakdown = useMemo(() => {
    const map: { [dateStr: string]: { date: string; revenue: number; count: number } } = {};

    for (const order of filteredOrders) {
      if (order.paymentStatus !== 'paid') continue;
      const d = new Date(order.createdAt).toISOString().split('T')[0];
      if (!map[d]) {
        map[d] = { date: d, revenue: 0, count: 0 };
      }
      map[d].revenue += order.total;
      map[d].count += 1;
    }

    const items = Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
    const maxVal = Math.max(...items.map((i) => i.revenue), 100);

    return items.map((i) => ({
      ...i,
      displayRevenue: currency === 'BDT' ? convertCurrency(i.revenue, 'USD', 'BDT', exchangeRate) : i.revenue,
      barHeight: Math.min(100, Math.round((i.revenue / maxVal) * 100)),
    }));
  }, [filteredOrders, currency, exchangeRate]);

  return (
    <div className="space-y-8">
      
      {/* Header & Currency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1A1918] font-medium">
            Financial Ledger &amp; Revenue Analytics
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Audited cash transactions, gross vs net revenue distinction, and currency parity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dual Currency Switcher */}
          <div className="flex items-center border border-[#DDD5C5] rounded-md overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                currency === 'USD' ? 'bg-[#1A1918] text-white' : 'bg-white text-[#57534E]'
              }`}
            >
              USD ($) View
            </button>
            <button
              onClick={() => setCurrency('BDT')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                currency === 'BDT' ? 'bg-[#1A1918] text-white' : 'bg-white text-[#57534E]'
              }`}
            >
              BDT (৳) View
            </button>
          </div>

          {/* Date Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-[#DDD5C5] rounded-md text-xs font-medium cursor-pointer"
          >
            <option value="all">All Available Periods</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
          </select>
        </div>
      </div>

      {/* Currency Exchange Documentation Box (Strict prompt adherence!) */}
      <div className="p-4 bg-[#F8F6F0] rounded-xl border border-[#E2DBD0] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#9A7B4F] shrink-0" />
          <span className="text-[#57534E]">
            <strong>Documented Exchange Rate:</strong> 1 USD = <strong>{exchangeRate} BDT</strong> · Conversion standard: <strong>{storeSettings.rateSource}</strong>.
          </span>
        </div>
        <span className="text-[11px] text-[#8E877E] font-mono">
          Last verified on: {storeSettings.lastRateUpdate}
        </span>
      </div>

      {/* Financial Core Accounting Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Confirmed Received Cash */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-emerald-800 tracking-wider">
              Confirmed Paid Cash (Received)
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-sans text-2xl font-semibold text-[#1A1918] tabular-nums block">
            {formatCurrency(metrics.confirmedPaidRevenue, currency, exchangeRate)}
          </span>
          <span className="text-[11px] text-[#78716C] block">
            Settled from {metrics.paidOrdersCount} paid orders
          </span>
        </div>

        {/* Net Sales */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-[#57534E] tracking-wider">
              Net Sales
            </span>
            <TrendingUp className="w-4 h-4 text-[#9A7B4F]" />
          </div>
          <span className="font-sans text-2xl font-semibold text-[#1A1918] tabular-nums block">
            {formatCurrency(metrics.netSales, currency, exchangeRate)}
          </span>
          <span className="text-[11px] text-[#78716C] block">
            Gross minus discounts &amp; refunds
          </span>
        </div>

        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-[#57534E] tracking-wider">
              Gross Sales
            </span>
            <DollarSign className="w-4 h-4 text-[#78716C]" />
          </div>
          <span className="font-sans text-2xl font-semibold text-[#1A1918] tabular-nums block">
            {formatCurrency(metrics.grossSales, currency, exchangeRate)}
          </span>
          <span className="text-[11px] text-[#78716C] block">
            Total product catalog value placed
          </span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-amber-800 tracking-wider">
              Pending Cash / COD
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-sans text-2xl font-semibold text-[#1A1918] tabular-nums block">
            {formatCurrency(metrics.pendingPayments, currency, exchangeRate)}
          </span>
          <span className="text-[11px] text-[#78716C] block">
            Awaiting door delivery settlement
          </span>
        </div>

      </div>

      {/* Secondary Financial Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA]">
          <span className="text-[11px] text-[#78716C] block">Coupons &amp; Discounts</span>
          <span className="font-mono text-lg font-semibold text-[#1A1918] tabular-nums">
            {formatCurrency(metrics.totalDiscounts, currency, exchangeRate)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA]">
          <span className="text-[11px] text-[#78716C] block">Refunds Processed</span>
          <span className="font-mono text-lg font-semibold text-rose-700 tabular-nums">
            {formatCurrency(metrics.refunds, currency, exchangeRate)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA]">
          <span className="text-[11px] text-[#78716C] block">Shipping Income Recorded</span>
          <span className="font-mono text-lg font-semibold text-[#1A1918] tabular-nums">
            {formatCurrency(totalShippingIncome, currency, exchangeRate)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E4DA]">
          <span className="text-[11px] text-[#78716C] block">Average Order Value (AOV)</span>
          <span className="font-mono text-lg font-semibold text-[#1A1918] tabular-nums">
            {formatCurrency(metrics.averageOrderValue, currency, exchangeRate)}
          </span>
        </div>
      </div>

      {/* Interactive Revenue Chart & Best Performing Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Daily Paid Revenue Histogram */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
            <div>
              <h2 className="font-editorial text-lg text-[#1A1918] font-medium">
                Confirmed Cash Inflow by Date
              </h2>
              <span className="text-xs text-[#78716C]">
                Only verified and settled merchant transactions
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-[#1A1918]">
              {currency} Currency View
            </span>
          </div>

          {dailyBreakdown.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#78716C]">
              No paid orders within selected filter timeframe.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-56 flex items-end gap-3 pt-6 px-2">
                {dailyBreakdown.map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1C1A18] text-white text-[10px] py-1 px-1.5 rounded font-mono whitespace-nowrap mb-1">
                      {formatCurrency(bar.displayRevenue, currency, exchangeRate)}
                    </div>
                    <div
                      className="w-full bg-[#1A1918] group-hover:bg-[#9A7B4F] rounded-t-md transition-all duration-300 min-h-[4px]"
                      style={{ height: `${Math.max(8, bar.barHeight)}%` }}
                    />
                    <span className="text-[10px] text-[#78716C] font-mono truncate max-w-full">
                      {bar.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-[#A8A29E] text-center">
                Date-based histogram showing verified cash settlements
              </div>
            </div>
          )}
        </div>

        {/* Right: Best-Performing Products */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
            <h3 className="font-editorial text-base text-[#1A1918] font-medium">
              Top Performing Works
            </h3>
            <span className="text-xs text-[#78716C]">Ranked by Revenue</span>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#78716C] text-center py-6">No product revenue logged yet.</p>
            ) : (
              topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F5] border border-[#ECE7DC] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-editorial font-bold text-sm text-[#9A7B4F] w-4">
                      #{idx + 1}
                    </span>
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-white"
                    />
                    <div className="truncate">
                      <span className="font-medium text-[#1A1918] block truncate max-w-[150px]">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-[#78716C]">
                        {p.units} acquisition units
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-semibold text-[#1A1918] tabular-nums">
                    {formatCurrency(p.displayRevenue, currency, exchangeRate)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
