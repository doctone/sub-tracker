import { useState, useEffect } from 'react'
import { useYnabAuth } from '../hooks/useYnabAuth'
import {
  useBudgets,
  useDefaultBudget,
  useRecentTransactions,
  useSubscriptionAnalysis,
} from '../hooks/useYnabQueries'
import type { YnabBudget } from '../types/ynab'
import { SubscriptionSummary } from './SubscriptionSummary'
import { SubscriptionList } from './SubscriptionList'
import styles from './YnabDashboard.module.css'

export function YnabDashboard() {
  const { isAuthenticated, accessToken, logout } = useYnabAuth()
  const [selectedBudget, setSelectedBudget] = useState<YnabBudget | null>(null)
  const [showDetailedView, setShowDetailedView] = useState(false)

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

  const {
    data: subscriptions = [],
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
  } = useSubscriptionAnalysis(accessToken, selectedBudget?.id || null)

  // Auto-select the default budget when budgets are loaded
  useEffect(() => {
    if (defaultBudget && !selectedBudget) {
      setSelectedBudget(defaultBudget)
    }
  }, [defaultBudget, selectedBudget])

  const handleBudgetSelect = (budget: YnabBudget) => {
    setSelectedBudget(budget)
  }

  const loading = budgetsLoading || transactionsLoading || subscriptionsLoading
  const error =
    budgetsError?.message ||
    transactionsError?.message ||
    subscriptionsError?.message

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>YNAB Dashboard</h2>
        <button onClick={logout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading && <div className={styles.loading}>Loading...</div>}

      {budgets.length > 0 && (
        <div className={styles.budgetSelector}>
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
        <div className={styles.budgetInfo}>
          <h3>Budget: {selectedBudget.name}</h3>
          <div className={styles.budgetDetails}>
            <p>
              <strong>Currency:</strong>{' '}
              {selectedBudget.currency_format.iso_code}
            </p>
            <p>
              <strong>Accounts:</strong> {selectedBudget.accounts?.length}
            </p>
          </div>

          <div className={styles.spaceY6}>
            {showDetailedView ? (
              <SubscriptionList
                subscriptions={subscriptions}
                currencySymbol={selectedBudget.currency_format.currency_symbol}
                onToggleSummary={() => setShowDetailedView(false)}
              />
            ) : (
              <SubscriptionSummary
                subscriptions={subscriptions}
                currencySymbol={selectedBudget.currency_format.currency_symbol}
                onToggleDetailed={() => setShowDetailedView(true)}
              />
            )}

            {transactions.length > 0 && (
              <div className={styles.transactionsSummary}>
                <h4>Recent Transactions: {transactions.length}</h4>
                <div className={styles.transactionList}>
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className={styles.transactionItem}>
                      <span className={styles.date}>{transaction.date}</span>
                      <span className={styles.payee}>
                        {transaction.payee_name || 'Unknown'}
                      </span>
                      <span className={styles.amount}>
                        {selectedBudget.currency_format.currency_symbol}
                        {(transaction.amount / 1000).toFixed(2)}
                      </span>
                      <span className={styles.account}>
                        {transaction.account_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
