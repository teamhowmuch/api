import { knownMerchants, KnownMerchant } from './categories'
import { CleanedTransaction } from './clean'

export function extractMerchant(cleanedTransactions: CleanedTransaction): KnownMerchant | null {
  const mashedLookupString = [cleanedTransactions.creditorName, cleanedTransactions.remittance]
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
