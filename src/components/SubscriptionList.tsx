import {
  formatCurrency,
  getNextExpectedDate,
} from '../utils/subscriptionAnalysis'
import type { SubscriptionPattern } from '../utils/subscriptionAnalysis'

interface SubscriptionListProps {
  subscriptions: SubscriptionPattern[]
  currencySymbol: string
}

export function SubscriptionList({
  subscriptions,
  currencySymbol,
}: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="subscription-empty">
        No subscription patterns found. Try adding more historical data by
        increasing the analysis period.
      </div>
    )
  }

  return (
    <div className="subscription-container">
      <h2 className="subscription-title">
        Detected Subscriptions ({subscriptions.length})
      </h2>

      <div className="subscription-grid">
        {subscriptions.map((subscription, index) => {
          const nextDate = getNextExpectedDate(subscription)

          return (
            <div
              key={`${subscription.payeeName}-${index}`}
              className="subscription-card"
            >
              <div className="subscription-header">
                <h3 className="subscription-name">{subscription.payeeName}</h3>
                <div className="subscription-amount-info">
                  <div className="subscription-amount">
                    {formatCurrency(subscription.averageAmount, currencySymbol)}
                  </div>
                  <div className="subscription-frequency">
                    {subscription.frequency}
                  </div>
                </div>
              </div>

              <div className="subscription-details">
                <div className="subscription-detail-item">
                  <span className="subscription-label">Confidence:</span>
                  <div className="subscription-confidence">
                    <div className="confidence-bar">
                      <div
                        className={`confidence-fill ${
                          subscription.confidence > 0.8
                            ? 'confidence-high'
                            : subscription.confidence > 0.6
                              ? 'confidence-medium'
                              : 'confidence-low'
                        }`}
                        style={{ width: `${subscription.confidence * 100}%` }}
                      />
                    </div>
                    <span className="confidence-text">
                      {Math.round(subscription.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="subscription-detail-item">
                  <span className="subscription-label">Last Payment:</span>
                  <div className="subscription-value">
                    {new Date(
                      subscription.lastTransactionDate
                    ).toLocaleDateString()}
                  </div>
                </div>

                {nextDate && (
                  <div className="subscription-detail-item">
                    <span className="subscription-label">Next Expected:</span>
                    <div className="subscription-value">
                      {new Date(nextDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="subscription-footer">
                <div className="subscription-meta">
                  <span className="subscription-meta-item">
                    {subscription.amounts.length} transactions
                  </span>
                  <span className="subscription-separator">•</span>
                  <span className="subscription-meta-item">
                    Accounts: {subscription.accountNames.join(', ')}
                  </span>
                  {subscription.amounts.length > 1 && (
                    <>
                      <span className="subscription-separator">•</span>
                      <span className="subscription-meta-item">
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
