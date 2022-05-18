import { Transaction } from 'src/bank-connections/models/transaction'
import { knownMerchants, KnownMerchant } from './categories'

export function extractMerchant(transaction: Transaction): KnownMerchant | null {
  const {
    creditorName,
    remittanceInformationUnstructured,
    remittanceInformationStructured,
    remittanceInformationStructuredArray,
    remittanceInformationUnstructuredArray,
  } = transaction

  const mashedLookupString = [
    creditorName,
    remittanceInformationUnstructured,
    remittanceInformationStructured,
    remittanceInformationStructuredArray,
    remittanceInformationUnstructuredArray,
  ]
    .flat()
    .join(' ')
    .toLowerCase()

  if (mashedLookupString) {
    for (const merchant of knownMerchants) {
      if (mashedLookupString.includes(merchant.searchPattern)) {
        console.log(
          'Analysed lookupstring\n     ',
          mashedLookupString,
          '\n       and did resolve to:',
          merchant.name,
        )
        return merchant
      }
    }
    console.log('Analysed lookupstring', mashedLookupString, 'did resolve to nothing')
  }

  return null
}
