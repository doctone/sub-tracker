export interface YnabBudget {
  id: string
  name: string
  last_modified_on: string
  first_month: string
  last_month: string
  date_format: {
    format: string
  }
  currency_format: {
    iso_code: string
    example_format: string
    decimal_digits: number
    decimal_separator: string
    symbol_first: boolean
    group_separator: string
    currency_symbol: string
    display_symbol: boolean
  }
  accounts: YnabAccount[]
}

export interface YnabAccount {
  id: string
  name: string
  type: string
  on_budget: boolean
  closed: boolean
  note: string | null
  balance: number
  cleared_balance: number
  uncleared_balance: number
  transfer_payee_id: string
  direct_import_linked: boolean
  direct_import_in_error: boolean
  last_reconciled_at: string | null
  debt_original_balance: number | null
  debt_interest_rates: object | null
  debt_minimum_payments: object | null
  debt_escrow_amounts: object | null
  deleted: boolean
}

export interface YnabTransaction {
  id: string
  date: string
  amount: number
  memo: string | null
  cleared: string
  approved: boolean
  flag_color: string | null
  flag_name: string | null
  account_id: string
  payee_id: string | null
  category_id: string | null
  transfer_account_id: string | null
  transfer_transaction_id: string | null
  matched_transaction_id: string | null
  import_id: string | null
  import_payee_name: string | null
  import_payee_name_original: string | null
  debt_transaction_type: string | null
  deleted: boolean
  account_name: string
  payee_name: string | null
  category_name: string | null
  subtransactions: YnabSubTransaction[]
}

export interface YnabSubTransaction {
  id: string
  transaction_id: string
  amount: number
  memo: string | null
  payee_id: string | null
  payee_name: string | null
  category_id: string | null
  category_name: string | null
  transfer_account_id: string | null
  transfer_transaction_id: string | null
  deleted: boolean
}

export interface YnabApiResponse<T> {
  data: T
}

export interface YnabBudgetsResponse {
  budgets: YnabBudget[]
  default_budget: YnabBudget | null
}

export interface YnabTransactionsResponse {
  transactions: YnabTransaction[]
  server_knowledge: number
}
