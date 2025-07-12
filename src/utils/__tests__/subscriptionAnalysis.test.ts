import { describe, it, expect } from 'vitest'
import {
  analyzeSubscriptions,
  formatCurrency,
  getNextExpectedDate,
  type SubscriptionPattern,
} from '../subscriptionAnalysis'
import type { YnabTransaction } from '../../types/ynab'

// Helper function to create mock transaction
function createTransaction(
  overrides: Partial<YnabTransaction> = {}
): YnabTransaction {
  return {
    id: 'tx-123',
    date: '2024-01-01',
    amount: -1000, // $10.00 (YNAB stores as milliunits)
    memo: null,
    cleared: 'cleared',
    approved: true,
    flag_color: null,
    flag_name: null,
    account_id: 'acc-123',
    payee_id: 'payee-123',
    category_id: 'cat-123',
    transfer_account_id: null,
    transfer_transaction_id: null,
    matched_transaction_id: null,
    import_id: null,
    import_payee_name: null,
    import_payee_name_original: null,
    debt_transaction_type: null,
    deleted: false,
    account_name: 'Checking',
    payee_name: 'Netflix',
    category_name: 'Entertainment',
    subtransactions: [],
    ...overrides,
  }
}

describe('analyzeSubscriptions', () => {
  it('should return empty array for no transactions', () => {
    const result = analyzeSubscriptions([])
    expect(result).toEqual([])
  })

  it('should ignore payees with only one transaction', () => {
    const transactions = [createTransaction({ payee_name: 'One Time Store' })]
    const result = analyzeSubscriptions(transactions)
    expect(result).toEqual([])
  })

  it('should identify monthly subscription pattern', () => {
    const transactions = [
      createTransaction({
        id: 'tx-1',
        date: '2024-01-15',
        amount: -1499, // $14.99
        payee_name: 'Netflix',
      }),
      createTransaction({
        id: 'tx-2',
        date: '2024-02-15',
        amount: -1499,
        payee_name: 'Netflix',
      }),
      createTransaction({
        id: 'tx-3',
        date: '2024-03-15',
        amount: -1499,
        payee_name: 'Netflix',
      }),
    ]

    const result = analyzeSubscriptions(transactions)
    expect(result).toHaveLength(1)

    const subscription = result[0]
    expect(subscription.payeeName).toBe('Netflix')
    expect(subscription.frequency).toBe('monthly')
    expect(subscription.averageAmount).toBe(1499)
    expect(subscription.confidence).toBeGreaterThan(0.5)
    expect(subscription.accountNames).toEqual(['Checking'])
  })

  it('should identify weekly subscription pattern', () => {
    const transactions = [
      createTransaction({
        id: 'tx-1',
        date: '2024-01-01',
        amount: -500, // $5.00
        payee_name: 'Coffee Shop',
      }),
      createTransaction({
        id: 'tx-2',
        date: '2024-01-08',
        amount: -500,
        payee_name: 'Coffee Shop',
      }),
      createTransaction({
        id: 'tx-3',
        date: '2024-01-15',
        amount: -500,
        payee_name: 'Coffee Shop',
      }),
    ]

    const result = analyzeSubscriptions(transactions)
    expect(result).toHaveLength(1)

    const subscription = result[0]
    expect(subscription.payeeName).toBe('Coffee Shop')
    expect(subscription.frequency).toBe('weekly')
  })

  it('should handle irregular patterns with lower confidence', () => {
    const transactions = [
      createTransaction({
        id: 'tx-1',
        date: '2024-01-01',
        amount: -1000,
        payee_name: 'Irregular Store',
      }),
      createTransaction({
        id: 'tx-2',
        date: '2024-01-15', // 14 days later
        amount: -1200,
        payee_name: 'Irregular Store',
      }),
      createTransaction({
        id: 'tx-3',
        date: '2024-02-20', // 36 days later
        amount: -800,
        payee_name: 'Irregular Store',
      }),
    ]

    const result = analyzeSubscriptions(transactions)
    // Should still detect pattern but with lower confidence
    expect(result).toHaveLength(1)
    expect(result[0].confidence).toBeLessThan(0.8)
  })

  it('should sort results by confidence then by amount', () => {
    const transactions = [
      // High confidence, low amount subscription
      createTransaction({
        id: 'tx-1',
        date: '2024-01-01',
        amount: -500,
        payee_name: 'Small Sub',
      }),
      createTransaction({
        id: 'tx-2',
        date: '2024-02-01',
        amount: -500,
        payee_name: 'Small Sub',
      }),
      createTransaction({
        id: 'tx-3',
        date: '2024-03-01',
        amount: -500,
        payee_name: 'Small Sub',
      }),
      // Lower confidence, high amount subscription
      createTransaction({
        id: 'tx-4',
        date: '2024-01-01',
        amount: -5000,
        payee_name: 'Big Sub',
      }),
      createTransaction({
        id: 'tx-5',
        date: '2024-01-20', // irregular timing
        amount: -5000,
        payee_name: 'Big Sub',
      }),
      createTransaction({
        id: 'tx-6',
        date: '2024-03-10', // irregular timing
        amount: -5000,
        payee_name: 'Big Sub',
      }),
    ]

    const result = analyzeSubscriptions(transactions)
    expect(result).toHaveLength(2)
    // Small Sub should come first due to higher confidence
    expect(result[0].payeeName).toBe('Small Sub')
    expect(result[1].payeeName).toBe('Big Sub')
  })
})

describe('formatCurrency', () => {
  it('should format YNAB milliunits to currency', () => {
    expect(formatCurrency(1499, '$')).toBe('$1.50')
    expect(formatCurrency(10000, '$')).toBe('$10.00')
    expect(formatCurrency(500, '£')).toBe('£0.50')
  })
})

describe('getNextExpectedDate', () => {
  it('should calculate next monthly date', () => {
    const pattern: SubscriptionPattern = {
      payeeName: 'Netflix',
      amounts: [1499],
      dates: ['2024-01-15'],
      averageAmount: 1499,
      frequency: 'monthly',
      confidence: 0.8,
      lastTransactionDate: '2024-01-15',
      accountNames: ['Checking'],
    }

    const nextDate = getNextExpectedDate(pattern)
    expect(nextDate).toBe('2024-02-15')
  })

  it('should calculate next weekly date', () => {
    const pattern: SubscriptionPattern = {
      payeeName: 'Coffee',
      amounts: [500],
      dates: ['2024-01-01'],
      averageAmount: 500,
      frequency: 'weekly',
      confidence: 0.8,
      lastTransactionDate: '2024-01-01',
      accountNames: ['Checking'],
    }

    const nextDate = getNextExpectedDate(pattern)
    expect(nextDate).toBe('2024-01-08')
  })

  it('should return null for unknown frequency', () => {
    const pattern: SubscriptionPattern = {
      payeeName: 'Unknown',
      amounts: [1000],
      dates: ['2024-01-01'],
      averageAmount: 1000,
      frequency: 'unknown',
      confidence: 0.5,
      lastTransactionDate: '2024-01-01',
      accountNames: ['Checking'],
    }

    const nextDate = getNextExpectedDate(pattern)
    expect(nextDate).toBeNull()
  })
})
