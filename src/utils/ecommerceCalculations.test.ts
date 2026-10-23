import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  convertCurrency,
  calculateOrderTotals,
  canFulfillStock,
  calculateFinancialMetrics,
} from './ecommerceCalculations';
import { Order } from '../types/ecommerce';

test('formatCurrency formats USD and BDT with exact symbols and precision', () => {
  assert.equal(formatCurrency(145.5, 'USD'), '$145.50');
  assert.equal(formatCurrency(12000, 'BDT'), '৳12,000');
  assert.equal(formatCurrency(0, 'USD'), '$0.00');
});

test('convertCurrency converts accurately using rate', () => {
  assert.equal(convertCurrency(100, 'USD', 'BDT', 120), 12000);
  assert.equal(convertCurrency(12000, 'BDT', 'USD', 120), 100);
  assert.equal(convertCurrency(50, 'USD', 'USD', 120), 50);
});

test('calculateOrderTotals applies percentage discount and free shipping threshold', () => {
  const items = [
    { price: 150, quantity: 2 }, // 300
  ];
  const coupon = {
    id: 'c1',
    code: 'VIP10',
    type: 'percentage' as const,
    value: 10,
    timesUsed: 0,
    usageLimit: 100,
    isActive: true,
    expiryDate: '2027-01-01',
  };

  const totals = calculateOrderTotals(items, coupon, 250, 15);
  assert.equal(totals.subtotal, 300);
  assert.equal(totals.discount, 30);
  assert.equal(totals.isFreeShipping, true);
  assert.equal(totals.shipping, 0);
  assert.equal(totals.total, 270);
});

test('calculateOrderTotals enforces standard shipping fee when under threshold', () => {
  const items = [{ price: 90, quantity: 1 }];
  const totals = calculateOrderTotals(items, null, 250, 15);
  assert.equal(totals.subtotal, 90);
  assert.equal(totals.discount, 0);
  assert.equal(totals.shipping, 15);
  assert.equal(totals.total, 105);
  assert.equal(totals.isFreeShipping, false);
});

test('canFulfillStock prevents overselling', () => {
  assert.equal(canFulfillStock(10, 5), true);
  assert.equal(canFulfillStock(5, 5), true);
  assert.equal(canFulfillStock(2, 5), false);
  assert.equal(canFulfillStock(0, 1), false);
  assert.equal(canFulfillStock(10, 0), false);
});

test('calculateFinancialMetrics correctly distinguishes gross, net, and confirmed paid cash', () => {
  const mockOrders: Order[] = [
    {
      id: 'ord-1',
      orderNumber: 'ORD-1',
      customer: { fullName: 'A', email: 'a@test.com', phone: '123', street: 'St', postalCode: '1', city: 'C', country: 'US' },
      items: [],
      subtotal: 200,
      discount: 20,
      shipping: 0,
      total: 180,
      currency: 'USD',
      originalAmount: 180,
      originalCurrency: 'USD',
      exchangeRateUsed: 120,
      conversionDate: '2026-10-23',
      paymentMethod: 'card',
      paymentStatus: 'paid', // PAID
      orderStatus: 'delivered',
      createdAt: '2026-10-23T05:00:00Z',
      updatedAt: '2026-10-23T05:00:00Z',
      timeline: [],
    },
    {
      id: 'ord-2',
      orderNumber: 'ORD-2',
      customer: { fullName: 'B', email: 'b@test.com', phone: '456', street: 'St', postalCode: '2', city: 'C', country: 'US' },
      items: [],
      subtotal: 300,
      discount: 0,
      shipping: 15,
      total: 315,
      currency: 'USD',
      originalAmount: 315,
      originalCurrency: 'USD',
      exchangeRateUsed: 120,
      conversionDate: '2026-10-23',
      paymentMethod: 'cod',
      paymentStatus: 'pending', // PENDING CASH
      orderStatus: 'pending',
      createdAt: '2026-10-23T06:00:00Z',
      updatedAt: '2026-10-23T06:00:00Z',
      timeline: [],
    },
  ];

  const metrics = calculateFinancialMetrics(mockOrders, 'USD', 120);

  // Gross = (180 + 20) + (315 + 0) = 515
  assert.equal(metrics.grossSales, 515);
  // Total discounts = 20
  assert.equal(metrics.totalDiscounts, 20);
  // Net sales = 515 - 20 - 0 = 495
  assert.equal(metrics.netSales, 495);
  // Confirmed Paid Cash = 180 (only the paid order)
  assert.equal(metrics.confirmedPaidRevenue, 180);
  // Pending payments = 315 (unpaid COD order)
  assert.equal(metrics.pendingPayments, 315);
  assert.equal(metrics.paidOrdersCount, 1);
  assert.equal(metrics.totalOrdersCount, 2);
});
