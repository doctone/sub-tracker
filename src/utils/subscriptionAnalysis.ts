import type { YnabTransaction } from '../types/ynab'

export interface SubscriptionPattern {
  payeeName: string
  amounts: number[]
  dates: string[]
  averageAmount: number
  frequency: 'monthly' | 'weekly' | 'quarterly' | 'yearly' | 'unknown'
  confidence: number
  lastTransactionDate: string
  accountNames: string[]
}

export function analyzeSubscriptions(
  transactions: YnabTransaction[]
): SubscriptionPattern[] {
  // Group transactions by payee
  const payeeGroups = new Map<string, YnabTransaction[]>()

  transactions.forEach((transaction) => {
    // Only consider outgoing transactions (negative amounts) as potential subscriptions
    if (transaction.amount >= 0) return

    const payeeName = transaction.payee_name || 'Unknown'
    if (!payeeGroups.has(payeeName)) {
      payeeGroups.set(payeeName, [])
    }
    payeeGroups.get(payeeName)!.push(transaction)
  })

  const subscriptionPatterns: SubscriptionPattern[] = []

  // Analyze each payee for recurring patterns
  payeeGroups.forEach((payeeTransactions, payeeName) => {
    // Only consider payees with multiple transactions
    if (payeeTransactions.length < 2) return

    // Sort transactions by date
    const sortedTransactions = payeeTransactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Calculate intervals between transactions
    const intervals: number[] = []
    for (let i = 1; i < sortedTransactions.length; i++) {
      const prevDate = new Date(sortedTransactions[i - 1].date)
      const currentDate = new Date(sortedTransactions[i].date)
      const intervalDays =
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      intervals.push(intervalDays)
    }

    // Determine frequency pattern
    const frequency = determineFrequency(intervals)
    const confidence = calculateConfidence(intervals, sortedTransactions.length)

    // Only include patterns with reasonable confidence
    // For yearly patterns, allow as few as 2 transactions since they're less frequent
    const minTransactions = frequency === 'yearly' ? 2 : 3
    if (confidence > 0.25 && sortedTransactions.length >= minTransactions) {
      const amounts = sortedTransactions.map((t) => Math.abs(t.amount))
      const averageAmount =
        amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length
      const dates = sortedTransactions.map((t) => t.date)
      const accountNames = [
        ...new Set(sortedTransactions.map((t) => t.account_name)),
      ]

      subscriptionPatterns.push({
        payeeName,
        amounts,
        dates,
        averageAmount,
        frequency,
        confidence,
        lastTransactionDate: dates[dates.length - 1],
        accountNames,
      })
    }
  })

  // Sort by confidence first, then by next renewal date
  return subscriptionPatterns.sort((a, b) => {
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence
    }
    
    // If confidence is equal, sort by next renewal date
    const nextDateA = getNextExpectedDate(a)
    const nextDateB = getNextExpectedDate(b)
    
    // Handle null dates (put them last)
    if (!nextDateA && !nextDateB) return 0
    if (!nextDateA) return 1
    if (!nextDateB) return -1
    
    // Sort by date (earliest first)
    return new Date(nextDateA).getTime() - new Date(nextDateB).getTime()
  })
}

function determineFrequency(
  intervals: number[]
): 'monthly' | 'weekly' | 'quarterly' | 'yearly' | 'unknown' {
  if (intervals.length === 0) return 'unknown'

  const avgInterval =
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length

  // Weekly: 7 days ± 3 days
  if (avgInterval >= 4 && avgInterval <= 10) {
    return 'weekly'
  }

  // Monthly: 30 days ± 7 days
  if (avgInterval >= 23 && avgInterval <= 37) {
    return 'monthly'
  }

  // Quarterly: 90 days ± 15 days
  if (avgInterval >= 75 && avgInterval <= 105) {
    return 'quarterly'
  }

  // Yearly: 365 days ± 30 days
  if (avgInterval >= 335 && avgInterval <= 395) {
    return 'yearly'
  }

  return 'unknown'
}

function calculateConfidence(
  intervals: number[],
  transactionCount: number
): number {
  if (intervals.length === 0) return 0

  // Calculate variance in intervals
  const avgInterval =
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
  const variance =
    intervals.reduce(
      (sum, interval) => sum + Math.pow(interval - avgInterval, 2),
      0
    ) / intervals.length
  const standardDeviation = Math.sqrt(variance)

  // Lower standard deviation = higher confidence
  // Use a more forgiving formula for irregular patterns
  const consistencyScore = Math.max(
    0,
    1 - standardDeviation / (avgInterval + 1)
  )

  // More transactions = higher confidence
  // With broader dataset, scale the volume score better for different frequencies
  const volumeScore = Math.min(1, transactionCount / 24) // Cap at 24 transactions for better scaling

  return consistencyScore * 0.7 + volumeScore * 0.3
}

export function formatCurrency(amount: number, currencySymbol: string): string {
  return `${currencySymbol}${(amount / 1000).toFixed(2)}`
}

export function getNextExpectedDate(
  pattern: SubscriptionPattern
): string | null {
  if (pattern.frequency === 'unknown' || pattern.dates.length === 0) return null

  const lastDate = new Date(pattern.lastTransactionDate)
  const nextDate = new Date(lastDate)

  switch (pattern.frequency) {
    case 'weekly':
      nextDate.setDate(lastDate.getDate() + 7)
      break
    case 'monthly':
      nextDate.setMonth(lastDate.getMonth() + 1)
      break
    case 'quarterly':
      nextDate.setMonth(lastDate.getMonth() + 3)
      break
    case 'yearly':
      nextDate.setFullYear(lastDate.getFullYear() + 1)
      break
    default:
      return null
  }

  return nextDate.toISOString().split('T')[0]
}
