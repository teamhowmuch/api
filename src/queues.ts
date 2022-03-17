import { AccountDetails } from './bank-connections/models/AccountDetails'
import { Transaction } from './bank-connections/models/transaction'
import { UserBankConnection } from './entities/UserBankConnection'

// -----
export const transaction = 'transaction'
export interface TransactionData {
  bankConnection: UserBankConnection
  account: AccountDetails
  transaction: Transaction
}

export const flatList = [transaction]
