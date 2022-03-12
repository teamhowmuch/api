import { AccountDetails } from './bank-connections/models/AccountDetails'
import { Transaction } from './bank-connections/models/transaction'
import { UserBankConnection } from './entities/UserBankConnection'
import { Transaction as TransactionEntity } from 'src/entities/Transaction'

// -----
export const cleanTransaction = 'cleanTransaction'
export interface CleanTransactionData {
  bankConnection: UserBankConnection
  account: AccountDetails
  transaction: Transaction
}

// -----
export const categoriseTransaction = 'categoriseTransaction'
export interface CategoriseTransactionData {
  bankConnection: UserBankConnection
  account: AccountDetails
  transaction: Transaction
  entity: TransactionEntity
}

// -----
export const purchasesFromTransactions = 'purchasesFromTransactions'
export interface PurchasesFromTransactionsData {
  transaction: TransactionEntity
}

export const flatList = [cleanTransaction, categoriseTransaction, purchasesFromTransactions]
