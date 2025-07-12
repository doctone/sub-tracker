import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { YnabApiClient } from '../services/ynabApi'
import type {
  YnabBudgetsResponse,
  YnabTransactionsResponse,
  YnabBudget,
  YnabTransaction,
} from '../types/ynab'

export function useBudgets(
  accessToken: string | null
): UseQueryResult<YnabBudget[], Error> {
  return useQuery({
    queryKey: ['ynab', 'budgets'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('Access token is required')
      }
      const client = new YnabApiClient(accessToken)
      const response: YnabBudgetsResponse = await client.getBudgets()
      return response.budgets
    },
    enabled: !!accessToken,
    staleTime: 10 * 60 * 1000, // 10 minutes - budgets don't change often
  })
}

export function useTransactions(
  accessToken: string | null,
  budgetId: string | null,
  sinceDate?: string,
  type?: 'uncategorized' | 'unapproved'
): UseQueryResult<YnabTransaction[], Error> {
  return useQuery({
    queryKey: ['ynab', 'transactions', budgetId, sinceDate, type],
    queryFn: async () => {
      if (!accessToken || !budgetId) {
        throw new Error('Access token and budget ID are required')
      }
      const client = new YnabApiClient(accessToken)
      const response: YnabTransactionsResponse = await client.getTransactions(
        budgetId,
        sinceDate,
        type
      )

      return response.transactions
    },
    enabled: !!accessToken && !!budgetId,
    staleTime: 2 * 60 * 1000, // 2 minutes - transactions change more frequently
  })
}

export function useTransactionsByAccount(
  accessToken: string | null,
  budgetId: string | null,
  accountId: string | null,
  sinceDate?: string
): UseQueryResult<YnabTransaction[], Error> {
  return useQuery({
    queryKey: [
      'ynab',
      'transactions',
      'account',
      budgetId,
      accountId,
      sinceDate,
    ],
    queryFn: async () => {
      if (!accessToken || !budgetId || !accountId) {
        throw new Error('Access token, budget ID, and account ID are required')
      }
      const client = new YnabApiClient(accessToken)
      const response: YnabTransactionsResponse =
        await client.getTransactionsByAccount(budgetId, accountId, sinceDate)
      return response.transactions
    },
    enabled: !!accessToken && !!budgetId && !!accountId,
    staleTime: 2 * 60 * 1000, // 2 minutes - transactions change more frequently
  })
}

export function useDefaultBudget(
  budgets: YnabBudget[] | undefined
): YnabBudget | null {
  if (!budgets || budgets.length === 0) {
    return null
  }

  // Find the first budget (YNAB typically shows the default budget first)
  return budgets[0]
}

export function useRecentTransactions(
  accessToken: string | null,
  budgetId: string | null,
  monthsBack: number = 12
): UseQueryResult<YnabTransaction[], Error> {
  const sinceDate = new Date()
  sinceDate.setMonth(sinceDate.getMonth() - monthsBack)
  const sinceDateStr = sinceDate.toISOString().split('T')[0]

  return useTransactions(accessToken, budgetId, sinceDateStr)
}
