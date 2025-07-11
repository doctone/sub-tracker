import type { YnabApiResponse, YnabBudgetsResponse, YnabTransactionsResponse } from '../types/ynab';

export class YnabApiClient {
  private baseUrl = 'https://api.ynab.com/v1';
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`YNAB API error: ${response.status} ${response.statusText}`);
    }

    const data: YnabApiResponse<T> = await response.json();
    return data.data;
  }

  async getBudgets(): Promise<YnabBudgetsResponse> {
    return this.request<YnabBudgetsResponse>('/budgets');
  }

  async getTransactions(
    budgetId: string,
    sinceDate?: string,
    type?: 'uncategorized' | 'unapproved'
  ): Promise<YnabTransactionsResponse> {
    const params = new URLSearchParams();
    if (sinceDate) params.set('since_date', sinceDate);
    if (type) params.set('type', type);
    
    const queryString = params.toString();
    const endpoint = `/budgets/${budgetId}/transactions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<YnabTransactionsResponse>(endpoint);
  }

  async getTransactionsByAccount(
    budgetId: string,
    accountId: string,
    sinceDate?: string
  ): Promise<YnabTransactionsResponse> {
    const params = new URLSearchParams();
    if (sinceDate) params.set('since_date', sinceDate);
    
    const queryString = params.toString();
    const endpoint = `/budgets/${budgetId}/accounts/${accountId}/transactions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<YnabTransactionsResponse>(endpoint);
  }
}