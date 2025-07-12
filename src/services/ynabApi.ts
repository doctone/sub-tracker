import type {
  YnabBudgetsResponse,
  YnabTransactionsResponse,
} from '../types/ynab'

export class YnabApiClient {
  private baseUrl = '/api/ynab'
  private accessToken: string
  private lastRequestTime = 0
  private readonly minRequestInterval = 200 // 200ms between requests

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request<T>(endpoint: string): Promise<T> {
    return this.requestWithRetry<T>(endpoint)
  }

  private async requestWithRetry<T>(endpoint: string, retries = 3): Promise<T> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      )
    }

    this.lastRequestTime = Date.now()

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please check your access token')
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      if (
        retries > 0 &&
        error instanceof Error &&
        !error.message.includes('401')
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.requestWithRetry<T>(endpoint, retries - 1)
      }
      throw error
    }
  }

  async getBudgets(): Promise<YnabBudgetsResponse> {
    return this.request<YnabBudgetsResponse>('/budgets')
  }

  async getTransactions(
    budgetId: string,
    sinceDate?: string,
    type?: 'uncategorized' | 'unapproved'
  ): Promise<YnabTransactionsResponse> {
    const params = new URLSearchParams()
    if (sinceDate) params.set('since_date', sinceDate)
    if (type) params.set('type', type)

    const queryString = params.toString()
    const endpoint = `/budgets/${budgetId}/transactions${queryString ? `?${queryString}` : ''}`

    return this.request<YnabTransactionsResponse>(endpoint)
  }

  async getTransactionsByAccount(
    budgetId: string,
    accountId: string,
    sinceDate?: string
  ): Promise<YnabTransactionsResponse> {
    const params = new URLSearchParams()
    if (sinceDate) params.set('since_date', sinceDate)

    const queryString = params.toString()
    const endpoint = `/budgets/${budgetId}/accounts/${accountId}/transactions${queryString ? `?${queryString}` : ''}`

    return this.request<YnabTransactionsResponse>(endpoint)
  }
}
