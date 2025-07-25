import styles from './SubscriptionList.module.css'
import type { SubscriptionPattern } from '../utils/subscriptionAnalysis'
import { SubscriptionItem } from './SubscriptionItem'

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
      <main className={styles.container}>
        <div className={styles.analysisInfo}>
          <div className={styles.analysisCard}>
            Based on <span className={styles.analysisValue}>{transactionCount}</span> transactions analysed
          </div>
        </div>
        <section className={styles.emptyState}>
          <svg className={styles.illustration} width="96" height="96" fill="none" viewBox="0 0 96 96">
            <rect width="96" height="96" rx="20" fill="#23232B"/>
            <rect x="20" y="36" width="56" height="32" rx="6" fill="#353545"/>
            <rect x="28" y="44" width="40" height="8" rx="2" fill="#44445A"/>
            <rect x="28" y="56" width="24" height="4" rx="2" fill="#44445A"/>
          </svg>
          <div className={styles.emptyTitle}>No subscriptions found.</div>
          <div className={styles.emptyText}>
            No subscription patterns found. Try adding more historical data by increasing the analysis period.
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.container}>
      <div className={styles.analysisInfo}>
        <div className={styles.analysisCard}>
          Based on <span className={styles.analysisValue}>{transactionCount}</span> transactions analysed
        </div>
      </div>

      <section className={styles.subscriptionsList}>
        {subscriptions.map((subscription, index) => (
          <SubscriptionItem
            key={`${subscription.payeeName}-${index}`}
            subscription={subscription}
            currencySymbol={currencySymbol}
            index={index}
          />
        ))}
      </section>
    </main>
  )
}