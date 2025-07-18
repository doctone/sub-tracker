import { formatCurrency } from '../utils/subscriptionAnalysis'
import type { SubscriptionPattern } from '../utils/subscriptionAnalysis'
import styles from './SubscriptionSummary.module.css'

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
      <div className={styles.empty}>
        No subscription patterns found. Try adding more historical data by
        increasing the analysis period.
      </div>
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
    <div className={styles.summary}>
      <h2 className={styles.title}>Subscription Overview</h2>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Your Subscription Spending</h3>
          <p className={styles.text}>
            <strong>{totalSubscriptions}</strong> subscription patterns found
          </p>
          <p className={styles.text}>
            <strong>{highConfidenceCount}</strong> high-confidence subscriptions
          </p>
          <p className={styles.text}>
            <strong>{formatCurrency(monthlyTotal, currencySymbol)}</strong> per month
          </p>
          <p className={styles.text}>
            <strong>{formatCurrency(yearlyTotal, currencySymbol)}</strong> annually
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Detection Confidence</h3>
          <p className={styles.text}>
            Our analysis has an average confidence of{' '}
            <strong>{Math.round(averageConfidence * 100)}%</strong>.
          </p>
          <p className={styles.text}>
            • <strong>{highConfidenceCount}</strong> highly confident subscriptions ({'>'}80%)
          </p>
          {mediumConfidenceCount > 0 && (
            <p className={styles.text}>
              • <strong>{mediumConfidenceCount}</strong> moderately confident (60-80%)
            </p>
          )}
          {lowConfidenceCount > 0 && (
            <p className={styles.text}>
              • <strong>{lowConfidenceCount}</strong> potential patterns that need review
            </p>
          )}
        </div>

        {topSubscriptions.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Largest Subscriptions</h3>
            {topSubscriptions.map((sub) => (
              <p key={sub.payeeName} className={styles.text}>
                • <strong>{sub.payeeName}</strong> - {formatCurrency(sub.averageAmount, currencySymbol)} {sub.frequency}
              </p>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.toggle}
            onClick={onToggleDetailed}
            disabled={!onToggleDetailed}
          >
            View Detailed List
          </button>
        </div>
      </div>
    </div>
  )
}
