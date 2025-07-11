import { useState, useEffect, useCallback } from 'react';
import { useYnabAuth } from '../hooks/useYnabAuth';
import { YnabApiClient } from '../services/ynabApi';
import type { YnabBudget, YnabTransaction } from '../types/ynab';

export function YnabDashboard() {
  const { isAuthenticated, accessToken, logout } = useYnabAuth();
  const [budgets, setBudgets] = useState<YnabBudget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<YnabBudget | null>(null);
  const [transactions, setTransactions] = useState<YnabTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiClient = accessToken ? new YnabApiClient(accessToken) : null;

  const fetchBudgets = useCallback(async () => {
    if (!apiClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getBudgets();
      setBudgets(response.budgets);
      
      // Auto-select the default budget if available
      if (response.default_budget) {
        setSelectedBudget(response.default_budget);
      } else if (response.budgets.length > 0) {
        setSelectedBudget(response.budgets[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    if (isAuthenticated && apiClient) {
      fetchBudgets();
    }
  }, [isAuthenticated, apiClient, fetchBudgets]);

  const fetchTransactions = async (budgetId: string) => {
    if (!apiClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get transactions from the last 12 months
      const sinceDate = new Date();
      sinceDate.setMonth(sinceDate.getMonth() - 12);
      const sinceDateStr = sinceDate.toISOString().split('T')[0];
      
      const response = await apiClient.getTransactions(budgetId, sinceDateStr);
      setTransactions(response.transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSelect = (budget: YnabBudget) => {
    setSelectedBudget(budget);
    fetchTransactions(budget.id);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="ynab-dashboard">
      <div className="dashboard-header">
        <h2>YNAB Dashboard</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading...</div>}

      {budgets.length > 0 && (
        <div className="budget-selector">
          <h3>Select Budget:</h3>
          <select
            value={selectedBudget?.id || ''}
            onChange={(e) => {
              const budget = budgets.find(b => b.id === e.target.value);
              if (budget) handleBudgetSelect(budget);
            }}
          >
            <option value="">Choose a budget...</option>
            {budgets.map(budget => (
              <option key={budget.id} value={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedBudget && (
        <div className="budget-info">
          <h3>Budget: {selectedBudget.name}</h3>
          <p>Currency: {selectedBudget.currency_format.iso_code}</p>
          <p>Accounts: {selectedBudget.accounts.length}</p>
          
          {transactions.length > 0 && (
            <div className="transactions-summary">
              <h4>Recent Transactions: {transactions.length}</h4>
              <div className="transaction-list">
                {transactions.slice(0, 10).map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <span className="date">{transaction.date}</span>
                    <span className="payee">{transaction.payee_name || 'Unknown'}</span>
                    <span className="amount">
                      {selectedBudget.currency_format.currency_symbol}
                      {(transaction.amount / 1000).toFixed(2)}
                    </span>
                    <span className="account">{transaction.account_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}