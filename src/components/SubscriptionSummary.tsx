import styles from './SubscriptionSummary.module.css'
import { formatCurrency } from '../utils/subscriptionAnalysis'
import type { SubscriptionPattern } from '../utils/subscriptionAnalysis'

interface SubscriptionSummaryProps {
  subscriptions: SubscriptionPattern[]
  currencySymbol: string
  onToggleDetailed?: () => void
}

export function SubscriptionSummary({
  subscriptions,
  currencySymbol,
  onToggleDetailed,
}: SubscriptionSummaryProps) {
  if (subscriptions.length === 0) {
    return (
      <main className={styles.container}>
        <section className={styles.emptyState}>
          <svg
            className={styles.illustration}
            width="96"
            height="96"
            fill="none"
            viewBox="0 0 96 96"
          >
            <rect width="96" height="96" rx="20" fill="#23232B" />
            <rect x="20" y="36" width="56" height="32" rx="6" fill="#353545" />
            <rect x="28" y="44" width="40" height="8" rx="2" fill="#44445A" />
            <rect x="28" y="56" width="24" height="4" rx="2" fill="#44445A" />
          </svg>
          <div className={styles.emptyTitle}>No subscriptions found.</div>
          <div className={styles.emptyText}>
            No subscription patterns found. Try adding more historical data by
            increasing the analysis period.
          </div>
        </section>
      </main>
    )
  }

  // Calculate key metrics
  const totalSubscriptions = subscriptions.length
  const highConfidenceCount = subscriptions.filter(
    (s) => s.confidence > 0.8
  ).length
  const mediumConfidenceCount = subscriptions.filter(
    (s) => s.confidence > 0.6 && s.confidence <= 0.8
  ).length
  const lowConfidenceCount = subscriptions.filter(
    (s) => s.confidence <= 0.6
  ).length

  const monthlyTotal = subscriptions
    .filter((sub) => sub.confidence > 0.7) // Only include high confidence subscriptions
    .reduce((sum, sub) => {
      if (sub.frequency === 'monthly') return sum + sub.averageAmount
      if (sub.frequency === 'yearly') return sum + sub.averageAmount / 12
      if (sub.frequency === 'weekly') return sum + sub.averageAmount * 4.33
      return sum + sub.averageAmount // Default to monthly for unknown
    }, 0)

  const yearlyTotal = monthlyTotal * 12
  const averageConfidence =
    subscriptions.reduce((sum, sub) => sum + sub.confidence, 0) /
    totalSubscriptions

  const topSubscriptions = subscriptions
    .filter((s) => s.confidence > 0.7)
    .sort((a, b) => b.averageAmount - a.averageAmount)
    .slice(0, 3)

  return (
    <main className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Your Subscriptions</h1>
      </header>

      {/* Summary Cards */}
      <section className={styles.summarySection}>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryValue}>{totalSubscriptions}</span>{' '}
            subscriptions
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryValue}>
              {formatCurrency(monthlyTotal, currencySymbol)}
            </span>{' '}
            / month
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryValue}>
              {Math.round(averageConfidence * 100)}%
            </span>{' '}
            avg confidence
          </div>
        </div>
      </section>

      {/* Detailed Overview Cards */}
      <section className={styles.detailSection}>
        <div className={styles.detailCard}>
          <h3 className={styles.detailCardTitle}>Spending Overview</h3>
          <div className={styles.spendingGrid}>
            <div>
              <div className={styles.metricLabel}>Monthly Total</div>
              <div className={styles.metricValue}>
                {formatCurrency(monthlyTotal, currencySymbol)}
              </div>
            </div>
            <div>
              <div className={styles.metricLabel}>Annual Total</div>
              <div className={styles.metricValue}>
                {formatCurrency(yearlyTotal, currencySymbol)}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.detailCardTitle}>Detection Confidence</h3>
          <div className={styles.confidenceList}>
            <div className={styles.confidenceItem}>
              <span className={styles.confidenceLabel}>
                High confidence ({'>'} 80%)
              </span>
              <div className={styles.confidenceValue}>
                <span className={styles.confidenceCount}>
                  {highConfidenceCount}
                </span>
                <div
                  className={`${styles.confidenceDot} ${styles.confidenceDotHigh}`}
                ></div>
              </div>
            </div>
            {mediumConfidenceCount > 0 && (
              <div className={styles.confidenceItem}>
                <span className={styles.confidenceLabel}>
                  Medium confidence (60-80%)
                </span>
                <div className={styles.confidenceValue}>
                  <span className={styles.confidenceCount}>
                    {mediumConfidenceCount}
                  </span>
                  <div
                    className={`${styles.confidenceDot} ${styles.confidenceDotMedium}`}
                  ></div>
                </div>
              </div>
            )}
            {lowConfidenceCount > 0 && (
              <div className={styles.confidenceItem}>
                <span className={styles.confidenceLabel}>
                  Needs review ({'<'} 60%)
                </span>
                <div className={styles.confidenceValue}>
                  <span className={styles.confidenceCount}>
                    {lowConfidenceCount}
                  </span>
                  <div
                    className={`${styles.confidenceDot} ${styles.confidenceDotLow}`}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {topSubscriptions.length > 0 && (
          <div className={styles.detailCard}>
            <h3 className={styles.detailCardTitle}>Largest Subscriptions</h3>
            <div className={styles.topSubscriptionsList}>
              {topSubscriptions.map((sub) => (
                <div key={sub.payeeName} className={styles.topSubscriptionItem}>
                  <div className={styles.topSubscriptionInfo}>
                    <div className={styles.topSubscriptionAvatar}>
                      <span className={styles.topSubscriptionAvatarText}>
                        {sub.payeeName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className={styles.topSubscriptionName}>
                        {sub.payeeName}
                      </div>
                      <div className={styles.topSubscriptionFrequency}>
                        {sub.frequency}
                      </div>
                    </div>
                  </div>
                  <div className={styles.topSubscriptionAmount}>
                    {formatCurrency(sub.averageAmount, currencySymbol)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          onClick={onToggleDetailed}
          disabled={!onToggleDetailed}
        >
          View Detailed List
        </button>
      </div>
    </main>
  )
}
