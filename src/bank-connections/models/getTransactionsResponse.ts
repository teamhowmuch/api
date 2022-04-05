import { Transaction } from './transaction'

export interface GetTransactionsResponse {
  transactions: {
    booked: Transaction[]
    pending: Partial<Transaction>[]
  }
}
