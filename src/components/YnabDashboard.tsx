import { useState, useEffect } from 'react'
import { useYnabAuth } from '../hooks/useYnabAuth'
import {
  useBudgets,
  useDefaultBudget,
  useRecentTransactions,
  useSubscriptionAnalysis,
} from '../hooks/useYnabQueries'
import type { YnabBudget } from '../types/ynab'
import { SubscriptionList } from './SubscriptionList'
import styles from './YnabDashboard.module.css'
import { formatCurrency } from '../utils/subscriptionAnalysis'

export function YnabDashboard() {
  const { isAuthenticated, accessToken } = useYnabAuth()
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

  // Calculate summary card values
  const currencySymbol = selectedBudget?.currency_format.currency_symbol || '$'
  const now = new Date()
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate()
  )
  const highConfidenceRecentSubs = subscriptions.filter(
    (sub) =>
      sub.confidence > 0.7 &&
      new Date(sub.lastTransactionDate) >= threeMonthsAgo
  )
  const monthlySpend = highConfidenceRecentSubs.reduce((sum, sub) => {
    if (sub.frequency === 'monthly') return sum + sub.averageAmount
    if (sub.frequency === 'yearly') return sum + sub.averageAmount / 12
    if (sub.frequency === 'weekly') return sum + sub.averageAmount * 4.33
    return sum + sub.averageAmount
  }, 0)
  const yearlySpend = monthlySpend * 12
  // Placeholder for recent changes
  const recentChanges = '+2 new, 1 price increase'

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.appTitle}>SubTrack Pro</span>
          <span className={styles.ynabBadge}>with YNAB</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.syncStatus} title="YNAB Sync Status">
            <svg
              className={styles.syncIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 1v6h6" />
              <path d="M3 11V5h6" />
              <path d="M21 7A9 9 0 0 0 6.13 4.94M3 17a9 9 0 0 0 14.87 2.06" />
            </svg>
            <span className={styles.syncText}>Synced</span>
          </span>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User"
            className={styles.avatar}
          />
        </div>
      </header>

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

          <section className={styles.summaryCardsSection}>
            <div className={styles.summaryCards}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryCardLabel}>Monthly Spend</span>
                <span className={styles.summaryCardValue}>
                  {formatCurrency(monthlySpend, currencySymbol)}
                </span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryCardLabel}>Yearly Spend</span>
                <span className={styles.summaryCardValue}>
                  {formatCurrency(yearlySpend, currencySymbol)}
                </span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryCardLabel}>Recent Changes</span>
                <span className={styles.summaryCardValue}>{recentChanges}</span>
              </div>
            </div>
          </section>

          <div className={styles.spaceY6}>
            {loading ? (
              <div className={styles.loading}>Loading subscription data...</div>
            ) : (
              <SubscriptionList
                subscriptions={subscriptions}
                currencySymbol={selectedBudget.currency_format.currency_symbol}
                transactionCount={transactions.length}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
