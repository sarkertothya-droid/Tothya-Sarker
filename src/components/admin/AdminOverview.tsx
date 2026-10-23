import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  Calendar,
  ShoppingBag,
  Clock,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Percent,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Filter,
  Eye,
} from 'lucide-react';
import {
  calculateFinancialMetrics,
  filterOrdersByDate,
  formatCurrency,
  convertCurrency,
} from '../../utils/ecommerceCalculations';

export const AdminOverview: React.FC = () => {
  const {
    products,
    orders,
    customers,
    currency,
    storeSettings,
    setAdminActiveSection,
    setSelectedProductId,
    setCurrentView,
    setStorePage,
  } = useStore();

  const [dateFilter, setDateFilter] = useState<
    'today' | '7days' | '30days' | 'this_month' | 'last_month' | 'this_year' | 'custom' | 'all'
  >('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const exchangeRate = storeSettings.exchangeRateUsdToBdt;

  // Filter orders by selected date filter
  const activeOrders = useMemo(() => {
    return filterOrdersByDate(orders, dateFilter, customStart, customEnd);
  }, [orders, dateFilter, customStart, customEnd]);

  // Real financial metrics calculation (never fabricated!)
  const overallMetrics = useMemo(() => {
    return calculateFinancialMetrics(orders, currency, exchangeRate);
  }, [orders, currency, exchangeRate]);

  const todayOrders = useMemo(() => {
    return filterOrdersByDate(orders, 'today');
  }, [orders]);

  const todayMetrics = useMemo(() => {
    return calculateFinancialMetrics(todayOrders, currency, exchangeRate);
  }, [todayOrders, currency, exchangeRate]);

  const thisMonthOrders = useMemo(() => {
    return filterOrdersByDate(orders, 'this_month');
  }, [orders]);

  const thisMonthMetrics = useMemo(() => {
    return calculateFinancialMetrics(thisMonthOrders, currency, exchangeRate);
  }, [thisMonthOrders, currency, exchangeRate]);

  // Inventory metrics
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.status === 'published').length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 4).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;

  const totalRegisteredCustomers = customers.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending').length;

  // 12 Summary Cards (Strictly as specified!)
  const summaryCards = [
    {
      id: 'total_revenue',
      title: 'Total Revenue (Net)',
      value: formatCurrency(overallMetrics.netSales, currency, exchangeRate),
      subtitle: `Confirmed Paid Cash: ${formatCurrency(overallMetrics.confirmedPaidRevenue, currency, exchangeRate)}`,
      icon: DollarSign,
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'today_revenue',
      title: "Today's Revenue",
      value: formatCurrency(todayMetrics.netSales, currency, exchangeRate),
      subtitle: `${todayOrders.length} order(s) logged today`,
      icon: Calendar,
      iconBg: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'month_revenue',
      title: "This Month's Revenue",
      value: formatCurrency(thisMonthMetrics.netSales, currency, exchangeRate),
      subtitle: `${thisMonthOrders.length} orders this month`,
      icon: TrendingUp,
      iconBg: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'total_orders',
      title: 'Total Orders',
      value: orders.length.toString(),
      subtitle: `${overallMetrics.paidOrdersCount} paid & confirmed`,
      icon: ShoppingBag,
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'today_orders',
      title: "Today's Orders",
      value: todayOrders.length.toString(),
      subtitle: 'Recorded in current 24h',
      icon: Clock,
      iconBg: 'bg-cyan-100 text-cyan-800',
    },
    {
      id: 'pending_orders',
      title: 'Pending Orders',
      value: pendingOrdersCount.toString(),
      subtitle: 'Awaiting fulfillment/action',
      icon: AlertTriangle,
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'total_products',
      title: 'Total Products',
      value: totalProducts.toString(),
      subtitle: 'Across all categories',
      icon: Package,
      iconBg: 'bg-stone-100 text-stone-800',
    },
    {
      id: 'published_products',
      title: 'Published Products',
      value: publishedProducts.toString(),
      subtitle: 'Active on public storefront',
      icon: CheckCircle,
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'low_stock_products',
      title: 'Low-Stock Products',
      value: lowStockProducts.toString(),
      subtitle: 'Stock <= 4 items remaining',
      icon: AlertTriangle,
      iconBg: 'bg-orange-100 text-orange-800',
    },
    {
      id: 'out_of_stock_products',
      title: 'Out-of-Stock Products',
      value: outOfStockProducts.toString(),
      subtitle: 'Requires atelier restocking',
      icon: XCircle,
      iconBg: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'total_customers',
      title: 'Registered Customers',
      value: totalRegisteredCustomers.toString(),
      subtitle: 'Verified client directory',
      icon: Users,
      iconBg: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'aov',
      title: 'Average Order Value (AOV)',
      value: formatCurrency(overallMetrics.averageOrderValue, currency, exchangeRate),
      subtitle: 'Based on actual gross sales',
      icon: Percent,
      iconBg: 'bg-teal-100 text-teal-800',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E4DA]">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1A1918] font-medium">
            Executive Performance Dashboard
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Displaying live audited figures in <strong>{currency}</strong> (Rate: 1 USD = {exchangeRate} BDT · Source: {storeSettings.rateSource}).
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-[#78716C] shrink-0" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="text-xs font-medium bg-white border border-[#DDD5C5] rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] cursor-pointer"
          >
            <option value="all">All-Time History</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
            <option value="custom">Custom Date Range</option>
          </select>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="text-xs bg-white border border-[#DDD5C5] rounded px-2 py-1"
              />
              <span className="text-xs text-[#78716C]">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="text-xs bg-white border border-[#DDD5C5] rounded px-2 py-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* 12 Key Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white p-4 rounded-xl border border-[#E8E4DA] shadow-xs flex flex-col justify-between space-y-3 hover:border-[#C5A880] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#57534E] truncate">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.iconBg} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="font-sans text-2xl font-semibold text-[#1A1918] tabular-nums block">
                  {card.value}
                </span>
                <span className="text-[11px] text-[#78716C] block mt-0.5 truncate">
                  {card.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Section: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
            <div>
              <h2 className="font-editorial text-lg text-[#1A1918] font-medium">
                Recent Atelier Orders
              </h2>
              <span className="text-xs text-[#78716C]">Real-time order feed</span>
            </div>
            <button
              onClick={() => setAdminActiveSection('orders')}
              className="text-xs text-[#9A7B4F] hover:text-[#1A1918] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0EBE1] text-[#78716C] uppercase font-semibold text-[10px] tracking-wider">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Payment</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB]">
                {orders.slice(0, 5).map((order) => {
                  const displayTotal =
                    currency === 'BDT'
                      ? convertCurrency(order.total, 'USD', 'BDT', exchangeRate)
                      : order.total;

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3 font-mono font-medium text-[#1A1918]">{order.orderNumber}</td>
                      <td className="py-3">
                        <div className="font-medium text-[#1A1918]">{order.customer.fullName}</div>
                        <span className="text-[10px] text-[#78716C]">{order.customer.email}</span>
                      </td>
                      <td className="py-3 font-mono font-medium tabular-nums">
                        {formatCurrency(displayTotal, currency, exchangeRate)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="font-medium capitalize text-[#44403C]">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setAdminActiveSection('orders')}
                          className="text-[#9A7B4F] hover:underline cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low Stock & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Low Stock Alerts Box */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-editorial text-base text-[#1A1918] font-medium">
                  Inventory Alerts
                </h3>
              </div>
              <button
                onClick={() => setAdminActiveSection('inventory')}
                className="text-xs text-[#9A7B4F] hover:underline cursor-pointer"
              >
                Stock Log
              </button>
            </div>

            <div className="space-y-3">
              {products
                .filter((p) => p.stock <= 4)
                .slice(0, 4)
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#FAF9F5] border border-[#ECE7DC]"
                  >
                    <div className="truncate mr-2">
                      <span className="font-medium text-[#1A1918] block truncate">{prod.name}</span>
                      <span className="text-[10px] text-[#78716C] font-mono">SKU: {prod.sku}</span>
                    </div>
                    <span
                      className={`font-mono px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                        prod.stock === 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                    </span>
                  </div>
                ))}
              {products.filter((p) => p.stock <= 4).length === 0 && (
                <p className="text-xs text-[#78716C] text-center py-4">All atelier items well-stocked.</p>
              )}
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E8E4DA] space-y-3">
            <h4 className="text-xs uppercase font-semibold text-[#1A1918] tracking-wider">
              Quick Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setAdminActiveSection('add_product')}
                className="p-3 bg-white hover:bg-[#F5F2EB] border border-[#D5CBB8] rounded-xl text-left cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-[#9A7B4F] mb-1" />
                <span className="font-medium block">Add Product</span>
              </button>

              <button
                onClick={() => setAdminActiveSection('website_design')}
                className="p-3 bg-white hover:bg-[#F5F2EB] border border-[#D5CBB8] rounded-xl text-left cursor-pointer transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-[#9A7B4F] mb-1" />
                <span className="font-medium block">Customizer</span>
              </button>

              <button
                onClick={() => setAdminActiveSection('revenue')}
                className="p-3 bg-white hover:bg-[#F5F2EB] border border-[#D5CBB8] rounded-xl text-left cursor-pointer transition-colors"
              >
                <DollarSign className="w-4 h-4 text-[#9A7B4F] mb-1" />
                <span className="font-medium block">Revenue FX</span>
              </button>

              <button
                onClick={() => setAdminActiveSection('coupons')}
                className="p-3 bg-white hover:bg-[#F5F2EB] border border-[#D5CBB8] rounded-xl text-left cursor-pointer transition-colors"
              >
                <Percent className="w-4 h-4 text-[#9A7B4F] mb-1" />
                <span className="font-medium block">Discounts</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
