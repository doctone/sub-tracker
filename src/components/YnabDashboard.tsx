import { useState, useEffect } from 'react'
import { useYnabAuth } from '../hooks/useYnabAuth'
import {
  useBudgets,
  useDefaultBudget,
  useRecentTransactions,
} from '../hooks/useYnabQueries'
import type { YnabBudget } from '../types/ynab'

export function YnabDashboard() {
  const { isAuthenticated, accessToken, logout } = useYnabAuth()
  const [selectedBudget, setSelectedBudget] = useState<YnabBudget | null>(null)

  // Use TanStack Query hooks
  const {
    data: budgets = [],
    isLoading: budgetsLoading,
    error: budgetsError,
  } = useBudgets(accessToken)

  const defaultBudget = useDefaultBudget(budgets)

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useRecentTransactions(accessToken, selectedBudget?.id || null)

  // Auto-select the default budget when budgets are loaded
  useEffect(() => {
    if (defaultBudget && !selectedBudget) {
      setSelectedBudget(defaultBudget)
    }
  }, [defaultBudget, selectedBudget])

  const handleBudgetSelect = (budget: YnabBudget) => {
    setSelectedBudget(budget)
  }

  const loading = budgetsLoading || transactionsLoading
  const error = budgetsError?.message || transactionsError?.message

  if (!isAuthenticated) {
    return null
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
              const budget = budgets.find((b) => b.id === e.target.value)
              if (budget) handleBudgetSelect(budget)
            }}
          >
            <option value="">Choose a budget...</option>
            {budgets.map((budget) => (
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
          <p>Accounts: {selectedBudget.accounts?.length}</p>

          {transactions.length > 0 && (
            <div className="transactions-summary">
              <h4>Recent Transactions: {transactions.length}</h4>
              <div className="transaction-list">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <span className="date">{transaction.date}</span>
                    <span className="payee">
                      {transaction.payee_name || 'Unknown'}
                    </span>
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
  )
}
