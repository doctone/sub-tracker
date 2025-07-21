import {
  formatCurrency,
  getNextExpectedDate,
} from '../utils/subscriptionAnalysis'
import type { SubscriptionPattern } from '../utils/subscriptionAnalysis'
import styles from './SubscriptionList.module.css'

interface SubscriptionListProps {
  subscriptions: SubscriptionPattern[]
  currencySymbol: string
  onToggleSummary?: () => void
}

export function SubscriptionList({
  subscriptions,
  currencySymbol,
  onToggleSummary,
}: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className={styles.empty}>
        No subscription patterns found. Try adding more historical data by
        increasing the analysis period.
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>
          Detected Subscriptions ({subscriptions.length})
        </h2>
        {onToggleSummary && (
          <button className={styles.toggle} onClick={onToggleSummary}>
            Back to Summary
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {subscriptions.map((subscription, index) => {
          const nextDate = getNextExpectedDate(subscription)

          return (
            <div
              key={`${subscription.payeeName}-${index}`}
              className={styles.card}
            >
              <div className={styles.header}>
                <h3 className={styles.name}>{subscription.payeeName}</h3>
                <div className={styles.amountInfo}>
                  <div className={styles.amount}>
                    {formatCurrency(subscription.averageAmount, currencySymbol)}
                  </div>
                  <div className={styles.frequency}>
                    {subscription.frequency}
                  </div>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Confidence:</span>
                  <div className={styles.confidence}>
                    <div className={styles.confidenceBar}>
                      <div
                        className={`${styles.confidenceFill} ${
                          subscription.confidence > 0.8
                            ? styles.confidenceHigh
                            : subscription.confidence > 0.6
                              ? styles.confidenceMedium
                              : styles.confidenceLow
                        }`}
                        style={{ width: `${subscription.confidence * 100}%` }}
                      />
                    </div>
                    <span className={styles.confidenceText}>
                      {Math.round(subscription.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.label}>Last Payment:</span>
                  <div className={styles.value}>
                    {new Date(
                      subscription.lastTransactionDate
                    ).toLocaleDateString()}
                  </div>
                </div>

                {nextDate && (
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Next Expected:</span>
                    <div className={styles.value}>
                      {new Date(nextDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.footer}>
                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    {subscription.amounts.length} transactions
                  </span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.metaItem}>
                    Accounts: {subscription.accountNames.join(', ')}
                  </span>
                  {subscription.amounts.length > 1 && (
                    <>
                      <span className={styles.separator}>•</span>
                      <span className={styles.metaItem}>
                        Range:{' '}
                        {formatCurrency(
                          Math.min(...subscription.amounts),
                          currencySymbol
                        )}{' '}
                        -{' '}
                        {formatCurrency(
                          Math.max(...subscription.amounts),
                          currencySymbol
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
