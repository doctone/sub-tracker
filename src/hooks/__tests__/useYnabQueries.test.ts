import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import {
  useBudgets,
  useTransactions,
  useDefaultBudget,
  useRecentTransactions,
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
      mockYnabApiClient.mockImplementation(() => ({
        getBudgets: mockGetBudgets,
      }) as unknown as YnabApiClient)

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
      mockYnabApiClient.mockImplementation(() => ({
        getBudgets: mockGetBudgets,
      }) as unknown as YnabApiClient)

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
        transactions: mockTransactions 
      })
      mockYnabApiClient.mockImplementation(() => ({
        getTransactions: mockGetTransactions,
      }) as unknown as YnabApiClient)

      const { result } = renderHook(
        () => useTransactions('test-token', 'budget-1', '2023-01-01'),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockTransactions)
      expect(mockGetTransactions).toHaveBeenCalledWith('budget-1', '2023-01-01', undefined)
    })

    it('should not fetch when required params are missing', () => {
      const { result } = renderHook(
        () => useTransactions('test-token', null),
        { wrapper: createWrapper() }
      )

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
        transactions: mockTransactions 
      })
      mockYnabApiClient.mockImplementation(() => ({
        getTransactions: mockGetTransactions,
      }) as unknown as YnabApiClient)

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
})