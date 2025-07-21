import {
  formatCurrency,
  getNextExpectedDate,
} from '../utils/subscriptionAnalysis'
import type { SubscriptionPattern } from '../utils/subscriptionAnalysis'
import styles from './SubscriptionList.module.css'

interface SubscriptionListProps {
  subscriptions: SubscriptionPattern[]
  currencySymbol: string
  transactionCount: number
}

export function SubscriptionList({
  subscriptions,
  currencySymbol,
  transactionCount,
}: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.summary}>
          Based on {transactionCount} transactions analysed
        </div>
        <div className={styles.empty}>
          No subscription patterns found. Try adding more historical data by
          increasing the analysis period.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        Based on {transactionCount} transactions analysed
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Subscription</th>
              <th className={styles.hideOnSmall}>Confidence</th>
              <th className={styles.hideOnSmall}>Frequency</th>
              <th>Cost ( est )</th>
              <th>Next Renewal</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription, index) => {
              const nextDate = getNextExpectedDate(subscription)
              const confidencePercent = Math.round(
                subscription.confidence * 100
              )
              const isRenewalPast = nextDate
                ? new Date(nextDate) < new Date()
                : false

              return (
                <tr
                  key={`${subscription.payeeName}-${index}`}
                  className={isRenewalPast ? styles.rowPast : ''}
                >
                  <td className={styles.nameCell}>{subscription.payeeName}</td>
                  <td
                    className={`${styles.confidenceCell} ${styles.hideOnSmall}`}
                  >
                    <span
                      className={`${styles.confidenceBadge} ${
                        subscription.confidence > 0.8
                          ? styles.confidenceHigh
                          : subscription.confidence > 0.6
                            ? styles.confidenceMedium
                            : styles.confidenceLow
                      }`}
                    >
                      {confidencePercent}%
                    </span>
                  </td>
                  <td
                    className={`${styles.frequencyCell} ${styles.hideOnSmall}`}
                  >
                    {subscription.frequency === 'monthly'
                      ? 'Monthly'
                      : subscription.frequency === 'yearly'
                        ? 'Annual'
                        : subscription.frequency === 'weekly'
                          ? 'Weekly'
                          : 'Unknown'}
                  </td>
                  <td className={styles.costCell}>
                    {formatCurrency(subscription.averageAmount, currencySymbol)}
                  </td>
                  <td
                    className={`${styles.renewalCell} ${isRenewalPast ? styles.renewalPast : ''}`}
                  >
                    {nextDate
                      ? new Date(nextDate).toLocaleDateString()
                      : 'Unknown'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
