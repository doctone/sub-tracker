import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import {
  useBudgets,
  useTransactions,
  useDefaultBudget,
  useRecentTransactions,
  useSubscriptionAnalysis,
} from '../useYnabQueries'
import { YnabApiClient } from '../../services/ynabApi'

// Mock the YnabApiClient
vi.mock('../../services/ynabApi')

const mockYnabApiClient = vi.mocked(YnabApiClient)

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useYnabQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useBudgets', () => {
    it('should return budgets when access token is provided', async () => {
      const mockBudgets = [
        {
          id: '1',
          name: 'Test Budget',
          currency_format: {
            iso_code: 'USD',
            example_format: '123,456.78',
            decimal_digits: 2,
            decimal_separator: '.',
            symbol_first: true,
            group_separator: ',',
            currency_symbol: '$',
            display_symbol: true,
          },
          last_modified_on: '2023-01-01T00:00:00.000Z',
          first_month: '2023-01-01',
          last_month: '2023-12-01',
          date_format: { format: 'DD/MM/YYYY' },
          accounts: [],
        },
      ]
      const mockGetBudgets = vi.fn().mockResolvedValue({ budgets: mockBudgets })
      mockYnabApiClient.mockImplementation(
        () =>
          ({
            getBudgets: mockGetBudgets,
          }) as unknown as YnabApiClient
      )

      const { result } = renderHook(() => useBudgets('test-token'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockBudgets)
      expect(mockGetBudgets).toHaveBeenCalledTimes(1)
    })

    it('should not fetch when access token is null', () => {
      const { result } = renderHook(() => useBudgets(null), {
        wrapper: createWrapper(),
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle errors', async () => {
      const mockGetBudgets = vi.fn().mockRejectedValue(new Error('API Error'))
      mockYnabApiClient.mockImplementation(
        () =>
          ({
            getBudgets: mockGetBudgets,
          }) as unknown as YnabApiClient
      )

      const { result } = renderHook(() => useBudgets('test-token'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('API Error')
    })
  })

  describe('useTransactions', () => {
    it('should return transactions when required params are provided', async () => {
      const mockTransactions = [
        { id: '1', payee_name: 'Test Payee', amount: 1000, date: '2023-01-01' },
      ]
      const mockGetTransactions = vi.fn().mockResolvedValue({
        transactions: mockTransactions,
      })
      mockYnabApiClient.mockImplementation(
        () =>
          ({
            getTransactions: mockGetTransactions,
          }) as unknown as YnabApiClient
      )

      const { result } = renderHook(
        () => useTransactions('test-token', 'budget-1', '2023-01-01'),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockTransactions)
      expect(mockGetTransactions).toHaveBeenCalledWith(
        'budget-1',
        '2023-01-01',
        undefined
      )
    })

    it('should not fetch when required params are missing', () => {
      const { result } = renderHook(() => useTransactions('test-token', null), {
        wrapper: createWrapper(),
      })

      expect(result.current.data).toBeUndefined()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useDefaultBudget', () => {
    it('should return the first budget when budgets are provided', () => {
      const budgets = [
        {
          id: '1',
          name: 'Budget 1',
          currency_format: {
            iso_code: 'USD',
            example_format: '123,456.78',
            decimal_digits: 2,
            decimal_separator: '.',
            symbol_first: true,
            group_separator: ',',
            currency_symbol: '$',
            display_symbol: true,
          },
          last_modified_on: '2023-01-01T00:00:00.000Z',
          first_month: '2023-01-01',
          last_month: '2023-12-01',
          date_format: { format: 'DD/MM/YYYY' },
          accounts: [],
        },
        {
          id: '2',
          name: 'Budget 2',
          currency_format: {
            iso_code: 'EUR',
            example_format: '123.456,78',
            decimal_digits: 2,
            decimal_separator: ',',
            symbol_first: false,
            group_separator: '.',
            currency_symbol: '€',
            display_symbol: true,
          },
          last_modified_on: '2023-01-01T00:00:00.000Z',
          first_month: '2023-01-01',
          last_month: '2023-12-01',
          date_format: { format: 'DD/MM/YYYY' },
          accounts: [],
        },
      ]

      const defaultBudget = useDefaultBudget(budgets)
      expect(defaultBudget).toEqual(budgets[0])
    })

    it('should return null when no budgets are provided', () => {
      expect(useDefaultBudget(undefined)).toBe(null)
      expect(useDefaultBudget([])).toBe(null)
    })
  })

  describe('useRecentTransactions', () => {
    it('should fetch transactions with calculated since date', async () => {
      const mockTransactions = [
        { id: '1', payee_name: 'Test Payee', amount: 1000, date: '2023-01-01' },
      ]
      const mockGetTransactions = vi.fn().mockResolvedValue({
        transactions: mockTransactions,
      })
      mockYnabApiClient.mockImplementation(
        () =>
          ({
            getTransactions: mockGetTransactions,
          }) as unknown as YnabApiClient
      )

      const { result } = renderHook(
        () => useRecentTransactions('test-token', 'budget-1', 6),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockTransactions)
      expect(mockGetTransactions).toHaveBeenCalledWith(
        'budget-1',
        expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
        undefined
      )
    })
  })

  describe('useSubscriptionAnalysis', () => {
    it('should analyze transactions for subscription patterns', async () => {
      const mockTransactions = [
        {
          id: '1',
          payee_name: 'Netflix',
          amount: -1499, // $14.99
          date: '2024-01-15',
          transfer_account_id: null,
          deleted: false,
          approved: true,
          account_name: 'Checking',
          account_id: 'acc-1',
          memo: null,
          cleared: 'cleared',
          flag_color: null,
          flag_name: null,
          payee_id: 'payee-1',
          category_id: 'cat-1',
          category_name: 'Entertainment',
          transfer_transaction_id: null,
          matched_transaction_id: null,
          import_id: null,
          import_payee_name: null,
          import_payee_name_original: null,
          debt_transaction_type: null,
          subtransactions: [],
        },
        {
          id: '2',
          payee_name: 'Netflix',
          amount: -1499,
          date: '2024-02-15',
          transfer_account_id: null,
          deleted: false,
          approved: true,
          account_name: 'Checking',
          account_id: 'acc-1',
          memo: null,
          cleared: 'cleared',
          flag_color: null,
          flag_name: null,
          payee_id: 'payee-1',
          category_id: 'cat-1',
          category_name: 'Entertainment',
          transfer_transaction_id: null,
          matched_transaction_id: null,
          import_id: null,
          import_payee_name: null,
          import_payee_name_original: null,
          debt_transaction_type: null,
          subtransactions: [],
        },
        {
          id: '3',
          payee_name: 'Netflix',
          amount: -1499,
          date: '2024-03-15',
          transfer_account_id: null,
          deleted: false,
          approved: true,
          account_name: 'Checking',
          account_id: 'acc-1',
          memo: null,
          cleared: 'cleared',
          flag_color: null,
          flag_name: null,
          payee_id: 'payee-1',
          category_id: 'cat-1',
          category_name: 'Entertainment',
          transfer_transaction_id: null,
          matched_transaction_id: null,
          import_id: null,
          import_payee_name: null,
          import_payee_name_original: null,
          debt_transaction_type: null,
          subtransactions: [],
        },
      ]

      const mockGetTransactions = vi.fn().mockResolvedValue({
        transactions: mockTransactions,
      })
      mockYnabApiClient.mockImplementation(
        () =>
          ({
            getTransactions: mockGetTransactions,
          }) as unknown as YnabApiClient
      )

      const { result } = renderHook(
        () => useSubscriptionAnalysis('test-token', 'budget-1', 12),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(1)
      expect(result.current.data![0].payeeName).toBe('Netflix')
      expect(result.current.data![0].frequency).toBe('monthly')
      expect(result.current.data![0].averageAmount).toBe(1499)
    })

    it('should filter out transfers and income', async () => {
      const mockTransactions = [
        {
          id: '1',
          payee_name: 'Netflix',
          amount: -1499,
          date: '2024-01-15',
          transfer_account_id: null,
          deleted: false,
          approved: true,
          account_name: 'Checking',
          account_id: 'acc-1',
          memo: null,
          cleared: 'cleared',
          flag_color: null,
          flag_name: null,
          payee_id: 'payee-1',
          category_id: 'cat-1',
          category_name: 'Entertainment',
          transfer_transaction_id: null,
          matched_transaction_id: null,
          import_id: null,
          import_payee_name: null,
          import_payee_name_original: null,
          debt_transaction_type: null,
          subtransactions: [],
        },
        {
          id: '2',
          payee_name: 'Transfer',
          amount: -1000,
          date: '2024-01-16',
          transfer_account_id: 'other-account',
          deleted: false,
          approved: true,
          account_name: 'Checking',
          account_id: 'acc-1',
          memo: null,
          cleared: 'cleared',
          flag_color: null,
          flag_name: null,
          payee_id: 'payee-2',
          category_id: null,
          category_name: null,
          transfer_transaction_id: null,
          matched_transaction_id: null,
          import_id: null,
          import_payee_name: null,
          import_payee_name_original: null,
          debt_transaction_type: null,
          subtransactions: [],
        },
        {
          id: '3',
          payee_name: 'Salary',
          amount: 500000, // Income
          date: '2024-01-01',
          transfer_account_id: null,
          deleted: false,
          approved: true,
          account_name: 'Checking',
          account_id: 'acc-1',
          memo: null,
          cleared: 'cleared',
          flag_color: null,
          flag_name: null,
          payee_id: 'payee-3',
          category_id: 'cat-2',
          category_name: 'Income',
          transfer_transaction_id: null,
          matched_transaction_id: null,
          import_id: null,
          import_payee_name: null,
          import_payee_name_original: null,
          debt_transaction_type: null,
          subtransactions: [],
        },
      ]

      const mockGetTransactions = vi.fn().mockResolvedValue({
        transactions: mockTransactions,
      })
      mockYnabApiClient.mockImplementation(
        () =>
          ({
            getTransactions: mockGetTransactions,
          }) as unknown as YnabApiClient
      )

      const { result } = renderHook(
        () => useSubscriptionAnalysis('test-token', 'budget-1'),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Should return empty array since Netflix only has 1 transaction after filtering
      expect(result.current.data).toEqual([])
    })
  })
})
