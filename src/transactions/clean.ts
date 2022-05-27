import hasher from 'node-object-hash'
import { Transaction } from 'src/bank-connections/models/transaction'

export interface CleanedTransaction {
  id: string
  bookingDate: Date | null
  valueDate: Date | null
  amount: number
  currency: string
  remittance: string
  additionalInformation: string
  creditorName: string | null
  debtorName: string | null
}

const hash = hasher({ sort: true, coerce: true })

function generateTransactionId(transaction: Transaction) {
  return hash.hash(transaction)
}

function extractAmount(transaction: Transaction) {
  return Number(transaction.transactionAmount.amount)
}

function extractCurrency(transaction: Transaction) {
  return transaction.transactionAmount.currency.toLowerCase()
}

function extractBookingDate(transaction: Transaction): Date | null {
  return transaction.bookingDate ? new Date(transaction.bookingDate) : null
}

function extractValueDate(transaction: Transaction): Date {
  return transaction.valueDate ? new Date(transaction.valueDate) : null
}

function extractRemittance(transaction: Transaction) {
  return [
    transaction.remittanceInformationStructured,
    transaction.remittanceInformationUnstructured,
    transaction.remittanceInformationStructuredArray,
    transaction.remittanceInformationUnstructuredArray,
  ]
    .flat()
    .filter((e) => e)
    .join(' ')
}

function extractCreditorName(transaction: Transaction) {
  return transaction.creditorName || null
}

function extractDebtorName(transaction: Transaction) {
  return transaction.debtorName || null
}

function extractAdditionalInformation(transaction: Transaction) {
  return [transaction.additionalInformation, transaction.additionalInformationStructured]
    .flat()
    .filter((e) => e)
    .join(' ')
}

export async function clean(transaction: Transaction): Promise<CleanedTransaction> {
  return {
    id: generateTransactionId(transaction),
    bookingDate: extractBookingDate(transaction),
    valueDate: extractValueDate(transaction),
    amount: extractAmount(transaction),
    currency: extractCurrency(transaction),
    remittance: extractRemittance(transaction),
    additionalInformation: extractAdditionalInformation(transaction),
    creditorName: extractCreditorName(transaction),
    debtorName: extractDebtorName(transaction),
  }
}
