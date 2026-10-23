import { Order, Currency, Coupon } from '../types/ecommerce';

export const DEFAULT_EXCHANGE_RATE = 120; // 1 USD = 120 BDT
export const RATE_SOURCE_NAME = 'Bangladesh Bank & Interbank Exchange Standard';

/**
 * Format currency with proper symbols and tabular figures
 */
export function formatCurrency(amount: number, currency: Currency, exchangeRate = DEFAULT_EXCHANGE_RATE): string {
  if (isNaN(amount)) return currency === 'USD' ? '$0.00' : '৳0';
  
  if (currency === 'BDT') {
    const bdtAmount = Math.round(amount);
    return `৳${bdtAmount.toLocaleString('en-US')}`;
  }

  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Convert an amount between currencies
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRate = DEFAULT_EXCHANGE_RATE
): number {
  if (from === to) return amount;
  if (from === 'USD' && to === 'BDT') {
    return Math.round(amount * exchangeRate);
  }
  if (from === 'BDT' && to === 'USD') {
    return Number((amount / exchangeRate).toFixed(2));
  }
  return amount;
}

/**
 * Calculate cart order totals including coupon discounts and shipping
 */
export function calculateOrderTotals(
  items: { price: number; quantity: number }[],
  coupon?: Coupon | null,
  freeShippingThreshold = 250,
  standardShippingFee = 15
): {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  isFreeShipping: boolean;
  couponError?: string;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  let couponError: string | undefined;

  if (coupon && coupon.isActive) {
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      couponError = `Minimum order of $${coupon.minSpend} required for code ${coupon.code}`;
    } else {
      if (coupon.type === 'percentage') {
        discount = Number(((subtotal * coupon.value) / 100).toFixed(2));
      } else {
        discount = Math.min(coupon.value, subtotal);
      }
    }
  }

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = items.length === 0 ? 0 : isFreeShipping ? 0 : standardShippingFee;
  const total = Math.max(0, Number((subtotal - discount + shipping).toFixed(2)));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    shipping,
    total,
    isFreeShipping,
    couponError,
  };
}

/**
 * Determine if inventory allows requested quantity without overselling
 */
export function canFulfillStock(currentStock: number, requestedQuantity: number): boolean {
  if (requestedQuantity <= 0) return false;
  return currentStock >= requestedQuantity;
}

export interface FinancialAnalytics {
  grossSales: number;
  netSales: number;
  confirmedPaidRevenue: number;
  pendingPayments: number;
  refunds: number;
  totalDiscounts: number;
  paidOrdersCount: number;
  totalOrdersCount: number;
  averageOrderValue: number;
}

/**
 * Compute real accounting metrics from orders.
 * Distinctly separates Gross Sales, Net Sales, and Confirmed Paid Cash.
 * No fabricated business metrics.
 */
export function calculateFinancialMetrics(
  orders: Order[],
  targetCurrency: Currency = 'USD',
  exchangeRate = DEFAULT_EXCHANGE_RATE
): FinancialAnalytics {
  let grossSalesUsd = 0;
  let discountsUsd = 0;
  let refundsUsd = 0;
  let confirmedPaidUsd = 0;
  let pendingPaymentsUsd = 0;
  let paidOrdersCount = 0;
  let validOrdersCount = 0;

  for (const order of orders) {
    // Normalise order total to USD base
    const orderTotalUsd =
      order.currency === 'USD'
        ? order.total
        : convertCurrency(order.total, 'BDT', 'USD', order.exchangeRateUsed || exchangeRate);

    const orderDiscountUsd =
      order.currency === 'USD'
        ? order.discount
        : convertCurrency(order.discount, 'BDT', 'USD', order.exchangeRateUsed || exchangeRate);

    if (order.orderStatus !== 'cancelled') {
      grossSalesUsd += orderTotalUsd + orderDiscountUsd; // Gross before discount
      discountsUsd += orderDiscountUsd;
      validOrdersCount += 1;
    }

    if (order.paymentStatus === 'paid') {
      confirmedPaidUsd += orderTotalUsd;
      paidOrdersCount += 1;
    } else if (order.paymentStatus === 'pending') {
      pendingPaymentsUsd += orderTotalUsd;
    } else if (order.paymentStatus === 'refunded' || order.orderStatus === 'refunded') {
      refundsUsd += orderTotalUsd;
    }
  }

  // Net Sales = Gross Sales - Discounts - Refunds
  const netSalesUsd = Math.max(0, grossSalesUsd - discountsUsd - refundsUsd);
  const aovUsd = validOrdersCount > 0 ? (grossSalesUsd - discountsUsd) / validOrdersCount : 0;

  const multiplier = targetCurrency === 'BDT' ? exchangeRate : 1;

  return {
    grossSales: Number((grossSalesUsd * multiplier).toFixed(targetCurrency === 'BDT' ? 0 : 2)),
    netSales: Number((netSalesUsd * multiplier).toFixed(targetCurrency === 'BDT' ? 0 : 2)),
    confirmedPaidRevenue: Number((confirmedPaidUsd * multiplier).toFixed(targetCurrency === 'BDT' ? 0 : 2)),
    pendingPayments: Number((pendingPaymentsUsd * multiplier).toFixed(targetCurrency === 'BDT' ? 0 : 2)),
    refunds: Number((refundsUsd * multiplier).toFixed(targetCurrency === 'BDT' ? 0 : 2)),
    totalDiscounts: Number((discountsUsd * multiplier).toFixed(targetCurrency === 'BDT' ? 0 : 2)),
    paidOrdersCount,
    totalOrdersCount: orders.length,
    averageOrderValue: Number((aovUsd * multiplier).toFixed(targetCurrency === 'BDT' ? 0 : 2)),
  };
}

/**
 * Filter orders by date range safely
 */
export function filterOrdersByDate(
  orders: Order[],
  range: 'today' | '7days' | '30days' | 'this_month' | 'last_month' | 'this_year' | 'custom' | 'all',
  customStart?: string,
  customEnd?: string,
  referenceNow = new Date()
): Order[] {
  if (range === 'all') return orders;

  const now = new Date(referenceNow);

  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    if (isNaN(orderDate.getTime())) return true;

    if (range === 'today') {
      return (
        orderDate.getFullYear() === now.getFullYear() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getDate() === now.getDate()
      );
    }

    if (range === '7days') {
      const past7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= past7Days && orderDate <= now;
    }

    if (range === '30days') {
      const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return orderDate >= past30Days && orderDate <= now;
    }

    if (range === 'this_month') {
      return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth();
    }

    if (range === 'last_month') {
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      return orderDate.getFullYear() === lastMonthYear && orderDate.getMonth() === lastMonth;
    }

    if (range === 'this_year') {
      return orderDate.getFullYear() === now.getFullYear();
    }

    if (range === 'custom') {
      if (!customStart) return true;
      const start = new Date(customStart);
      const end = customEnd ? new Date(customEnd + 'T23:59:59') : now;
      return orderDate >= start && orderDate <= end;
    }

    return true;
  });
}
