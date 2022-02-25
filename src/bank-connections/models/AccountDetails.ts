export interface AccountDetails {
  nordigenId: string
  bban?: string // This data element is used for payment accounts which have no IBAN
  bic?: string //	 The BIC associated to the account.
  cashAccountType?: string // 	ExternalCashAccountType1Code from ISO 20022
  currency: string //	Account currency
  details?: string //	 characteristics of the account characteristics of the relevant card
  displayName?: string // as defined by the end user
  iban?: string
  linkedAccounts?: string
  msisdn?: string
  name?: string
  ownerAddressUnstructured?: string
  ownerName?: string // If there is more than one owner, then e.g. two names might be noted here.
  product?: string // Product Name of the Bank for this account, proprietary definition
  resourceId?: string // The account id of the given account in the financial institution
  status?: string // The value is one of the following: "enabled", "deleted","blocked"
  usage?: string // PRIV or ORGA
}
