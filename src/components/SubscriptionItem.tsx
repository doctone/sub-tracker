import styles from './SubscriptionItem.module.css'
import {
  formatCurrency,
  getNextExpectedDate,
} from '../utils/subscriptionAnalysis'
import type { SubscriptionPattern } from '../utils/subscriptionAnalysis'

interface SubscriptionItemProps {
  subscription: SubscriptionPattern
  currencySymbol: string
  index: number
}

export function SubscriptionItem({
  subscription,
  currencySymbol,
  index,
}: SubscriptionItemProps) {
  const nextDate = getNextExpectedDate(subscription)
  const confidencePercent = Math.round(subscription.confidence * 100)
  const isRenewalPast = nextDate ? new Date(nextDate) < new Date() : false

  const getConfidenceClass = () => {
    if (subscription.confidence > 0.8) return styles.confidenceHigh
    if (subscription.confidence > 0.6) return styles.confidenceMedium
    return styles.confidenceLow
  }

  const frequencyDisplay =
    subscription.frequency === 'monthly'
      ? 'Monthly'
      : subscription.frequency === 'yearly'
        ? 'Annual'
        : subscription.frequency === 'weekly'
          ? 'Weekly'
          : 'Unknown'

  // Generate logo URL using clearbit API
  const logoUrl = `https://logo.clearbit.com/${subscription.payeeName.toLowerCase().replace(/\s+/g, '')}.com`

  return (
    <div
      className={`${styles.subscriptionItem} ${
        isRenewalPast ? styles.subscriptionItemPast : ''
      }`}
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Company logo */}
      <div className={styles.logoContainer}>
        <img
          src={logoUrl}
          alt={`${subscription.payeeName} logo`}
          className={styles.logo}
          onError={(e) => {
            // Fallback to letter avatar if logo fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
        <div className={styles.logoFallback}>
          <span className={styles.logoFallbackText}>
            {subscription.payeeName.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.nameSection}>
            <span className={styles.name}>{subscription.payeeName}</span>
            <span
              className={`${styles.confidenceBadge} ${getConfidenceClass()}`}
            >
              {confidencePercent}%
            </span>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.price}>
            {formatCurrency(subscription.averageAmount, currencySymbol)}
            <span className={styles.frequency}>
              /{frequencyDisplay.toLowerCase().slice(0, 2)}
            </span>
          </div>
          <div
            className={`${styles.nextDate} ${
              isRenewalPast ? styles.nextDateOverdue : ''
            }`}
          >
            Next:{' '}
            {nextDate
              ? new Date(nextDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  )
}
